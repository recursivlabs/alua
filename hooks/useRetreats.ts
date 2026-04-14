import { useState, useEffect, useCallback } from 'react';
import { useRecursiv } from '@/contexts/RecursivContext';
import { dbQuery } from '@/lib/database';
import { getCached, isFresh, setCache } from '@/lib/cache';

export interface Retreat {
  id: string;
  location_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  price_cents: number;
  currency: string;
  deposit_cents: number | null;
  max_capacity: number;
  current_bookings: number;
  status: string;
  included: string[];
  daily_schedule: any[];
  image_urls: string[];
  cancellation_policy: any[];
  packing_list: string[];
  created_at: string;
  // joined
  location_name?: string;
  location_country?: string;
}

export function useRetreats(locationId?: string) {
  const { sdk } = useRecursiv();
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `retreats:${locationId || 'all'}`;

  const fetch = useCallback(async () => {
    if (isFresh(cacheKey)) {
      setRetreats(getCached(cacheKey) || []);
      setLoading(false);
      return;
    }

    try {
      const sql = locationId
        ? `SELECT r.*, l.name as location_name, l.country as location_country FROM retreats r LEFT JOIN locations l ON r.location_id = l.id WHERE r.status = 'published' AND r.location_id = $1 ORDER BY r.start_date ASC`
        : `SELECT r.*, l.name as location_name, l.country as location_country FROM retreats r LEFT JOIN locations l ON r.location_id = l.id WHERE r.status = 'published' ORDER BY r.start_date ASC`;

      const rows = await dbQuery<Retreat>(sdk, sql, locationId ? [locationId] : []);
      setRetreats(rows);
      setCache(cacheKey, rows);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sdk, locationId, cacheKey]);

  useEffect(() => { fetch(); }, [fetch]);

  return { retreats, loading, error, refresh: fetch };
}

export function useRetreat(id: string) {
  const { sdk } = useRecursiv();
  const [retreat, setRetreat] = useState<Retreat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    dbQuery<Retreat>(sdk, `SELECT r.*, l.name as location_name, l.country as location_country FROM retreats r LEFT JOIN locations l ON r.location_id = l.id WHERE r.id = $1`, [id])
      .then((rows) => setRetreat(rows[0] || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sdk, id]);

  return { retreat, loading };
}
