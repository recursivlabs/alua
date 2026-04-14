import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brand, Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useStudioContent } from '@/hooks/useStudioContent';
import { useAuth } from '@/contexts/AuthContext';
import { STUDIO_PRICING, formatPrice } from '@/constants/pricing';

export default function StudioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { isAuthenticated } = useAuth();
  const { content: recordings, loading: loadingRecordings } = useStudioContent('recorded');
  const { content: liveItems, loading: loadingLive } = useStudioContent('live');

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: Brand.accent }]}>ONLINE STUDIO</Text>
        <Text style={[styles.title, { color: colors.text }]}>Your breathwork practice, anywhere</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Live sessions, guided practices, and integration support. Continue your journey between retreats.
        </Text>
      </View>

      {/* Pricing */}
      <View style={styles.pricingRow}>
        <View style={[styles.priceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Monthly</Text>
          <Text style={[styles.priceAmount, { color: colors.text }]}>{formatPrice(STUDIO_PRICING.monthly)}</Text>
          <Text style={[styles.pricePer, { color: colors.textMuted }]}>/month</Text>
        </View>
        <View style={[styles.priceCard, styles.priceCardBest, { borderColor: Brand.seafoam }]}>
          <View style={[styles.saveBadge, { backgroundColor: Brand.seafoam }]}>
            <Text style={styles.saveBadgeText}>Save 32%</Text>
          </View>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Annual</Text>
          <Text style={[styles.priceAmount, { color: colors.text }]}>{formatPrice(STUDIO_PRICING.annual)}</Text>
          <Text style={[styles.pricePer, { color: colors.textMuted }]}>/year</Text>
        </View>
      </View>

      {/* What you get */}
      <View style={[styles.featuresCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.featuresTitle, { color: colors.text }]}>What's included</Text>
        {[
          '2 live breathwork sessions per month',
          'Full library of recorded guided practices',
          'Breathwork for physical health & recovery',
          'Breathwork for mental clarity & calm',
          'Breathwork for surf performance',
          'New content added regularly',
          'Integration support between retreats',
        ].map((f) => (
          <View key={f} style={styles.featureRow}>
            <Text style={[styles.check, { color: Brand.seafoam }]}>✓</Text>
            <Text style={[styles.featureText, { color: colors.textSecondary }]}>{f}</Text>
          </View>
        ))}
      </View>

      {!isAuthenticated && (
        <TouchableOpacity style={styles.subscribeBtn} onPress={() => router.push('/auth/sign-up')}>
          <Text style={styles.subscribeBtnText}>Start Your Practice</Text>
        </TouchableOpacity>
      )}

      {/* Live Schedule */}
      {liveItems.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Live Sessions</Text>
          {liveItems.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.sessionCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push(`/studio/${item.id}`)}>
              <View style={[styles.liveBadge, { backgroundColor: Brand.coral }]}>
                <Text style={styles.liveBadgeText}>LIVE</Text>
              </View>
              <Text style={[styles.sessionTitle, { color: colors.text }]}>{item.title}</Text>
              {item.scheduled_at && (
                <Text style={[styles.sessionTime, { color: colors.textSecondary }]}>
                  {new Date(item.scheduled_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </Text>
              )}
              <Text style={[styles.sessionDuration, { color: colors.textMuted }]}>{item.duration_minutes} min</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Recorded Library */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Practice Library</Text>
        {loadingRecordings ? (
          <ActivityIndicator color={Brand.primary} />
        ) : recordings.length === 0 ? (
          <View style={[styles.emptyLibrary, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyLibraryText, { color: colors.textSecondary }]}>
              Guided practices are being added. Subscribe to get notified when the library launches.
            </Text>
          </View>
        ) : (
          <View style={styles.libraryGrid}>
            {recordings.map((item) => (
              <TouchableOpacity key={item.id} style={[styles.libraryCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push(`/studio/${item.id}`)}>
                <View style={[styles.categoryBadge, { backgroundColor: Brand.primary + '15' }]}>
                  <Text style={[styles.categoryText, { color: Brand.primary }]}>{item.category}</Text>
                </View>
                <Text style={[styles.libraryTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.libraryDuration, { color: colors.textMuted }]}>{item.duration_minutes} min</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  label: { ...Typography.label, marginBottom: Spacing.sm },
  title: { ...Typography.h1, marginBottom: Spacing.sm },
  subtitle: { ...Typography.body, lineHeight: 26 },

  pricingRow: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.md, marginBottom: Spacing.lg },
  priceCard: { flex: 1, padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1, alignItems: 'center' },
  priceCardBest: { borderWidth: 2 },
  priceLabel: { ...Typography.caption, marginBottom: Spacing.xs },
  priceAmount: { ...Typography.h1 },
  pricePer: { ...Typography.caption },
  saveBadge: { position: 'absolute', top: -10, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full },
  saveBadgeText: { color: '#fff', ...Typography.small, fontWeight: '700' },

  featuresCard: { marginHorizontal: Spacing.lg, padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1, marginBottom: Spacing.lg },
  featuresTitle: { ...Typography.h3, marginBottom: Spacing.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  check: { fontSize: 16, fontWeight: '700' },
  featureText: { ...Typography.body },

  subscribeBtn: { backgroundColor: Brand.primary, marginHorizontal: Spacing.lg, paddingVertical: 16, borderRadius: Radius.full, alignItems: 'center', marginBottom: Spacing.xl },
  subscribeBtnText: { color: '#fff', ...Typography.bodyMedium },

  section: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg },
  sectionTitle: { ...Typography.h3, marginBottom: Spacing.md },

  sessionCard: { padding: Spacing.md, borderRadius: Radius.lg, borderWidth: 1, marginBottom: Spacing.sm },
  liveBadge: { alignSelf: 'flex-start', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full, marginBottom: Spacing.xs },
  liveBadgeText: { color: '#fff', ...Typography.small, fontWeight: '700' },
  sessionTitle: { ...Typography.bodyMedium, marginBottom: Spacing.xs },
  sessionTime: { ...Typography.caption, marginBottom: Spacing.xs },
  sessionDuration: { ...Typography.small },

  libraryGrid: { gap: Spacing.sm },
  libraryCard: { padding: Spacing.md, borderRadius: Radius.lg, borderWidth: 1 },
  categoryBadge: { alignSelf: 'flex-start', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full, marginBottom: Spacing.sm },
  categoryText: { ...Typography.small, fontWeight: '600' },
  libraryTitle: { ...Typography.bodyMedium, marginBottom: Spacing.xs },
  libraryDuration: { ...Typography.small },

  emptyLibrary: { padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1 },
  emptyLibraryText: { ...Typography.body, textAlign: 'center', lineHeight: 24 },
});
