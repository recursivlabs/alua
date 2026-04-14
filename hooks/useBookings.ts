import { useState, useEffect, useCallback } from 'react';
import { useRecursiv } from '@/contexts/RecursivContext';
import { useAuth } from '@/contexts/AuthContext';
import { dbQuery } from '@/lib/database';

export interface Booking {
  id: string;
  user_id: string;
  booking_type: string;
  item_id: string;
  status: string;
  payment_status: string;
  amount_cents: number;
  deposit_paid_cents: number;
  stripe_session_id: string | null;
  guest_info: any;
  notes: string | null;
  booked_at: string;
  cancelled_at: string | null;
  // joined
  item_title?: string;
  location_name?: string;
  start_date?: string;
}

export function useBookings() {
  const { sdk } = useRecursiv();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    try {
      const rows = await dbQuery<Booking>(sdk, `
        SELECT b.*,
          COALESCE(r.title, e.title) as item_title,
          COALESCE(rl.name, el.name) as location_name,
          r.start_date
        FROM bookings b
        LEFT JOIN retreats r ON b.booking_type = 'retreat' AND b.item_id = r.id
        LEFT JOIN locations rl ON r.location_id = rl.id
        LEFT JOIN experiences e ON b.booking_type = 'experience' AND b.item_id = e.id
        LEFT JOIN locations el ON e.location_id = el.id
        WHERE b.user_id = $1
        ORDER BY b.booked_at DESC
      `, [user.id]);
      setBookings(rows);
    } catch (err: any) {
      console.error('[useBookings]', err);
    } finally {
      setLoading(false);
    }
  }, [sdk, user]);

  useEffect(() => { fetch(); }, [fetch]);

  const createBooking = useCallback(async (data: {
    bookingType: string;
    itemId: string;
    amountCents: number;
    guestInfo?: any;
  }) => {
    if (!user) return;
    await dbQuery(sdk, `
      INSERT INTO bookings (user_id, booking_type, item_id, amount_cents, guest_info, status, payment_status)
      VALUES ($1, $2, $3, $4, $5, 'confirmed', 'paid')
    `, [user.id, data.bookingType, data.itemId, data.amountCents, JSON.stringify(data.guestInfo || {})]);
    await fetch();
  }, [sdk, user, fetch]);

  return { bookings, loading, refresh: fetch, createBooking };
}
