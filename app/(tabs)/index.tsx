import { ScrollView, View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brand, Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { isAuthenticated } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width > 768;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
      {/* Hero */}
      <View style={[styles.hero, { paddingTop: insets.top + 40 }]}>
        <Text style={[styles.logo, { color: colors.text }]}>A L U A</Text>
        <Text style={[styles.heroTitle, { color: colors.text }]}>
          Breathe. Surf. Transform.
        </Text>
        <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
          Boutique retreat experiences weaving breathwork and surfing into containers for healing, growth, and connection.
        </Text>
        <View style={styles.heroCtas}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/(tabs)/retreats')}>
            <Text style={styles.primaryBtnText}>Explore Retreats</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={() => router.push('/(tabs)/studio')}>
            <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Online Studio</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Offerings */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: Brand.accent }]}>OFFERINGS</Text>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Three ways to experience Alua</Text>

        <View style={[styles.offeringGrid, isWide && styles.offeringGridWide]}>
          <TouchableOpacity style={[styles.offeringCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push('/(tabs)/retreats')}>
            <Text style={styles.offeringEmoji}>🌊</Text>
            <Text style={[styles.offeringTitle, { color: colors.text }]}>Retreats</Text>
            <Text style={[styles.offeringDesc, { color: colors.textSecondary }]}>5 nights, 6 days of daily breathwork, surfing, nourishing meals, and community. Sri Lanka, Lombok, Costa Rica.</Text>
            <Text style={[styles.offeringPrice, { color: Brand.accent }]}>From $1,800</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.offeringCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push('/(tabs)/experiences')}>
            <Text style={styles.offeringEmoji}>☀️</Text>
            <Text style={[styles.offeringTitle, { color: colors.text }]}>Experiences</Text>
            <Text style={[styles.offeringDesc, { color: colors.textSecondary }]}>A single day of breathwork, surf, and a shared meal. The perfect introduction to the Alua practice.</Text>
            <Text style={[styles.offeringPrice, { color: Brand.accent }]}>From $95</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.offeringCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push('/(tabs)/studio')}>
            <Text style={styles.offeringEmoji}>🧘</Text>
            <Text style={[styles.offeringTitle, { color: colors.text }]}>Online Studio</Text>
            <Text style={[styles.offeringDesc, { color: colors.textSecondary }]}>Live breathwork sessions and a full library of guided practices for health, presence, and surf performance.</Text>
            <Text style={[styles.offeringPrice, { color: Brand.accent }]}>$22/month</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Locations */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: Brand.accent }]}>LOCATIONS</Text>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Follow the seasons</Text>
        <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
          We move with the rhythms of the ocean and the earth. Each location opens when conditions are perfect — warm water, clean swells, and the right energy for transformation.
        </Text>

        <View style={[styles.locationList, isWide && styles.locationListWide]}>
          {[
            { name: 'Sri Lanka', season: 'Nov – Apr', desc: 'South Coast — Weligama & Mirissa' },
            { name: 'Lombok, Indonesia', season: 'Apr – Oct', desc: 'Uncrowded waves, raw beauty' },
            { name: 'Costa Rica', season: 'Dec – Apr', desc: 'Pacific Coast — Nosara & Santa Teresa' },
          ].map((loc) => (
            <View key={loc.name} style={[styles.locationCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.locationName, { color: colors.text }]}>{loc.name}</Text>
              <Text style={[styles.locationSeason, { color: Brand.seafoam }]}>{loc.season}</Text>
              <Text style={[styles.locationDesc, { color: colors.textSecondary }]}>{loc.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Values */}
      <View style={[styles.section, styles.valuesSection]}>
        <Text style={[styles.sectionLabel, { color: Brand.accent }]}>OUR VALUES</Text>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Community. Sustainability. Service.</Text>
        <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
          We believe community is one of the most essential nutrients to our collective healing. We honor natural cycles — seasonal, slow, and in rhythm with the world around us. At the heart of everything, we stay devoted to service and reciprocity.
        </Text>
      </View>

      {/* CTA */}
      <View style={styles.section}>
        <View style={[styles.ctaCard, { backgroundColor: Brand.primary }]}>
          <Text style={styles.ctaTitle}>Ready to begin?</Text>
          <Text style={styles.ctaBody}>No surf experience needed. Come as you are.</Text>
          {!isAuthenticated ? (
            <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/auth/sign-up')}>
              <Text style={styles.ctaBtnText}>Create Account</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/(tabs)/retreats')}>
              <Text style={styles.ctaBtnText}>Browse Retreats</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerLogo, { color: colors.textMuted }]}>A L U A</Text>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          Breathe. Surf. Transform.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingHorizontal: Spacing.lg, paddingBottom: 48, alignItems: 'center' },
  logo: { ...Typography.label, fontSize: 16, letterSpacing: 6, marginBottom: Spacing.lg },
  heroTitle: { ...Typography.hero, textAlign: 'center', marginBottom: Spacing.md },
  heroSubtitle: { ...Typography.body, textAlign: 'center', maxWidth: 500, lineHeight: 26 },
  heroCtas: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl },
  primaryBtn: { backgroundColor: Brand.primary, paddingHorizontal: Spacing.xl, paddingVertical: 14, borderRadius: Radius.full },
  primaryBtnText: { color: '#fff', ...Typography.bodyMedium },
  secondaryBtn: { borderWidth: 1, paddingHorizontal: Spacing.xl, paddingVertical: 14, borderRadius: Radius.full },
  secondaryBtnText: { ...Typography.bodyMedium },

  section: { paddingHorizontal: Spacing.lg, marginBottom: 48 },
  sectionLabel: { ...Typography.label, marginBottom: Spacing.sm },
  sectionTitle: { ...Typography.h1, marginBottom: Spacing.md },
  sectionBody: { ...Typography.body, lineHeight: 26, maxWidth: 600 },

  offeringGrid: { marginTop: Spacing.lg, gap: Spacing.md },
  offeringGridWide: { flexDirection: 'row' },
  offeringCard: { padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1, flex: 1 },
  offeringEmoji: { fontSize: 32, marginBottom: Spacing.sm },
  offeringTitle: { ...Typography.h3, marginBottom: Spacing.xs },
  offeringDesc: { ...Typography.caption, lineHeight: 22, marginBottom: Spacing.md },
  offeringPrice: { ...Typography.bodyMedium },

  locationList: { marginTop: Spacing.lg, gap: Spacing.md },
  locationListWide: { flexDirection: 'row' },
  locationCard: { padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1, flex: 1 },
  locationName: { ...Typography.h3, marginBottom: Spacing.xs },
  locationSeason: { ...Typography.bodyMedium, marginBottom: Spacing.xs },
  locationDesc: { ...Typography.caption },

  valuesSection: { paddingVertical: Spacing.xl },

  ctaCard: { padding: Spacing.xl, borderRadius: Radius.xl, alignItems: 'center' },
  ctaTitle: { ...Typography.h2, color: '#fff', marginBottom: Spacing.sm },
  ctaBody: { ...Typography.body, color: 'rgba(255,255,255,0.8)', marginBottom: Spacing.lg },
  ctaBtn: { backgroundColor: '#fff', paddingHorizontal: Spacing.xl, paddingVertical: 14, borderRadius: Radius.full },
  ctaBtnText: { color: Brand.primary, ...Typography.bodyMedium },

  footer: { alignItems: 'center', paddingVertical: 48 },
  footerLogo: { ...Typography.label, fontSize: 14, letterSpacing: 6, marginBottom: Spacing.sm },
  footerText: { ...Typography.caption },
});
