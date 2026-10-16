import { useCallback, useEffect, useRef, useState } from "react";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

export interface DataQueryOptions {
  ttl?: number | undefined;
  enabled?: boolean | undefined;
}

export interface UseDataQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<T>;
}

export const DEFAULT_QUERY_TTL = 1000 * 60 * 5; // 5 minutes

/**
 * Direct fetch helper using the query cache and inflight promise deduplication.
 */
export async function fetchDataQuery<T>(
  queryKey: string,
  queryFn: () => Promise<T>,
  options: { ttl?: number } = {}
): Promise<T> {
  const ttl = options.ttl ?? DEFAULT_QUERY_TTL;
  const now = Date.now();
  const cached = cache.get(queryKey) as CacheEntry<T> | undefined;

  if (cached && now - cached.timestamp < ttl) {
    return cached.data;
  }

  const existingPromise = inflight.get(queryKey) as Promise<T> | undefined;
  if (existingPromise) {
    return existingPromise;
  }

  const promise = queryFn()
    .then((result) => {
      cache.set(queryKey, { data: result, timestamp: Date.now() });
      return result;
    })
    .finally(() => {
      inflight.delete(queryKey);
    });

  inflight.set(queryKey, promise);
  return promise;
}

/**
 * Resets or invalidates query cache (useful in tests or forced refetches).
 */
export function clearQueryCache(queryKey?: string) {
  if (queryKey) {
    cache.delete(queryKey);
    inflight.delete(queryKey);
  } else {
    cache.clear();
    inflight.clear();
  }
}

/**
 * Lightweight in-memory cached query hook replacing TanStack Query.
 */
export function useDataQuery<T>(
  queryKey: string,
  queryFn: () => Promise<T>,
  options: DataQueryOptions = {}
): UseDataQueryResult<T> {
  const { ttl = DEFAULT_QUERY_TTL, enabled = true } = options;

  const queryFnRef = useRef(queryFn);
  useEffect(() => {
    queryFnRef.current = queryFn;
  });

  const getInitialState = (): { data: T | undefined; isLoading: boolean } => {
    if (!enabled) {
      return { data: undefined, isLoading: false };
    }
    const cached = cache.get(queryKey) as CacheEntry<T> | undefined;
    if (cached && Date.now() - cached.timestamp < ttl) {
      return { data: cached.data, isLoading: false };
    }
    return { data: undefined, isLoading: true };
  };

  const [state, setState] = useState<{
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
  }>(() => {
    const initial = getInitialState();
    return { ...initial, error: null };
  });

  const [tracked, setTracked] = useState({ queryKey, enabled });
  if (tracked.queryKey !== queryKey || tracked.enabled !== enabled) {
    setTracked({ queryKey, enabled });
    const initial = getInitialState();
    setState({ ...initial, error: null });
  }

  const executeFetch = useCallback(
    async (forceFresh = false): Promise<T> => {
      if (forceFresh) {
        cache.delete(queryKey);
        inflight.delete(queryKey);
      }
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const result = await fetchDataQuery(
          queryKey,
          () => queryFnRef.current(),
          { ttl }
        );
        setState({ data: result, isLoading: false, error: null });
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setState((prev) => ({ ...prev, isLoading: false, error }));
        throw error;
      }
    },
    [queryKey, ttl]
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const cached = cache.get(queryKey) as CacheEntry<T> | undefined;
    if (cached && Date.now() - cached.timestamp < ttl) {
      if (state.data !== cached.data || state.isLoading) {
        setState({ data: cached.data, isLoading: false, error: null });
      }
      return;
    }

    let isMounted = true;

    fetchDataQuery(queryKey, () => queryFnRef.current(), { ttl })
      .then((result) => {
        if (isMounted) {
          setState({ data: result, isLoading: false, error: null });
        }
      })
      .catch((err) => {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err));
          setState((prev) => ({ ...prev, isLoading: false, error }));
        }
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey, ttl, enabled]);

  const refetch = useCallback(() => executeFetch(true), [executeFetch]);

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    refetch,
  };
}

if (import.meta.env.DEV && typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>)["__POKEMMO_CACHE__"] = {
    getCache: () => cache,
    getInflight: () => inflight,
    clear: clearQueryCache,
    getStats: () => ({
      cachedQueries: cache.size,
      keys: Array.from(cache.keys()),
      inflightCount: inflight.size,
    }),
  };
}
