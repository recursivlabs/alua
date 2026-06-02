import { useEffect, useState } from 'react';
import { useRecursivSafe } from '@/contexts/RecursivContext';
import { dbQuery } from '@/lib/database';
import { getCached, setCache } from '@/lib/cache';

/**
 * Stale-while-revalidate DB read.
 *
 * - Seeds from cache synchronously, so a page you've seen before paints with
 *   its data immediately (no spinner, no broken empty state).
 * - `loading` is only true on the very first load, when there's nothing cached
 *   yet — that's the one time we show a skeleton.
 * - Always revalidates in the background and updates the cache.
 */
export function useDbQuery<T = unknown>(cacheKey: string, sql: string, params: unknown[] = []) {
  const ctx = useRecursivSafe();
  const [data, setData] = useState<T[]>(() => (getCached(cacheKey) as T[] | null) ?? []);
  const [loading, setLoading] = useState<boolean>(() => getCached(cacheKey) == null);
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    if (!ctx?.sdk) return;
    let cancelled = false;
    dbQuery<T>(ctx.sdk, sql, params)
      .then((rows) => {
        if (cancelled) return;
        setData(rows);
        setCache(cacheKey, rows);
      })
      .catch((err) => {
        console.error('[useDbQuery]', cacheKey, err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // params is captured via paramsKey to keep deps stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx?.sdk, cacheKey, sql, paramsKey]);

  return { data, loading };
}
