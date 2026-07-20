import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import { Brand, Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { useRecursivSafe } from '@/contexts/RecursivContext';
import { dbQuery } from '@/lib/database';
import { formatPrice } from '@/constants/pricing';
import { verifyBookingSession } from '@/lib/booking';
import { sendBookingConfirmation, addToMailingList } from '@/lib/email';

type Phase = 'verifying' | 'confirmed' | 'cancelled' | 'failed';

export default function ConfirmationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const params = useLocalSearchParams<{ booking?: string; session_id?: string }>();
  const { user } = useAuth();
  const sdk = useRecursivSafe()?.sdk ?? null;
  const recorded = useRef(false);

  // With no params (legacy / direct nav) show the generic success screen.
  const initial: Phase = params.booking === 'cancelled'
    ? 'cancelled'
    : params.session_id
      ? 'verifying'
      : 'confirmed';
  const [phase, setPhase] = useState<Phase>(initial);

  useEffect(() => {
    const sessionId = params.session_id;
    if (params.booking !== 'success' || !sessionId || !sdk || !user || recorded.current) return;
    recorded.current = true;

    (async () => {
      try {
        const session = await verifyBookingSession(sessionId);
        if (!session || !session.paid) { setPhase('failed'); return; }

        // Idempotent: record the booking only once per checkout session.
        const existing = await dbQuery<{ id: string }>(
          sdk,
          `SELECT id FROM bookings WHERE stripe_session_id = $1 LIMIT 1`,
          [sessionId],
        );
        const amountCents = session.amountTotal ?? 0;

        if (existing.length === 0) {
          await dbQuery(
            sdk,
            `INSERT INTO bookings (user_id, booking_type, item_id, amount_cents, status, payment_status, stripe_session_id)
             VALUES ($1, $2, $3, $4, 'confirmed', 'paid', $5)`,
            [user.id, session.itemType, session.itemId, amountCents, sessionId],
          );

          if (session.itemType === 'retreat') {
            await dbQuery(
              sdk,
              `UPDATE retreats SET current_bookings = current_bookings + 1 WHERE id = $1`,
              [session.itemId],
            );
          }

          // Best-effort side effects — never block the confirmation on these.
          try {
            const table = session.itemType === 'retreat' ? 'retreats' : 'experiences';
            const dateCols = session.itemType === 'retreat'
              ? 'x.start_date, x.end_date'
              : 'NULL as start_date, NULL as end_date';
            const rows = await dbQuery<any>(
              sdk,
              `SELECT x.title, l.name as location_name, ${dateCols}
               FROM ${table} x LEFT JOIN locations l ON x.location_id = l.id WHERE x.id = $1`,
              [session.itemId],
            );
            const it = rows[0];
            if (it) {
              const dateStr = it.start_date
                ? `${new Date(it.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(it.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                : '';
              await sendBookingConfirmation(
                sdk, user.email, user.name || 'Guest', session.itemType,
                it.title, it.location_name || '', formatPrice(amountCents), dateStr,
              );
            }
            await addToMailingList(sdk, user.email, user.name, 'booking');
          } catch (e) {
            console.warn('[confirmation] side effects failed', e);
          }
        }

        setPhase('confirmed');
      } catch (err) {
        console.error('[confirmation] record failed', err);
        setPhase('failed');
      }
    })();
  }, [params.booking, params.session_id, sdk, user]);

  if (phase === 'verifying') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator color={Brand.primary} />
        <Text style={[styles.body, { color: colors.textSecondary, marginTop: Spacing.md }]}>Confirming your payment…</Text>
      </View>
    );
  }

  if (phase === 'cancelled' || phase === 'failed') {
    const failed = phase === 'failed';
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.content}>
          <Text style={[styles.checkmark, { color: Brand.coral }]}>{failed ? '!' : '×'}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{failed ? 'Payment not confirmed' : 'Checkout cancelled'}</Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            {failed
              ? "We couldn't confirm your payment. If you were charged, email us and we'll sort it out right away."
              : "No worries — your seat isn't booked and you haven't been charged. You can try again anytime."}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/(tabs)/retreats')}>
            <Text style={styles.primaryBtnText}>Back to Retreats</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={() => router.replace('/(tabs)')}>
            <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }]}>
      <View style={styles.content}>
        <Text style={styles.checkmark}>✓</Text>
        <Text style={[styles.title, { color: colors.text }]}>Booking Confirmed</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          You're in. You'll get a confirmation email with all the details shortly.
        </Text>
        <Text style={[styles.body, { color: colors.textSecondary, marginTop: Spacing.md }]}>
          Complete your guest profile so we can accommodate your dietary needs and prepare for your arrival.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/(tabs)/profile')}>
          <Text style={styles.primaryBtnText}>Complete Guest Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={() => router.replace('/(tabs)')}>
          <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.lg, justifyContent: 'space-between', alignItems: 'center' },
  content: { alignItems: 'center', maxWidth: 400 },
  checkmark: { fontSize: 64, color: Brand.success, marginBottom: Spacing.lg },
  title: { ...Typography.h1, marginBottom: Spacing.md, textAlign: 'center' },
  body: { ...Typography.body, textAlign: 'center', lineHeight: 26 },
  actions: { width: '100%', maxWidth: 400, gap: Spacing.md },
  primaryBtn: { backgroundColor: Brand.primary, paddingVertical: 16, borderRadius: Radius.full, alignItems: 'center' },
  primaryBtnText: { color: '#fff', ...Typography.bodyMedium },
  secondaryBtn: { borderWidth: 1, paddingVertical: 16, borderRadius: Radius.full, alignItems: 'center' },
  secondaryBtnText: { ...Typography.bodyMedium },
});
