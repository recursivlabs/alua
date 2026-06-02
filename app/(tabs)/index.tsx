import { ScrollView, View, Text, StyleSheet, useWindowDimensions, Platform, Animated, Easing } from 'react-native';
import { useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import Cta from '@/components/common/Cta';

const C = {
  bg: '#FAF7F4', text: '#1A1A1A', textLight: '#6B6560', textMuted: '#A09890',
  accent: '#C4956A', dark: '#1A2F38', darkMuted: '#2D4A55', cream: '#F0EBE4',
  border: '#E8E0D8', white: '#FFFFFF',
};

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWide = width > 900;
  const heroHeight = isWeb ? Math.max(height, 640) : height * 0.85;

  // A slow breathing glow behind the wordmark — expand on the in-breath,
  // settle on the out-breath. ~9s a cycle, the pace of a calm breath.
  const breath = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, { toValue: 1, duration: 4500, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(breath, { toValue: 0, duration: 4500, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [breath]);
  const glowScale = breath.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.2] });
  const glowOpacity = breath.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.7] });

  const goSignUp = () => router.push('/auth/sign-up');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: insets.bottom + 60 }} showsVerticalScrollIndicator={false}>

      {/* Hero */}
      <View style={[s.hero, { minHeight: heroHeight, paddingTop: insets.top, overflow: 'hidden' }]}>
        {/* Ambient background: a soft sand-and-sea gradient with a warm glow
            that breathes behind the wordmark. */}
        <LinearGradient
          colors={['#FAF7F4', '#ECE6DD', '#D8E6E8', '#F3ECE4', '#FAF7F4']}
          locations={[0, 0.28, 0.55, 0.8, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <Animated.View
          pointerEvents="none"
          style={[s.heroGlow, { opacity: glowOpacity, transform: [{ translateX: -240 }, { scale: glowScale }] }]}
        />
        <View style={[s.heroInner, { zIndex: 1 }]}>
          <Text style={[s.brandMark, isWide && s.brandMarkLarge]}>ALUA</Text>
          <View style={s.heroLine} />
          <Text style={[s.heroTagline, isWide && s.heroTaglineLarge]}>Men's Breathwork & Surf Retreats</Text>
          <Text style={s.heroSub}>Sri Lanka  ·  Indonesia  ·  Costa Rica</Text>
        </View>
        <Cta title="Explore Retreats" onPress={() => router.push('/(tabs)/retreats')} style={{ marginTop: 48, alignSelf: 'center', zIndex: 1 }} />
        <Text style={[s.scrollHint, { zIndex: 1 }]}>↓</Text>
      </View>

      {/* Philosophy */}
      <View style={[s.section, s.philosophySection]}>
        <View style={[s.contentBlock, isWide && s.contentBlockWide]}>
          <Text style={s.eyebrow}>THE PRACTICE</Text>
          <Text style={[s.philosophyText, isWide && s.philosophyTextLarge]}>
            A week for men to slow down, get in the water, and breathe.
          </Text>
          <Text style={s.philosophyBody}>
            Breath and surfing ask the same thing of you. Slow down. Pay attention. Stay with what comes up. The ocean does the teaching, the breath keeps you present, and you get to show up exactly as you are. Nothing to perform out here.
          </Text>
        </View>
      </View>

      {/* Offerings */}
      <View style={[s.section, { backgroundColor: C.dark }]}>
        <View style={[s.contentBlock, isWide && s.contentBlockWide]}>
          <Text style={[s.eyebrow, { color: C.accent }]}>OFFERINGS</Text>
          <View style={[s.offeringsGrid, isWide && s.offeringsGridWide]}>
            {[
              { num: '01', title: 'Retreats', desc: '5 nights, 6 days with a small group of men. Daily breathwork and surf, good food, a bed near the water, and the kind of conversations that do not happen at home.', price: 'From $1,800', icon: 'compass-outline' as const, cta: 'View Retreats', route: '/(tabs)/retreats' },
              { num: '02', title: 'Experiences', desc: 'One day. A breathwork session, a guided surf, and a shared meal. The easiest way to feel what this is.', price: 'From $95', icon: 'sunny-outline' as const, cta: 'View Experiences', route: '/(tabs)/experiences' },
              { num: '03', title: 'Online Studio', desc: 'Live breathwork sessions and a library of guided practices. Keep the breath going between retreats.', price: '$22 / month', icon: 'play-circle-outline' as const, cta: 'Learn More', route: '/(tabs)/studio' },
            ].map((o, i) => (
              <View key={o.num}>
                {i > 0 && <View style={[s.offeringDivider, isWide && s.offeringDividerWide]} />}
                <View style={s.offering}>
                  <View style={s.offeringHeader}>
                    <Text style={s.offeringNumber}>{o.num}</Text>
                    <Ionicons name={o.icon} size={20} color={C.accent} style={{ opacity: 0.6 }} />
                  </View>
                  <Text style={s.offeringTitle}>{o.title}</Text>
                  <Text style={s.offeringDesc}>{o.desc}</Text>
                  <Text style={s.offeringPrice}>{o.price}</Text>
                  <Cta title={o.cta} variant="secondary" onPress={() => router.push(o.route as any)} style={{ marginTop: 16 }} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Locations */}
      <View style={[s.section, { backgroundColor: C.cream }]}>
        <View style={[s.contentBlock, isWide && s.contentBlockWide]}>
          <Text style={[s.eyebrow, { color: C.accent }]}>LOCATIONS</Text>
          <Text style={s.sectionHeadline}>We follow the seasons</Text>
          <Text style={[s.sectionBody, { marginBottom: 48 }]}>
            Each spot opens when the ocean is right. Warm water, clean waves, and room to breathe.
          </Text>
          <View style={[s.locationsGrid, isWide && s.locationsGridWide]}>
            {[
              { name: 'Sri Lanka', region: 'South Coast', season: 'November to April', detail: 'Weligama & Mirissa. Warm Indian Ocean swells, uncrowded points, the rhythm of slowing down.', icon: 'water-outline' as const },
              { name: 'Lombok', region: 'Indonesia', season: 'April to October', detail: 'East of Bali, worlds apart. Selong Belanak\'s crescent bay. Beginner-friendly, raw, intimate.', icon: 'leaf-outline' as const },
              { name: 'Costa Rica', region: 'Pacific Coast', season: 'December to April', detail: 'Nosara & Santa Teresa. Offshore winds, warm water, a community drawn to intentional living.', icon: 'sunny-outline' as const },
            ].map((loc, i) => (
              <View key={loc.name} style={[s.locationItem, isWide ? (i > 0 ? { borderLeftWidth: 1, borderLeftColor: C.border, paddingLeft: 32 } : {}) : (i > 0 ? { borderTopWidth: 1, borderTopColor: C.border } : {})]}>
                <View style={s.locationIconCircle}>
                  <Ionicons name={loc.icon} size={20} color={C.accent} />
                </View>
                <Text style={s.locationName}>{loc.name}</Text>
                <Text style={s.locationRegion}>{loc.region}</Text>
                <Text style={s.locationSeason}>{loc.season}</Text>
                <Text style={s.locationDetail}>{loc.detail}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Values */}
      <View style={s.section}>
        <View style={[s.contentBlock, isWide && s.contentBlockWide]}>
          <Text style={[s.eyebrow, { color: C.accent }]}>VALUES</Text>
          <View style={[s.valuesGrid, isWide && s.valuesGridWide]}>
            {[
              { title: 'Community', body: 'Most men are starved for it. Real connection, with yourself, with other men, with the ocean. That sits at the center of everything we do.', icon: 'people-outline' as const },
              { title: 'Sustainability', body: 'Slow and seasonal. We move with the ocean, not against it, and let things happen at the pace they actually happen.', icon: 'earth-outline' as const },
              { title: 'Service', body: 'We plan each day with care, then step back. What happens in the water and the breath is yours.', icon: 'heart-outline' as const },
            ].map((v) => (
              <View key={v.title} style={s.valueItem}>
                <View style={s.valueIconCircle}>
                  <Ionicons name={v.icon} size={22} color={C.accent} />
                </View>
                <Text style={s.valueTitle}>{v.title}</Text>
                <Text style={s.valueBody}>{v.body}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Final CTA */}
      <View style={[s.section, s.ctaSection]}>
        <View style={[s.contentBlock, { alignItems: 'center' }]}>
          <Text style={[s.ctaHeadline, isWide && s.ctaHeadlineLarge]}>Come as you are.</Text>
          <Text style={s.ctaSub}>
            No surf experience needed. No fitness test.{'\n'}Just a willingness to slow down and show up with an open heart.
          </Text>
          {isAuthenticated ? (
            <Cta title="Browse Retreats" onPress={() => router.push('/(tabs)/retreats')} style={{ alignSelf: 'center' }} />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Cta title="Create Your Account" onPress={goSignUp} style={{ alignSelf: 'center' }} />
              <Cta title="View Retreats" variant="secondary" onPress={() => router.push('/(tabs)/retreats')} style={{ alignSelf: 'center' }} />
            </View>
          )}
        </View>
      </View>

      {/* Footer */}
      <View style={s.footer}>
        <Text style={s.footerBrand}>ALUA</Text>
        <Text style={s.footerTagline}>Men's Breathwork & Surf Retreats</Text>
        <View style={s.footerDivider} />
        <Text style={s.footerCopy}>Sri Lanka  ·  Indonesia  ·  Costa Rica</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hero: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, backgroundColor: C.bg },
  heroGlow: {
    position: 'absolute',
    top: '22%',
    left: '50%',
    width: 480,
    height: 480,
    borderRadius: 240,
    backgroundColor: 'rgba(196,149,106,0.55)',
    ...(Platform.OS === 'web' ? ({ filter: 'blur(80px)' } as any) : {}),
  },
  heroInner: { alignItems: 'center' },
  brandMark: { fontSize: 56, fontWeight: '200', letterSpacing: 24, color: C.text, marginBottom: 20, paddingLeft: 24 },
  brandMarkLarge: { fontSize: 80, letterSpacing: 36, paddingLeft: 36 },
  heroLine: { width: 40, height: 1, backgroundColor: C.accent, marginBottom: 20 },
  heroTagline: { fontSize: 15, fontWeight: '400', letterSpacing: 4, color: C.textLight, textTransform: 'uppercase', textAlign: 'center', paddingLeft: 4 },
  heroTaglineLarge: { fontSize: 17, letterSpacing: 6, paddingLeft: 6 },
  heroSub: { fontSize: 13, letterSpacing: 3, color: C.textMuted, textTransform: 'uppercase', marginTop: 12, textAlign: 'center', paddingLeft: 3 },
  scrollHint: { position: 'absolute', bottom: 32, fontSize: 18, color: C.textMuted },

  section: { paddingVertical: 80, paddingHorizontal: 32 },
  contentBlock: { maxWidth: 720, alignSelf: 'center', width: '100%' },
  contentBlockWide: { maxWidth: 1080 },
  eyebrow: { fontSize: 11, fontWeight: '600', letterSpacing: 4, color: C.textMuted, textTransform: 'uppercase', marginBottom: 20 },
  sectionHeadline: { fontSize: 32, fontWeight: '300', letterSpacing: -0.5, color: C.text, lineHeight: 42, marginBottom: 16 },
  sectionBody: { fontSize: 16, fontWeight: '400', lineHeight: 28, color: C.textLight },

  philosophySection: { paddingVertical: 100, backgroundColor: C.bg },
  philosophyText: { fontSize: 28, fontWeight: '300', lineHeight: 42, color: C.text, letterSpacing: -0.3, marginBottom: 24 },
  philosophyTextLarge: { fontSize: 36, lineHeight: 52 },
  philosophyBody: { fontSize: 16, fontWeight: '400', lineHeight: 28, color: C.textLight, maxWidth: 580 },

  offeringsGrid: { marginTop: 40 },
  offeringsGridWide: { flexDirection: 'row', flexWrap: 'wrap' },
  offering: { flex: 1, paddingVertical: 24, minWidth: 200 },
  offeringHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  offeringNumber: { fontSize: 12, fontWeight: '400', letterSpacing: 2, color: C.accent },
  offeringTitle: { fontSize: 24, fontWeight: '300', color: C.white, marginBottom: 12, letterSpacing: 0.5 },
  offeringDesc: { fontSize: 14, fontWeight: '400', lineHeight: 24, color: '#94A3AA', marginBottom: 16 },
  offeringPrice: { fontSize: 14, fontWeight: '500', color: C.accent, letterSpacing: 1 },
  offeringDivider: { height: 1, backgroundColor: '#2D4A55', marginVertical: 8 },
  offeringDividerWide: { width: 1, height: 'auto', marginHorizontal: 32, marginVertical: 0 },

  locationsGrid: {},
  locationsGridWide: { flexDirection: 'row', gap: 32 },
  locationItem: { flex: 1, paddingVertical: 24 },
  locationIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.white, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1, marginBottom: 16 },
  locationName: { fontSize: 22, fontWeight: '400', color: C.text, marginBottom: 2 },
  locationRegion: { fontSize: 13, fontWeight: '500', letterSpacing: 2, color: C.accent, textTransform: 'uppercase', marginBottom: 8 },
  locationSeason: { fontSize: 14, fontWeight: '400', color: C.textLight, marginBottom: 10 },
  locationDetail: { fontSize: 14, fontWeight: '400', lineHeight: 23, color: C.textMuted },

  valuesGrid: { marginTop: 20 },
  valuesGridWide: { flexDirection: 'row', gap: 48 },
  valueItem: { flex: 1, paddingVertical: 20 },
  valueIconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.cream, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  valueTitle: { fontSize: 18, fontWeight: '400', color: C.text, marginBottom: 10, letterSpacing: 0.5 },
  valueBody: { fontSize: 14, fontWeight: '400', lineHeight: 24, color: C.textLight },

  ctaSection: { paddingVertical: 120, alignItems: 'center', backgroundColor: C.bg },
  ctaHeadline: { fontSize: 40, fontWeight: '200', color: C.text, textAlign: 'center', letterSpacing: -0.5, marginBottom: 16 },
  ctaHeadlineLarge: { fontSize: 56 },
  ctaSub: { fontSize: 16, fontWeight: '400', lineHeight: 28, color: C.textLight, textAlign: 'center', marginBottom: 20 },

  footer: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32, backgroundColor: C.bg },
  footerBrand: { fontSize: 20, fontWeight: '200', letterSpacing: 12, color: C.textMuted, marginBottom: 6, paddingLeft: 12 },
  footerTagline: { fontSize: 11, fontWeight: '400', letterSpacing: 3, color: C.textMuted, textTransform: 'uppercase', marginBottom: 20 },
  footerDivider: { width: 24, height: 1, backgroundColor: C.border, marginBottom: 20 },
  footerCopy: { fontSize: 11, letterSpacing: 2, color: C.textMuted, textTransform: 'uppercase' },
});
