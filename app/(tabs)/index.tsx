import { ScrollView, View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

const C = {
  bg: '#FAF7F4',
  text: '#1A1A1A',
  textLight: '#6B6560',
  textMuted: '#A09890',
  accent: '#C4956A',
  dark: '#1A2F38',
  darkMuted: '#2D4A55',
  cream: '#F0EBE4',
  border: '#E8E0D8',
  white: '#FFFFFF',
};

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWide = width > 900;
  const heroHeight = isWeb ? Math.max(height * 0.92, 600) : height * 0.85;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
      showsVerticalScrollIndicator={false}>

      {/* Hero */}
      <View style={[s.hero, { minHeight: heroHeight, paddingTop: insets.top }]}>
        <View style={s.heroInner}>
          <Text style={[s.brandMark, isWide && s.brandMarkLarge]}>ALUA</Text>
          <View style={s.heroLine} />
          <Text style={[s.heroTagline, isWide && s.heroTaglineLarge]}>
            Breathwork & Surf Retreats
          </Text>
          <Text style={s.heroSub}>
            Sri Lanka  ·  Indonesia  ·  Costa Rica
          </Text>
        </View>
        <TouchableOpacity
          style={s.heroCta}
          onPress={() => router.push('/(tabs)/retreats')}>
          <Text style={s.heroCtaText}>Explore Retreats</Text>
        </TouchableOpacity>
        <Text style={s.scrollHint}>↓</Text>
      </View>

      {/* Philosophy */}
      <View style={[s.section, s.philosophySection]}>
        <View style={[s.contentBlock, isWide && s.contentBlockWide]}>
          <Text style={s.eyebrow}>THE PRACTICE</Text>
          <Text style={[s.philosophyText, isWide && s.philosophyTextLarge]}>
            We create containers for healing, growth, and transformation through surf, breathwork, and connection to the ocean.
          </Text>
          <Text style={s.philosophyBody}>
            Unlike typical retreats focused on aesthetics or performance, Alua weaves breath and surfing together as integrated practices for presence. The ocean becomes the teacher. The breath becomes the anchor. What emerges is yours.
          </Text>
        </View>
      </View>

      {/* Offerings */}
      <View style={[s.section, { backgroundColor: C.dark }]}>
        <View style={[s.contentBlock, isWide && s.contentBlockWide]}>
          <Text style={[s.eyebrow, { color: C.accent }]}>OFFERINGS</Text>
          <View style={[s.offeringsGrid, isWide && s.offeringsGridWide]}>
            {[
              { num: '01', title: 'Retreats', desc: '5 nights, 6 days. Daily breathwork and surf. Nourishing meals, beachfront accommodations, and a small community of 12.', price: 'From $1,800', icon: 'compass-outline' as const },
              { num: '02', title: 'Experiences', desc: 'One day. Breathwork session, guided surf lesson, board rental, and a shared meal. The perfect introduction.', price: 'From $95', icon: 'sunny-outline' as const },
              { num: '03', title: 'Online Studio', desc: 'Live breathwork sessions and a full library of guided practices. Continue your journey between retreats.', price: '$22 / month', icon: 'play-circle-outline' as const },
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
            Each location opens when the ocean is right. Warm water, clean swells, and the conditions for transformation.
          </Text>

          <View style={[s.locationsGrid, isWide && s.locationsGridWide]}>
            {[
              { name: 'Sri Lanka', region: 'South Coast', season: 'November to April', detail: 'Weligama & Mirissa. Warm Indian Ocean swells, uncrowded points, the rhythm of slowing down.', icon: 'water-outline' as const },
              { name: 'Lombok', region: 'Indonesia', season: 'April to October', detail: 'East of Bali, worlds apart. Selong Belanak\'s crescent bay. Beginner-friendly, raw, intimate.', icon: 'leaf-outline' as const },
              { name: 'Costa Rica', region: 'Pacific Coast', season: 'December to April', detail: 'Nosara & Santa Teresa. Offshore winds, warm water, a community drawn to intentional living.', icon: 'sunny-outline' as const },
            ].map((loc, i) => (
              <View key={loc.name} style={[s.locationItem, isWide ? (i > 0 ? { borderLeftWidth: 1, borderLeftColor: C.border, paddingLeft: 32 } : {}) : (i > 0 ? { borderTopWidth: 1, borderTopColor: C.border } : {})]}>
                <View style={s.locationIconRow}>
                  <View style={s.locationIconCircle}>
                    <Ionicons name={loc.icon} size={20} color={C.accent} />
                  </View>
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
              { title: 'Community', body: 'One of the most essential nutrients to our collective healing. Every experience is designed around connection to ourselves, each other, and the natural world.', icon: 'people-outline' as const },
              { title: 'Sustainability', body: 'Living in deep alignment with nature. Seasonal, slow, and in rhythm. We don\'t force growth. We let it emerge when conditions are right.', icon: 'earth-outline' as const },
              { title: 'Service', body: 'At the heart of everything. We create spaces and support that facilitate genuine growth, not performance. Plan meticulously, then hold that plan loosely.', icon: 'heart-outline' as const },
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
        <View style={s.contentBlock}>
          <Text style={[s.ctaHeadline, isWide && s.ctaHeadlineLarge]}>
            Come as you are.
          </Text>
          <Text style={s.ctaSub}>
            No surf experience needed. No flexibility required.{'\n'}Just an open heart and willingness to slow down.
          </Text>
          <TouchableOpacity
            style={s.ctaButton}
            onPress={() => isAuthenticated ? router.push('/(tabs)/retreats') : router.push('/auth/sign-up')}>
            <Text style={s.ctaButtonText}>Begin</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={s.footer}>
        <Text style={s.footerBrand}>ALUA</Text>
        <Text style={s.footerTagline}>Breathwork & Surf Retreats</Text>
        <View style={s.footerDivider} />
        <Text style={s.footerCopy}>Sri Lanka  ·  Indonesia  ·  Costa Rica</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hero: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, backgroundColor: C.bg },
  heroInner: { alignItems: 'center' },
  brandMark: { fontSize: 56, fontWeight: '200', letterSpacing: 24, color: C.text, marginBottom: 20, paddingLeft: 24 },
  brandMarkLarge: { fontSize: 80, letterSpacing: 36, paddingLeft: 36 },
  heroLine: { width: 40, height: 1, backgroundColor: C.accent, marginBottom: 20 },
  heroTagline: { fontSize: 15, fontWeight: '400', letterSpacing: 4, color: C.textLight, textTransform: 'uppercase', textAlign: 'center', paddingLeft: 4 },
  heroTaglineLarge: { fontSize: 17, letterSpacing: 6, paddingLeft: 6 },
  heroSub: { fontSize: 13, letterSpacing: 3, color: C.textMuted, textTransform: 'uppercase', marginTop: 12, textAlign: 'center', paddingLeft: 3 },
  heroCta: { marginTop: 48, borderWidth: 1, borderColor: C.text, paddingHorizontal: 36, paddingVertical: 14 },
  heroCtaText: { fontSize: 12, fontWeight: '500', letterSpacing: 3, color: C.text, textTransform: 'uppercase' },
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
  offeringsGridWide: { flexDirection: 'row' },
  offering: { flex: 1, paddingVertical: 24 },
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
  locationIconRow: { marginBottom: 16 },
  locationIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.white, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
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
  ctaSub: { fontSize: 16, fontWeight: '400', lineHeight: 28, color: C.textLight, textAlign: 'center', marginBottom: 40 },
  ctaButton: { alignSelf: 'center', backgroundColor: C.dark, paddingHorizontal: 48, paddingVertical: 16 },
  ctaButtonText: { fontSize: 12, fontWeight: '500', letterSpacing: 4, color: C.white, textTransform: 'uppercase' },

  footer: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32, backgroundColor: C.bg },
  footerBrand: { fontSize: 20, fontWeight: '200', letterSpacing: 12, color: C.textMuted, marginBottom: 6, paddingLeft: 12 },
  footerTagline: { fontSize: 11, fontWeight: '400', letterSpacing: 3, color: C.textMuted, textTransform: 'uppercase', marginBottom: 20 },
  footerDivider: { width: 24, height: 1, backgroundColor: C.border, marginBottom: 20 },
  footerCopy: { fontSize: 11, letterSpacing: 2, color: C.textMuted, textTransform: 'uppercase' },
});
