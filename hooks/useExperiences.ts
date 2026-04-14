import { useState, useEffect, useCallback } from 'react';
import { useRecursiv } from '@/contexts/RecursivContext';
import { dbQuery } from '@/lib/database';
import { getCached, isFresh, setCache } from '@/lib/cache';

export interface Experience {
  id: string;
  location_id: string;
  title: string;
  description: string;
  price_cents: number;
  currency: string;
  max_capacity: number;
  duration_hours: number;
  available_dates: any;
  status: string;
  included: string[];
  image_urls: string[];
  created_at: string;
  location_name?: string;
  location_country?: string;
}

export function useExperiences(locationId?: string) {
  const { sdk } = useRecursiv();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const cacheKey = `experiences:${locationId || 'all'}`;

  const fetch = useCallback(async () => {
    if (isFresh(cacheKey)) {
      setExperiences(getCached(cacheKey) || []);
      setLoading(false);
      return;
    }
    try {
      const sql = locationId
        ? `SELECT e.*, l.name as location_name, l.country as location_country FROM experiences e LEFT JOIN locations l ON e.location_id = l.id WHERE e.status = 'published' AND e.location_id = $1 ORDER BY e.created_at DESC`
        : `SELECT e.*, l.name as location_name, l.country as location_country FROM experiences e LEFT JOIN locations l ON e.location_id = l.id WHERE e.status = 'published' ORDER BY e.created_at DESC`;
      const rows = await dbQuery<Experience>(sdk, sql, locationId ? [locationId] : []);
      setExperiences(rows);
      setCache(cacheKey, rows);
    } catch (err: any) {
      console.error('[useExperiences]', err);
    } finally {
      setLoading(false);
    }
  }, [sdk, locationId, cacheKey]);

  useEffect(() => { fetch(); }, [fetch]);

  return { experiences, loading, refresh: fetch };
}

export function useExperience(id: string) {
  const { sdk } = useRecursiv();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    dbQuery<Experience>(sdk, `SELECT e.*, l.name as location_name, l.country as location_country FROM experiences e LEFT JOIN locations l ON e.location_id = l.id WHERE e.id = $1`, [id])
      .then((rows) => setExperience(rows[0] || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sdk, id]);

  return { experience, loading };
}
