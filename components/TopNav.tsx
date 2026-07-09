import * as React from 'react';
import { View, Text, Pressable, Platform, useWindowDimensions, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { openWaitlist } from '@/lib/waitlist';

const C = {
  bg: '#FAF7F4',
  text: '#1A1A1A',
  textLight: '#6B6560',
  textMuted: '#A09890',
  accent: '#C4956A',
  dark: '#1A2F38',
  border: '#E8E0D8',
  white: '#FFFFFF',
};

const ADMIN_EMAILS = ['jack+alua@minds.com', 'jack@recursiv.io', 'tmkrause16@gmail.com'];

type NavItem = { name: string; label: string; adminOnly?: boolean };

const LINKS: NavItem[] = [
  { name: 'retreats', label: 'Retreats' },
  { name: 'experiences', label: 'Experiences' },
  { name: 'studio', label: 'Studio' },
  { name: 'about', label: 'About' },
  { name: 'faq', label: 'FAQ' },
];

const webCursor = Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {};

export function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const [open, setOpen] = React.useState(false);

  const isNarrow = width < 900;
  const isAdmin = ADMIN_EMAILS.includes(user?.email?.toLowerCase() || '');

  const items = LINKS.concat(isAdmin ? [{ name: 'admin', label: 'Admin' }] : []);

  const isActive = (name: string) => pathname.includes(name);

  const go = (name: string) => {
    router.push(`/(tabs)/${name}` as any);
    setOpen(false);
  };

  const home = () => {
    router.push('/(tabs)');
    setOpen(false);
  };

  const Brand = (
    <Pressable onPress={home} style={webCursor}>
      <Text style={s.brand}>ALUA</Text>
    </Pressable>
  );

  const WaitlistBtn = (
    <Pressable onPress={openWaitlist} style={({ pressed }) => [s.cta, { opacity: pressed ? 0.85 : 1 }, webCursor]}>
      <Text style={s.ctaText}>Join the Waitlist</Text>
    </Pressable>
  );

  if (isNarrow) {
    return (
      <View style={s.bar}>
        <View style={s.innerNarrow}>
          {Brand}
          <Pressable onPress={() => setOpen((o) => !o)} hitSlop={8} style={[s.iconBtn, webCursor]}>
            <Ionicons name={open ? 'close' : 'menu'} size={24} color={C.dark} />
          </Pressable>
        </View>
        {open && (
          <View style={s.dropdown}>
            {items.map((it) => (
              <Pressable key={it.name} onPress={() => go(it.name)} style={[s.dropItem, webCursor]}>
                <Text style={[s.dropLabel, isActive(it.name) && { color: C.accent }]}>{it.label}</Text>
              </Pressable>
            ))}
            <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>{WaitlistBtn}</View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={s.bar}>
      <View style={s.inner}>
        <View style={s.sideLeft}>{Brand}</View>
        <View style={s.links}>
          {LINKS.map((it) => (
            <Pressable key={it.name} onPress={() => go(it.name)} style={webCursor}>
              <Text style={[s.link, isActive(it.name) && s.linkActive]}>{it.label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={s.sideRight}>
          {isAdmin && (
            <Pressable onPress={() => go('admin')} hitSlop={8} style={[s.iconBtn, webCursor]}>
              <Ionicons name="settings-outline" size={18} color={isActive('admin') ? C.accent : C.textLight} />
            </Pressable>
          )}
          {WaitlistBtn}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    backgroundColor: 'rgba(250,247,244,0.92)',
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    zIndex: 100,
    ...(Platform.OS === 'web'
      ? ({ position: 'sticky', top: 0, backdropFilter: 'blur(12px)' } as any)
      : {}),
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 1160,
    alignSelf: 'center',
    height: 66,
    paddingHorizontal: 28,
  },
  innerNarrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 20,
  },
  sideLeft: { flex: 1, alignItems: 'flex-start' },
  sideRight: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 16 },
  brand: { fontSize: 18, fontWeight: '300', letterSpacing: 7, color: C.dark, paddingLeft: 7 },

  links: { flexDirection: 'row', alignItems: 'center', gap: 30 },
  link: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.4,
    color: C.textLight,
    ...(Platform.OS === 'web' ? ({ transition: 'color 0.15s ease' } as any) : {}),
  },
  linkActive: { color: C.accent, fontWeight: '500' },

  cta: { backgroundColor: C.dark, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 999 },
  ctaText: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5, color: C.white },

  iconBtn: { padding: 4, alignItems: 'center', justifyContent: 'center' },

  dropdown: {
    borderTopWidth: 1,
    borderTopColor: C.border,
    backgroundColor: C.bg,
    paddingVertical: 8,
    paddingBottom: 16,
  },
  dropItem: { paddingVertical: 12, paddingHorizontal: 20 },
  dropLabel: { fontSize: 15, letterSpacing: 0.3, color: C.text },
});
