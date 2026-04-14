import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Brand, Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRetreat } from '@/hooks/useRetreats';
import { useExperience } from '@/hooks/useExperiences';
import { useBookings } from '@/hooks/useBookings';
import { formatPrice } from '@/constants/pricing';

export default function CheckoutScreen() {
  const { type, id } = useLocalSearchParams<{ type: string; id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { createBooking } = useBookings();
  const [loading, setLoading] = useState(false);

  const { retreat } = useRetreat(type === 'retreat' ? id : '');
  const { experience } = useExperience(type === 'experience' ? id : '');

  const item = type === 'retreat' ? retreat : experience;
  const priceCents = item?.price_cents || 0;
  const title = item?.title || '';
  const locationName = (item as any)?.location_name || '';

  if (!item) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={Brand.primary} />
      </View>
    );
  }

  const handleBook = async () => {
    setLoading(true);
    try {
      await createBooking({
        bookingType: type,
        itemId: id,
        amountCents: priceCents,
      });
      router.replace('/booking/confirmation');
    } catch (err: any) {
      Alert.alert('Booking Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Spacing.lg, paddingBottom: insets.bottom + 40 }]}>
      <View style={styles.content}>
        <Text style={[styles.label, { color: Brand.accent }]}>{type === 'retreat' ? 'RETREAT' : 'EXPERIENCE'}</Text>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.location, { color: Brand.seafoam }]}>{locationName}</Text>

        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Booking</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{title}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total</Text>
            <Text style={[styles.summaryTotal, { color: colors.text }]}>{formatPrice(priceCents)}</Text>
          </View>
        </View>

        <Text style={[styles.note, { color: colors.textMuted }]}>
          Stripe payment integration is being set up. For now, your booking will be confirmed and the team will follow up on payment details.
        </Text>
      </View>

      <TouchableOpacity style={[styles.bookBtn, loading && styles.bookBtnDisabled]} onPress={handleBook} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.bookBtnText}>Confirm Booking</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.lg, justifyContent: 'space-between' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  label: { ...Typography.label, marginBottom: Spacing.sm },
  title: { ...Typography.h1, marginBottom: Spacing.xs },
  location: { ...Typography.bodyMedium, marginBottom: Spacing.xl },

  summaryCard: { padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1, marginBottom: Spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { ...Typography.body },
  summaryValue: { ...Typography.bodyMedium },
  summaryTotal: { ...Typography.h2 },
  divider: { height: 1, marginVertical: Spacing.md },

  note: { ...Typography.caption, textAlign: 'center', lineHeight: 20 },

  bookBtn: { backgroundColor: Brand.primary, paddingVertical: 16, borderRadius: Radius.full, alignItems: 'center' },
  bookBtnDisabled: { opacity: 0.6 },
  bookBtnText: { color: '#fff', ...Typography.bodyMedium },
});
