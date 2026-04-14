import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brand, Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRetreats, type Retreat } from '@/hooks/useRetreats';
import { useLocations, getSeasonLabel, isInSeason } from '@/hooks/useLocations';
import { formatPrice } from '@/constants/pricing';
import { useAuth } from '@/contexts/AuthContext';

function RetreatCard({ retreat, onPress }: { retreat: Retreat; onPress: () => void }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const spotsLeft = retreat.max_capacity - retreat.current_bookings;

  const startDate = new Date(retreat.start_date);
  const endDate = new Date(retreat.end_date);
  const dateStr = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{retreat.title}</Text>
        {spotsLeft <= 3 && spotsLeft > 0 && (
          <View style={[styles.badge, { backgroundColor: Brand.coral + '20' }]}>
            <Text style={[styles.badgeText, { color: Brand.coral }]}>{spotsLeft} spots left</Text>
          </View>
        )}
      </View>
      <Text style={[styles.cardLocation, { color: Brand.seafoam }]}>{retreat.location_name}</Text>
      <Text style={[styles.cardDates, { color: colors.textSecondary }]}>{dateStr}</Text>
      <View style={styles.cardFooter}>
        <Text style={[styles.cardPrice, { color: colors.text }]}>{formatPrice(retreat.price_cents)}</Text>
        <Text style={[styles.cardPriceLabel, { color: colors.textMuted }]}>per person</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function RetreatsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { isAuthenticated } = useAuth();
  const { retreats, loading } = useRetreats();
  const { locations } = useLocations();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: Brand.accent }]}>RETREATS</Text>
        <Text style={[styles.title, { color: colors.text }]}>5 nights of transformation</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Daily breathwork, surfing, nourishing meals, and community in the world's most beautiful coastlines.
        </Text>
      </View>

      {/* Season indicators */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.seasonRow}>
        {locations.map((loc) => (
          <View key={loc.id} style={[styles.seasonChip, { backgroundColor: isInSeason(loc.season_start, loc.season_end) ? Brand.seafoam + '20' : colors.surfaceRaised, borderColor: isInSeason(loc.season_start, loc.season_end) ? Brand.seafoam : colors.border }]}>
            <Text style={[styles.seasonChipName, { color: isInSeason(loc.season_start, loc.season_end) ? Brand.seafoam : colors.textSecondary }]}>{loc.country}</Text>
            <Text style={[styles.seasonChipDates, { color: colors.textMuted }]}>{getSeasonLabel(loc.season_start, loc.season_end)}</Text>
          </View>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={Brand.primary} />
      ) : retreats.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Retreats coming soon</Text>
          <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
            We're finalizing our upcoming retreat schedule. Join our mailing list to be the first to know when bookings open.
          </Text>
          {!isAuthenticated && (
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/auth/sign-up')}>
              <Text style={styles.emptyBtnText}>Get Notified</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.list}>
          {retreats.map((retreat) => (
            <RetreatCard key={retreat.id} retreat={retreat} onPress={() => router.push(`/retreat/${retreat.id}`)} />
          ))}
        </View>
      )}

      {/* What's included */}
      <View style={styles.includedSection}>
        <Text style={[styles.includedTitle, { color: colors.text }]}>What's included</Text>
        {[
          'Daily breathwork sessions',
          'Daily surf sessions with certified instructors',
          'Board rental and equipment',
          '2 gourmet, healthy meals per day',
          'Beachfront accommodations',
          'Airport transportation',
          'Movement and recovery classes',
          'Opening and closing ceremonies',
          'Small group (max 12 guests)',
        ].map((item) => (
          <View key={item} style={styles.includedRow}>
            <Text style={[styles.includedCheck, { color: Brand.seafoam }]}>✓</Text>
            <Text style={[styles.includedText, { color: colors.textSecondary }]}>{item}</Text>
          </View>
        ))}
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

  seasonRow: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.lg },
  seasonChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, borderWidth: 1, alignItems: 'center' },
  seasonChipName: { ...Typography.caption, fontWeight: '600' },
  seasonChipDates: { ...Typography.small },

  list: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
  card: { padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { ...Typography.h3, flex: 1, marginBottom: Spacing.xs },
  badge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full, marginLeft: Spacing.sm },
  badgeText: { ...Typography.small, fontWeight: '600' },
  cardLocation: { ...Typography.bodyMedium, marginBottom: Spacing.xs },
  cardDates: { ...Typography.caption, marginBottom: Spacing.md },
  cardFooter: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.xs },
  cardPrice: { ...Typography.h3 },
  cardPriceLabel: { ...Typography.caption },

  emptyState: { alignItems: 'center', padding: Spacing.xl, marginTop: 20 },
  emptyTitle: { ...Typography.h3, marginBottom: Spacing.sm },
  emptyBody: { ...Typography.body, textAlign: 'center', maxWidth: 400, lineHeight: 24 },
  emptyBtn: { backgroundColor: Brand.primary, paddingHorizontal: Spacing.xl, paddingVertical: 14, borderRadius: Radius.full, marginTop: Spacing.lg },
  emptyBtnText: { color: '#fff', ...Typography.bodyMedium },

  includedSection: { paddingHorizontal: Spacing.lg, marginTop: 48 },
  includedTitle: { ...Typography.h3, marginBottom: Spacing.md },
  includedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  includedCheck: { fontSize: 16, fontWeight: '700' },
  includedText: { ...Typography.body },
});
