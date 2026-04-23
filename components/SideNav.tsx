import * as React from 'react';
import { View, Text, Pressable, Platform, ScrollView, useWindowDimensions, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

const EXPANDED_WIDTH = 220;
const COLLAPSE_KEY = 'alua:sidebar:collapsed';
const MOBILE_BREAKPOINT = 768;
const AUTO_COLLAPSE_WIDTH = 1024;

const C = {
  bg: '#FAF7F4',
  text: '#1A1A1A',
  textLight: '#6B6560',
  textMuted: '#A09890',
  accent: '#C4956A',
  dark: '#1A2F38',
  border: '#E8E0D8',
};

type NavItem = { name: string; label: string; icon: string; activeIcon: string; adminOnly?: boolean };

const ADMIN_EMAILS = ['jack+alua@minds.com', 'jack@recursiv.io', 'tmkrause16@gmail.com'];

const NAV_ITEMS: NavItem[] = [
  { name: 'index', label: 'Home', icon: 'water-outline', activeIcon: 'water' },
  { name: 'retreats', label: 'Retreats', icon: 'compass-outline', activeIcon: 'compass' },
  { name: 'experiences', label: 'Experiences', icon: 'sunny-outline', activeIcon: 'sunny' },
  { name: 'studio', label: 'Studio', icon: 'play-circle-outline', activeIcon: 'play-circle' },
  { name: 'about', label: 'About', icon: 'leaf-outline', activeIcon: 'leaf' },
  { name: 'faq', label: 'FAQ', icon: 'help-circle-outline', activeIcon: 'help-circle' },
  { name: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
  { name: 'admin', label: 'Admin', icon: 'settings-outline', activeIcon: 'settings', adminOnly: true },
];

export function useSidebarState() {
  const { width: windowWidth } = useWindowDimensions();
  const [open, setOpen] = React.useState(false);

  const isMobile = windowWidth < MOBILE_BREAKPOINT;
  const isNarrowDesktop = windowWidth >= MOBILE_BREAKPOINT && windowWidth < AUTO_COLLAPSE_WIDTH;

  // On mobile: hidden by default, opens as overlay
  // On narrow desktop: hidden by default, opens as overlay
  // On wide desktop: always visible

  const showSidebar = !isMobile && !isNarrowDesktop ? true : open;
  const isOverlay = isMobile || isNarrowDesktop;

  const toggle = React.useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  const close = React.useCallback(() => {
    setOpen(false);
  }, []);

  return { showSidebar, isOverlay, isMobile, toggle, close };
}

export function MenuButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={s.menuBtn} hitSlop={8}>
      <Ionicons name="menu-outline" size={24} color={C.dark} />
    </Pressable>
  );
}

export function SideNav({ isOverlay, onClose }: { isOverlay: boolean; onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = ADMIN_EMAILS.includes(user?.email?.toLowerCase() || '');

  const isActive = (name: string) => {
    if (name === 'index') return pathname === '/' || pathname === '';
    return pathname.includes(name);
  };

  const filteredItems = NAV_ITEMS.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  const handleNav = (name: string) => {
    router.push(name === 'index' ? '/(tabs)' : `/(tabs)/${name}` as any);
    if (isOverlay) onClose();
  };

  return (
    <>
      {/* Overlay backdrop */}
      {isOverlay && (
        <Pressable style={s.overlayBg} onPress={onClose} />
      )}

      <View style={[s.container, isOverlay && s.containerOverlay]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: 40, paddingBottom: 24, justifyContent: 'space-between', minHeight: '100%' as any }}
          showsVerticalScrollIndicator={false}>
          <View>
            {/* Brand + close */}
            <View style={s.brandRow}>
              <Pressable onPress={() => { router.push('/(tabs)'); if (isOverlay) onClose(); }}>
                <Text style={s.brand}>ALUA</Text>
              </Pressable>
              {isOverlay && (
                <Pressable onPress={onClose} hitSlop={8} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 0.7, padding: 4 })}>
                  <Ionicons name="close" size={20} color={C.textMuted} />
                </Pressable>
              )}
            </View>

            <View style={s.divider} />

            {/* Nav items */}
            <View style={{ gap: 2, marginTop: 8 }}>
              {filteredItems.map((item) => {
                const active = isActive(item.name);
                return (
                  <Pressable
                    key={item.name}
                    onPress={() => handleNav(item.name)}
                    style={({ pressed }) => ([
                      s.navItem,
                      {
                        backgroundColor: active ? C.accent + '12' : 'transparent',
                        opacity: pressed ? 0.7 : 1,
                      },
                    ] as any)}
                  >
                    <Ionicons
                      name={(active ? item.activeIcon : item.icon) as any}
                      size={18}
                      color={active ? C.accent : C.textMuted}
                    />
                    <Text style={[s.navLabel, { color: active ? C.accent : C.textLight, fontWeight: active ? '500' : '400' }]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  menuBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 50,
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}),
  },
  overlayBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 98,
  },
  container: {
    width: EXPANDED_WIDTH,
    backgroundColor: C.bg,
    borderRightWidth: 1,
    borderRightColor: C.border,
  },
  containerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 99,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  brand: {
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 8,
    color: C.dark,
  },
  divider: {
    height: 0.5,
    backgroundColor: C.border,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    borderRadius: 6,
    ...(Platform.OS === 'web' ? { cursor: 'pointer', transition: 'background-color 0.15s ease' } as any : {}),
  },
  navLabel: {
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
