import { ScrollView, View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

const COLORS = {
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
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
      showsVerticalScrollIndicator={false}>

      {/* ── Hero ── */}
      <View style={[styles.hero, { minHeight: heroHeight, paddingTop: insets.top }]}>
        <View style={styles.heroInner}>
          <Text style={[styles.brandMark, isWide && styles.brandMarkLarge]}>ALUA</Text>
          <View style={styles.heroLine} />
          <Text style={[styles.heroTagline, isWide && styles.heroTaglineLarge]}>
            Breathwork & Surf Retreats
          </Text>
          <Text style={[styles.heroSub]}>
            Sri Lanka  ·  Indonesia  ·  Costa Rica
          </Text>
        </View>
        <TouchableOpacity
          style={styles.heroCta}
          onPress={() => isAuthenticated ? router.push('/(tabs)/retreats') : router.push('/auth/sign-up')}>
          <Text style={styles.heroCtaText}>Explore Retreats</Text>
        </TouchableOpacity>
        <Text style={styles.scrollHint}>↓</Text>
      </View>

      {/* ── Philosophy ── */}
      <View style={[styles.section, styles.philosophySection]}>
        <View style={[styles.contentBlock, isWide && styles.contentBlockWide]}>
          <Text style={styles.sectionEyebrow}>THE PRACTICE</Text>
          <Text style={[styles.philosophyText, isWide && styles.philosophyTextLarge]}>
            We create containers for healing, growth, and transformation through surf, breathwork, and connection to the ocean.
          </Text>
          <Text style={styles.philosophyBody}>
            Unlike typical retreats focused on aesthetics or performance, Alua weaves breath and surfing together as integrated practices for presence. The ocean becomes the teacher. The breath becomes the anchor. What emerges is yours.
          </Text>
        </View>
      </View>

      {/* ── Offerings ── */}
      <View style={[styles.section, { backgroundColor: COLORS.dark }]}>
        <View style={[styles.contentBlock, isWide && styles.contentBlockWide]}>
          <Text style={[styles.sectionEyebrow, { color: COLORS.accent }]}>OFFERINGS</Text>

          <View style={[styles.offeringsGrid, isWide && styles.offeringsGridWide]}>
            <View style={styles.offering}>
              <Text style={styles.offeringNumber}>01</Text>
              <Text style={styles.offeringTitle}>Retreats</Text>
              <Text style={styles.offeringDesc}>
                5 nights, 6 days. Daily breathwork and surf. Nourishing meals, beachfront accommodations, and a small community of 12.
              </Text>
              <Text style={styles.offeringPrice}>From $1,800</Text>
            </View>

            <View style={[styles.offeringDivider, isWide && styles.offeringDividerWide]} />

            <View style={styles.offering}>
              <Text style={styles.offeringNumber}>02</Text>
              <Text style={styles.offeringTitle}>Experiences</Text>
              <Text style={styles.offeringDesc}>
                One day. Breathwork session, guided surf lesson, board rental, and a shared meal. The perfect introduction.
              </Text>
              <Text style={styles.offeringPrice}>From $95</Text>
            </View>

            <View style={[styles.offeringDivider, isWide && styles.offeringDividerWide]} />

            <View style={styles.offering}>
              <Text style={styles.offeringNumber}>03</Text>
              <Text style={styles.offeringTitle}>Online Studio</Text>
              <Text style={styles.offeringDesc}>
                Live breathwork sessions and a full library of guided practices. Continue your journey between retreats.
              </Text>
              <Text style={styles.offeringPrice}>$22 / month</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── Locations ── */}
      <View style={[styles.section, { backgroundColor: COLORS.cream }]}>
        <View style={[styles.contentBlock, isWide && styles.contentBlockWide]}>
          <Text style={[styles.sectionEyebrow, { color: COLORS.accent }]}>LOCATIONS</Text>
          <Text style={[styles.sectionHeadline]}>We follow the seasons</Text>
          <Text style={[styles.sectionBody, { marginBottom: 48 }]}>
            Each location opens when the ocean is right — warm water, clean swells, and the conditions for transformation.
          </Text>

          <View style={[styles.locationsGrid, isWide && styles.locationsGridWide]}>
            {[
              { name: 'Sri Lanka', region: 'South Coast', season: 'November – April', detail: 'Weligama & Mirissa. Warm Indian Ocean swells, uncrowded points, the rhythm of slowing down.' },
              { name: 'Lombok', region: 'Indonesia', season: 'April – October', detail: 'East of Bali, worlds apart. Selong Belanak\'s crescent bay — beginner-friendly, raw, intimate.' },
              { name: 'Costa Rica', region: 'Pacific Coast', season: 'December – April', detail: 'Nosara & Santa Teresa. Offshore winds, warm water, a community drawn to intentional living.' },
            ].map((loc, i) => (
              <View key={loc.name} style={[styles.locationItem, i > 0 && styles.locationItemBorder]}>
                <Text style={styles.locationName}>{loc.name}</Text>
                <Text style={styles.locationRegion}>{loc.region}</Text>
                <Text style={styles.locationSeason}>{loc.season}</Text>
                <Text style={styles.locationDetail}>{loc.detail}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* ── Values ── */}
      <View style={styles.section}>
        <View style={[styles.contentBlock, isWide && styles.contentBlockWide]}>
          <Text style={[styles.sectionEyebrow, { color: COLORS.accent }]}>VALUES</Text>
          <View style={[styles.valuesGrid, isWide && styles.valuesGridWide]}>
            {[
              { title: 'Community', body: 'One of the most essential nutrients to our collective healing. Every experience is designed around connection — to ourselves, each other, and the natural world.' },
              { title: 'Sustainability', body: 'Living in deep alignment with nature. Seasonal, slow, and in rhythm. We don\'t force growth — we let it emerge when conditions are right.' },
              { title: 'Service', body: 'At the heart of everything. We create spaces and support that facilitate genuine growth, not performance. Plan meticulously, then hold that plan loosely.' },
            ].map((v) => (
              <View key={v.title} style={styles.valueItem}>
                <Text style={styles.valueTitle}>{v.title}</Text>
                <Text style={styles.valueBody}>{v.body}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* ── Final CTA ── */}
      <View style={[styles.section, styles.ctaSection]}>
        <View style={styles.contentBlock}>
          <Text style={[styles.ctaHeadline, isWide && styles.ctaHeadlineLarge]}>
            Come as you are.
          </Text>
          <Text style={styles.ctaSub}>
            No surf experience needed. No flexibility required.{'\n'}Just an open heart and willingness to slow down.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => isAuthenticated ? router.push('/(tabs)/retreats') : router.push('/auth/sign-up')}>
            <Text style={styles.ctaButtonText}>Begin</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <Text style={styles.footerBrand}>ALUA</Text>
        <Text style={styles.footerTagline}>Breathwork & Surf Retreats</Text>
        <View style={styles.footerDivider} />
        <Text style={styles.footerCopy}>Sri Lanka  ·  Indonesia  ·  Costa Rica</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  /* ── Hero ── */
  hero: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: COLORS.bg,
  },
  heroInner: {
    alignItems: 'center',
  },
  brandMark: {
    fontSize: 56,
    fontWeight: '200',
    letterSpacing: 24,
    color: COLORS.text,
    marginBottom: 20,
  },
  brandMarkLarge: {
    fontSize: 80,
    letterSpacing: 36,
  },
  heroLine: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.accent,
    marginBottom: 20,
  },
  heroTagline: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 4,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  heroTaglineLarge: {
    fontSize: 17,
    letterSpacing: 6,
  },
  heroSub: {
    fontSize: 13,
    letterSpacing: 3,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginTop: 12,
    textAlign: 'center',
  },
  heroCta: {
    marginTop: 48,
    borderWidth: 1,
    borderColor: COLORS.text,
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 0,
  },
  heroCtaText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 3,
    color: COLORS.text,
    textTransform: 'uppercase',
  },
  scrollHint: {
    position: 'absolute',
    bottom: 32,
    fontSize: 18,
    color: COLORS.textMuted,
  },

  /* ── Sections ── */
  section: {
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  contentBlock: {
    maxWidth: 720,
    alignSelf: 'center',
    width: '100%',
  },
  contentBlockWide: {
    maxWidth: 1080,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 4,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  sectionHeadline: {
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: -0.5,
    color: COLORS.text,
    lineHeight: 42,
    marginBottom: 16,
  },
  sectionBody: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 28,
    color: COLORS.textLight,
  },

  /* ── Philosophy ── */
  philosophySection: {
    paddingVertical: 100,
    backgroundColor: COLORS.bg,
  },
  philosophyText: {
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 42,
    color: COLORS.text,
    letterSpacing: -0.3,
    marginBottom: 24,
  },
  philosophyTextLarge: {
    fontSize: 36,
    lineHeight: 52,
  },
  philosophyBody: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 28,
    color: COLORS.textLight,
    maxWidth: 580,
  },

  /* ── Offerings ── */
  offeringsGrid: {
    marginTop: 40,
  },
  offeringsGridWide: {
    flexDirection: 'row',
  },
  offering: {
    flex: 1,
    paddingVertical: 24,
  },
  offeringNumber: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 2,
    color: COLORS.accent,
    marginBottom: 16,
  },
  offeringTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: COLORS.white,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  offeringDesc: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    color: '#94A3AA',
    marginBottom: 16,
  },
  offeringPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.accent,
    letterSpacing: 1,
  },
  offeringDivider: {
    height: 1,
    backgroundColor: '#2D4A55',
    marginVertical: 8,
  },
  offeringDividerWide: {
    width: 1,
    height: 'auto',
    marginHorizontal: 32,
    marginVertical: 0,
  },

  /* ── Locations ── */
  locationsGrid: {},
  locationsGridWide: {
    flexDirection: 'row',
    gap: 48,
  },
  locationItem: {
    flex: 1,
    paddingVertical: 24,
  },
  locationItemBorder: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  locationName: {
    fontSize: 22,
    fontWeight: '400',
    color: COLORS.text,
    marginBottom: 2,
  },
  locationRegion: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 2,
    color: COLORS.accent,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  locationSeason: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textLight,
    marginBottom: 10,
  },
  locationDetail: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 23,
    color: COLORS.textMuted,
  },

  /* ── Values ── */
  valuesGrid: {
    marginTop: 20,
  },
  valuesGridWide: {
    flexDirection: 'row',
    gap: 48,
  },
  valueItem: {
    flex: 1,
    paddingVertical: 20,
  },
  valueTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: COLORS.text,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  valueBody: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    color: COLORS.textLight,
  },

  /* ── CTA ── */
  ctaSection: {
    paddingVertical: 120,
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },
  ctaHeadline: {
    fontSize: 40,
    fontWeight: '200',
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  ctaHeadlineLarge: {
    fontSize: 56,
  },
  ctaSub: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 28,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 40,
  },
  ctaButton: {
    alignSelf: 'center',
    backgroundColor: COLORS.dark,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 0,
  },
  ctaButtonText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 4,
    color: COLORS.white,
    textTransform: 'uppercase',
  },

  /* ── Footer ── */
  footer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    backgroundColor: COLORS.bg,
  },
  footerBrand: {
    fontSize: 20,
    fontWeight: '200',
    letterSpacing: 12,
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  footerTagline: {
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 3,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  footerDivider: {
    width: 24,
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 20,
  },
  footerCopy: {
    fontSize: 11,
    letterSpacing: 2,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
});
