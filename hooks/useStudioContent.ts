import { useState, useEffect, useCallback } from 'react';
import { useRecursiv } from '@/contexts/RecursivContext';
import { dbQuery } from '@/lib/database';
import { getCached, isFresh, setCache } from '@/lib/cache';

export interface StudioContent {
  id: string;
  title: string;
  description: string;
  content_type: 'recorded' | 'live';
  category: string;
  duration_minutes: number;
  video_url: string | null;
  thumbnail_url: string | null;
  external_link: string | null;
  scheduled_at: string | null;
  published: boolean;
  sort_order: number;
}

export function useStudioContent(type?: 'recorded' | 'live') {
  const { sdk } = useRecursiv();
  const [content, setContent] = useState<StudioContent[]>([]);
  const [loading, setLoading] = useState(true);

  const cacheKey = `studio:${type || 'all'}`;

  const fetch = useCallback(async () => {
    if (isFresh(cacheKey)) {
      setContent(getCached(cacheKey) || []);
      setLoading(false);
      return;
    }
    try {
      const sql = type
        ? `SELECT * FROM studio_content WHERE published = true AND content_type = $1 ORDER BY sort_order ASC, created_at DESC`
        : `SELECT * FROM studio_content WHERE published = true ORDER BY sort_order ASC, created_at DESC`;
      const rows = await dbQuery<StudioContent>(sdk, sql, type ? [type] : []);
      setContent(rows);
      setCache(cacheKey, rows);
    } catch (err: any) {
      console.error('[useStudioContent]', err);
    } finally {
      setLoading(false);
    }
  }, [sdk, type, cacheKey]);

  useEffect(() => { fetch(); }, [fetch]);

  return { content, loading, refresh: fetch };
}
