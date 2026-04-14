import { useState, useEffect, useCallback } from 'react';
import { useRecursiv } from '@/contexts/RecursivContext';
import { dbQuery } from '@/lib/database';
import { getCached, isFresh, setCache } from '@/lib/cache';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  published: boolean;
}

export function useFaqs(category?: string) {
  const { sdk } = useRecursiv();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  const cacheKey = `faqs:${category || 'all'}`;

  const fetch = useCallback(async () => {
    if (isFresh(cacheKey)) {
      setFaqs(getCached(cacheKey) || []);
      setLoading(false);
      return;
    }
    try {
      const sql = category
        ? `SELECT * FROM faqs WHERE published = true AND category = $1 ORDER BY sort_order ASC`
        : `SELECT * FROM faqs WHERE published = true ORDER BY sort_order ASC`;
      const rows = await dbQuery<FAQ>(sdk, sql, category ? [category] : []);
      setFaqs(rows);
      setCache(cacheKey, rows);
    } catch (err: any) {
      console.error('[useFaqs]', err);
    } finally {
      setLoading(false);
    }
  }, [sdk, category, cacheKey]);

  useEffect(() => { fetch(); }, [fetch]);

  return { faqs, loading, refresh: fetch };
}
