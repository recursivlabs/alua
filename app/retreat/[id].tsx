import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brand, Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRetreat } from '@/hooks/useRetreats';
import { formatPrice, CANCELLATION_POLICY } from '@/constants/pricing';
import { DEFAULT_PACKING_LIST } from '@/constants/content';
import { useAuth } from '@/contexts/AuthContext';

export default function RetreatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { retreat, loading } = useRetreat(id);
  const { isAuthenticated } = useAuth();

  if (loading) {
    return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator color={Brand.primary} /></View>;
  }

  if (!retreat) {
    return <View style={[styles.center, { backgroundColor: colors.background }]}><Text style={{ color: colors.text }}>Retreat not found</Text></View>;
  }

  const spotsLeft = retreat.max_capacity - retreat.current_bookings;
  const startDate = new Date(retreat.start_date);
  const endDate = new Date(retreat.end_date);
  const dateStr = `${startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })} – ${endDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}`;
  const included = retreat.included || [];
  const schedule = retreat.daily_schedule || [];
  const packingList = retreat.packing_list?.length ? retreat.packing_list : DEFAULT_PACKING_LIST;
  const policy = retreat.cancellation_policy || CANCELLATION_POLICY;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
      <View style={styles.hero}>
        <Text style={[styles.location, { color: Brand.seafoam }]}>{retreat.location_name}</Text>
        <Text style={[styles.title, { color: colors.text }]}>{retreat.title}</Text>
        <Text style={[styles.dates, { color: colors.textSecondary }]}>{dateStr}</Text>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.text }]}>{formatPrice(retreat.price_cents)}</Text>
          <Text style={[styles.pricePer, { color: colors.textMuted }]}>per person · all inclusive</Text>
        </View>
        {spotsLeft <= 3 && spotsLeft > 0 && (
          <Text style={[styles.spotsWarning, { color: Brand.coral }]}>Only {spotsLeft} spots remaining</Text>
        )}
      </View>

      {retreat.description && (
        <View style={styles.section}>
          <Text style={[styles.body, { color: colors.textSecondary }]}>{retreat.description}</Text>
        </View>
      )}

      {included.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>What's Included</Text>
          {included.map((item: string, i: number) => (
            <View key={i} style={styles.listRow}>
              <Text style={[styles.check, { color: Brand.seafoam }]}>✓</Text>
              <Text style={[styles.listText, { color: colors.textSecondary }]}>{item}</Text>
            </View>
          ))}
        </View>
      )}

      {schedule.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Schedule</Text>
          {schedule.map((day: any, i: number) => (
            <View key={i} style={[styles.dayCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.dayLabel, { color: Brand.accent }]}>DAY {day.day}</Text>
              <Text style={[styles.dayTitle, { color: colors.text }]}>{day.title}</Text>
              {day.activities?.map((a: string, j: number) => (
                <Text key={j} style={[styles.dayActivity, { color: colors.textSecondary }]}>· {a}</Text>
              ))}
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Packing List</Text>
        {packingList.map((item: string, i: number) => (
          <View key={i} style={styles.listRow}>
            <Text style={[styles.bullet, { color: colors.textMuted }]}>·</Text>
            <Text style={[styles.listText, { color: colors.textSecondary }]}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Cancellation Policy</Text>
        {policy.map((tier: any, i: number) => (
          <Text key={i} style={[styles.policyText, { color: colors.textSecondary }]}>
            {tier.daysBefore > 0 ? `${tier.daysBefore}+ days before` : 'Less than 30 days'}: {tier.refundPercent > 0 ? `${tier.refundPercent}% refund` : 'No refund'}
          </Text>
        ))}
      </View>

      {/* Sticky book button */}
      <View style={[styles.bookBar, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: insets.bottom + 16 }]}>
        <View>
          <Text style={[styles.bookPrice, { color: colors.text }]}>{formatPrice(retreat.price_cents)}</Text>
          <Text style={[styles.bookPer, { color: colors.textMuted }]}>per person</Text>
        </View>
        <TouchableOpacity
          style={[styles.bookBtn, spotsLeft <= 0 && styles.bookBtnDisabled]}
          disabled={spotsLeft <= 0}
          onPress={() => {
            if (!isAuthenticated) {
              router.push('/auth/sign-up');
            } else {
              router.push({ pathname: '/booking/checkout', params: { type: 'retreat', id: retreat.id } });
            }
          }}>
          <Text style={styles.bookBtnText}>{spotsLeft <= 0 ? 'Sold Out' : 'Book Now'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hero: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xl },
  location: { ...Typography.bodyMedium, marginBottom: Spacing.xs },
  title: { ...Typography.hero, marginBottom: Spacing.sm },
  dates: { ...Typography.body, marginBottom: Spacing.md },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.sm },
  price: { ...Typography.h1 },
  pricePer: { ...Typography.caption },
  spotsWarning: { ...Typography.bodyMedium, marginTop: Spacing.sm },

  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.h3, marginBottom: Spacing.md },
  body: { ...Typography.body, lineHeight: 26 },
  listRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.sm },
  check: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  bullet: { fontSize: 20, marginTop: -2 },
  listText: { ...Typography.body, flex: 1 },

  dayCard: { padding: Spacing.md, borderRadius: Radius.lg, borderWidth: 1, marginBottom: Spacing.sm },
  dayLabel: { ...Typography.label, marginBottom: Spacing.xs },
  dayTitle: { ...Typography.bodyMedium, marginBottom: Spacing.sm },
  dayActivity: { ...Typography.caption, lineHeight: 22 },

  policyText: { ...Typography.body, marginBottom: Spacing.xs },

  bookBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, borderTopWidth: 1 },
  bookPrice: { ...Typography.h3 },
  bookPer: { ...Typography.small },
  bookBtn: { backgroundColor: Brand.primary, paddingHorizontal: Spacing.xl, paddingVertical: 14, borderRadius: Radius.full },
  bookBtnDisabled: { backgroundColor: '#999' },
  bookBtnText: { color: '#fff', ...Typography.bodyMedium },
});
