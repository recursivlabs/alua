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
  // Only show a skeleton when we can actually fetch (signed-in) and have no
  // cache yet. Logged-out visitors go straight to the bundled fallback.
  const [loading, setLoading] = useState<boolean>(() => !!ctx?.sdk && getCached(cacheKey) == null);
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    // Logged-out / public visitor: there's no authenticated SDK (the app only
    // mounts RecursivProvider when signed in). We can't read the DB, so resolve
    // loading and let the page fall through to its bundled fallback content
    // instead of hanging on a skeleton forever.
    if (!ctx?.sdk) {
      setLoading(false);
      return;
    }
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
