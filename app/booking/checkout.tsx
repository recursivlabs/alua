import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useRecursiv } from '@/contexts/RecursivContext';
import { dbQuery } from '@/lib/database';
import { formatPrice } from '@/constants/pricing';
import { sendBookingConfirmation, addToMailingList } from '@/lib/email';
import type { Retreat } from '@/hooks/useRetreats';
import type { Experience } from '@/hooks/useExperiences';

const C = {
  bg: '#FAF7F4', text: '#1A1A1A', textLight: '#6B6560', textMuted: '#A09890',
  accent: '#C4956A', dark: '#1A2F38', cream: '#F0EBE4', border: '#E8E0D8', white: '#FFF',
};

export default function CheckoutScreen() {
  const { type, id } = useLocalSearchParams<{ type: string; id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { sdk } = useRecursiv();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<(Retreat | Experience) | null>(null);
  const [fetching, setFetching] = useState(true);

  useState(() => {
    const sql = type === 'retreat'
      ? `SELECT r.*, l.name as location_name FROM retreats r LEFT JOIN locations l ON r.location_id = l.id WHERE r.id = $1`
      : `SELECT e.*, l.name as location_name FROM experiences e LEFT JOIN locations l ON e.location_id = l.id WHERE e.id = $1`;
    dbQuery<any>(sdk, sql, [id])
      .then((rows) => setItem(rows[0] || null))
      .catch(console.error)
      .finally(() => setFetching(false));
  });

  if (fetching || !item) {
    return (
      <View style={[s.center, { backgroundColor: C.bg }]}>
        <ActivityIndicator color={C.accent} />
      </View>
    );
  }

  const priceCents = item.price_cents;
  const title = item.title;
  const locationName = (item as any).location_name || '';
  const startDate = (item as any).start_date;
  const endDate = (item as any).end_date;
  const dateStr = startDate
    ? `${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : '';

  const handleBook = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await dbQuery(sdk, `
        INSERT INTO bookings (user_id, booking_type, item_id, amount_cents, status, payment_status)
        VALUES ($1, $2, $3, $4, 'confirmed', 'pending')
      `, [user.id, type, id, priceCents]);

      // Send confirmation email
      await sendBookingConfirmation(
        sdk,
        user.email,
        user.name || 'Guest',
        type,
        title,
        locationName,
        formatPrice(priceCents),
        dateStr
      );

      // Add to mailing list
      await addToMailingList(sdk, user.email, user.name, 'booking');

      // Update capacity for retreats
      if (type === 'retreat') {
        await dbQuery(sdk, `UPDATE retreats SET current_bookings = current_bookings + 1 WHERE id = $1`, [id]);
      }

      router.replace('/booking/confirmation');
    } catch (err: any) {
      Alert.alert('Booking Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[s.container, { paddingBottom: insets.bottom + 40 }]}>
      <View style={s.content}>
        <Text style={s.eyebrow}>{type === 'retreat' ? 'RETREAT BOOKING' : 'EXPERIENCE BOOKING'}</Text>
        <Text style={s.title}>{title}</Text>
        {locationName && <Text style={s.location}>{locationName}</Text>}
        {dateStr && <Text style={s.dates}>{dateStr}</Text>}

        <View style={s.summaryCard}>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Booking</Text>
            <Text style={s.summaryValue}>{title}</Text>
          </View>
          {locationName && (
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Location</Text>
              <Text style={s.summaryValue}>{locationName}</Text>
            </View>
          )}
          {dateStr && (
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Dates</Text>
              <Text style={s.summaryValue}>{dateStr}</Text>
            </View>
          )}
          <View style={s.divider} />
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Total</Text>
            <Text style={s.summaryTotal}>{formatPrice(priceCents)}</Text>
          </View>
        </View>

        <View style={s.infoRow}>
          <Ionicons name="mail-outline" size={16} color={C.accent} />
          <Text style={s.infoText}>Confirmation email will be sent to {user?.email}</Text>
        </View>

        <View style={s.infoRow}>
          <Ionicons name="card-outline" size={16} color={C.textMuted} />
          <Text style={s.infoText}>Payment processing is being set up. Your booking will be confirmed and the team will follow up on payment.</Text>
        </View>
      </View>

      <TouchableOpacity style={[s.bookBtn, loading && { opacity: 0.6 }]} onPress={handleBook} disabled={loading}>
        {loading ? <ActivityIndicator color={C.white} /> : <Text style={s.bookBtnText}>Confirm Booking</Text>}
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 32, paddingTop: 24, justifyContent: 'space-between' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  eyebrow: { fontSize: 11, fontWeight: '600', letterSpacing: 4, color: C.accent, textTransform: 'uppercase', marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '200', color: C.text, letterSpacing: -0.5, marginBottom: 6 },
  location: { fontSize: 13, fontWeight: '500', letterSpacing: 2, color: C.accent, textTransform: 'uppercase', marginBottom: 4 },
  dates: { fontSize: 15, color: C.textLight, marginBottom: 32 },

  summaryCard: { backgroundColor: C.white, borderWidth: 1, borderColor: C.border, padding: 24, marginBottom: 24 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  summaryLabel: { fontSize: 14, color: C.textLight },
  summaryValue: { fontSize: 14, fontWeight: '500', color: C.text },
  summaryTotal: { fontSize: 24, fontWeight: '200', color: C.text },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 8 },

  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 16 },
  infoText: { fontSize: 13, lineHeight: 20, color: C.textMuted, flex: 1 },

  bookBtn: { backgroundColor: C.dark, paddingVertical: 16, alignItems: 'center' },
  bookBtnText: { fontSize: 12, fontWeight: '500', letterSpacing: 4, color: C.white, textTransform: 'uppercase' },
});
