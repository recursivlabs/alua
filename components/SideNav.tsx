import * as React from 'react';
import { View, Text, Pressable, Platform, ScrollView, useWindowDimensions, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

const COLLAPSED_WIDTH = 60;
const EXPANDED_WIDTH = 220;
const AUTO_COLLAPSE_WIDTH = 1024;
const COLLAPSE_KEY = 'alua:sidebar:collapsed';

const C = {
  bg: '#FAF7F4',
  text: '#1A1A1A',
  textLight: '#6B6560',
  textMuted: '#A09890',
  accent: '#C4956A',
  dark: '#1A2F38',
  border: '#E8E0D8',
};

type NavItem = { name: string; label: string; icon: string; activeIcon: string; authOnly?: boolean; adminOnly?: boolean };

const ADMIN_EMAILS = ['jack@minds.com', 'jack@recursiv.io'];

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
  const [manualCollapsed, setManualCollapsed] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(COLLAPSE_KEY);
      if (saved !== null) setManualCollapsed(saved === 'true');
    }
  }, []);

  const autoCollapsed = windowWidth < AUTO_COLLAPSE_WIDTH;
  const collapsed = manualCollapsed !== null ? manualCollapsed : autoCollapsed;

  const toggle = React.useCallback(() => {
    setManualCollapsed(prev => {
      const next = !(prev !== null ? prev : windowWidth < AUTO_COLLAPSE_WIDTH);
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.localStorage.setItem(COLLAPSE_KEY, String(next));
      }
      return next;
    });
  }, [windowWidth]);

  React.useEffect(() => {
    setManualCollapsed(null);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.localStorage.removeItem(COLLAPSE_KEY);
    }
  }, [autoCollapsed]);

  return { collapsed, toggle, width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH };
}

export function SideNav({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = ADMIN_EMAILS.includes(user?.email?.toLowerCase() || '');
  const width = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  const isActive = (name: string) => {
    if (name === 'index') return pathname === '/' || pathname === '';
    return pathname.includes(name);
  };

  const filteredItems = NAV_ITEMS.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <View style={[s.container, { width, borderRightColor: C.border }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 40, paddingBottom: 24, justifyContent: 'space-between', minHeight: '100%' as any }}
        showsVerticalScrollIndicator={false}>
        <View>
          {/* Brand + toggle */}
          <View style={[s.brandRow, { justifyContent: collapsed ? 'center' : 'space-between', paddingHorizontal: collapsed ? 0 : 20 }]}>
            {collapsed ? (
              <Pressable onPress={onToggle} hitSlop={12}>
                <Text style={s.brandCollapsed}>A</Text>
              </Pressable>
            ) : (
              <>
                <Pressable onPress={() => router.push('/(tabs)')}>
                  <Text style={s.brand}>ALUA</Text>
                </Pressable>
                <Pressable onPress={onToggle} hitSlop={8} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 0.7, padding: 4 })}>
                  <Ionicons name="chevron-back" size={14} color={C.textMuted} />
                </Pressable>
              </>
            )}
          </View>

          {/* Divider */}
          <View style={[s.divider, { marginHorizontal: collapsed ? 12 : 20 }]} />

          {/* Nav items */}
          <View style={{ gap: 2, marginTop: 8 }}>
            {filteredItems.map((item) => {
              const active = isActive(item.name);
              return (
                <Pressable
                  key={item.name}
                  onPress={() => router.push(item.name === 'index' ? '/(tabs)' : `/(tabs)/${item.name}` as any)}
                  style={({ pressed }) => ([
                    s.navItem,
                    {
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      paddingHorizontal: collapsed ? 0 : 20,
                      marginHorizontal: collapsed ? 4 : 8,
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
                  {!collapsed && (
                    <Text style={[s.navLabel, { color: active ? C.accent : C.textLight, fontWeight: active ? '500' : '400' }]}>
                      {item.label}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: C.bg,
    borderRightWidth: 1,
    ...(Platform.OS === 'web' ? { transition: 'width 0.2s ease' } as any : {}),
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  brand: {
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 8,
    color: C.dark,
  },
  brandCollapsed: {
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 2,
    color: C.dark,
  },
  divider: {
    height: 0.5,
    backgroundColor: C.border,
    marginBottom: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderRadius: 6,
    ...(Platform.OS === 'web' ? { cursor: 'pointer', transition: 'background-color 0.15s ease' } as any : {}),
  },
  navLabel: {
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
