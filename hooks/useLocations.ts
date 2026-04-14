import { useState, useEffect, useCallback } from 'react';
import { useRecursiv } from '@/contexts/RecursivContext';
import { dbQuery } from '@/lib/database';
import { getCached, isFresh, setCache } from '@/lib/cache';

export interface LocationData {
  id: string;
  name: string;
  country: string;
  description: string;
  image_urls: string[];
  season_start: number;
  season_end: number;
  timezone: string;
  surf_details: any;
  travel_info: any;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getSeasonLabel(start: number, end: number): string {
  return `${MONTH_NAMES[start - 1]} – ${MONTH_NAMES[end - 1]}`;
}

export function isInSeason(start: number, end: number): boolean {
  const now = new Date().getMonth() + 1;
  if (start <= end) return now >= start && now <= end;
  return now >= start || now <= end;
}

export function useLocations() {
  const { sdk } = useRecursiv();
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (isFresh('locations')) {
      setLocations(getCached('locations') || []);
      setLoading(false);
      return;
    }
    try {
      const rows = await dbQuery<LocationData>(sdk, `SELECT * FROM locations ORDER BY season_start ASC`);
      setLocations(rows);
      setCache('locations', rows);
    } catch (err: any) {
      console.error('[useLocations]', err);
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  useEffect(() => { fetch(); }, [fetch]);

  return { locations, loading, refresh: fetch };
}
