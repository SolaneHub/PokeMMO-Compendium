import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearQueryCache, fetchDataQuery, useDataQuery } from "./useDataQuery";

describe("useDataQuery", () => {
  beforeEach(() => {
    clearQueryCache();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    clearQueryCache();
    vi.useRealTimers();
  });

  it("performs initial fetch and populates data", async () => {
    const queryFn = vi.fn().mockResolvedValue({ id: 1, name: "Pikachu" });

    const { result } = renderHook(() => useDataQuery("pokemon:1", queryFn));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual({ id: 1, name: "Pikachu" });
    expect(result.current.error).toBeNull();
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it("serves from cache on subsequent calls within TTL", async () => {
    const queryFn = vi.fn().mockResolvedValue(["Thunderbolt", "Quick Attack"]);

    const { result: firstResult } = renderHook(() =>
      useDataQuery("moves:pikachu", queryFn, { ttl: 60000 })
    );

    await waitFor(() => {
      expect(firstResult.current.isLoading).toBe(false);
    });
    expect(queryFn).toHaveBeenCalledTimes(1);

    // Second render with the same query key within TTL
    const { result: secondResult } = renderHook(() =>
      useDataQuery("moves:pikachu", queryFn, { ttl: 60000 })
    );

    expect(secondResult.current.isLoading).toBe(false);
    expect(secondResult.current.data).toEqual(["Thunderbolt", "Quick Attack"]);
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it("re-fetches when TTL has expired", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    let currentTime = 1000000;
    vi.spyOn(Date, "now").mockImplementation(() => currentTime);

    const queryFn = vi
      .fn()
      .mockResolvedValueOnce("first-data")
      .mockResolvedValueOnce("second-data");

    const { result: firstResult } = renderHook(() =>
      useDataQuery("expiring-key", queryFn, { ttl: 5000 })
    );

    await waitFor(() => {
      expect(firstResult.current.data).toBe("first-data");
    });
    expect(queryFn).toHaveBeenCalledTimes(1);

    // Advance time past TTL
    currentTime += 6000;

    // A subsequent mount of the hook with the same key should detect expired cache and re-fetch
    const { result: secondResult } = renderHook(() =>
      useDataQuery("expiring-key", queryFn, { ttl: 5000 })
    );

    await waitFor(() => {
      expect(secondResult.current.data).toBe("second-data");
    });
    expect(queryFn).toHaveBeenCalledTimes(2);
  });

  it("deduplicates simultaneous in-flight requests", async () => {
    let resolvePromise!: (val: string) => void;
    const queryFn = vi.fn().mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          resolvePromise = resolve;
        })
    );

    // Launch two hooks simultaneously with the same key
    const { result: hook1 } = renderHook(() =>
      useDataQuery("concurrent-key", queryFn)
    );
    const { result: hook2 } = renderHook(() =>
      useDataQuery("concurrent-key", queryFn)
    );

    expect(queryFn).toHaveBeenCalledTimes(1);

    act(() => {
      resolvePromise("shared-value");
    });

    await waitFor(() => {
      expect(hook1.current.data).toBe("shared-value");
      expect(hook2.current.data).toBe("shared-value");
    });

    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it("deduplicates simultaneous in-flight promises via fetchDataQuery directly", async () => {
    let resolvePromise!: (val: string) => void;
    const queryFn = vi.fn().mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          resolvePromise = resolve;
        })
    );

    const p1 = fetchDataQuery("direct-concurrent", queryFn);
    const p2 = fetchDataQuery("direct-concurrent", queryFn);

    expect(queryFn).toHaveBeenCalledTimes(1);

    resolvePromise("direct-result");

    const [res1, res2] = await Promise.all([p1, p2]);
    expect(res1).toBe("direct-result");
    expect(res2).toBe("direct-result");
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it("forces a fresh fetch when refetch() is called", async () => {
    const queryFn = vi
      .fn()
      .mockResolvedValueOnce("initial-value")
      .mockResolvedValueOnce("refetched-value");

    const { result } = renderHook(() => useDataQuery("refetch-key", queryFn));

    await waitFor(() => {
      expect(result.current.data).toBe("initial-value");
    });
    expect(queryFn).toHaveBeenCalledTimes(1);

    await act(async () => {
      const refetched = await result.current.refetch();
      expect(refetched).toBe("refetched-value");
    });

    expect(result.current.data).toBe("refetched-value");
    expect(queryFn).toHaveBeenCalledTimes(2);
  });

  it("handles and exposes fetch errors", async () => {
    const networkError = new Error("Network timeout");
    const queryFn = vi.fn().mockRejectedValue(networkError);

    const { result } = renderHook(() => useDataQuery("error-key", queryFn));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toEqual(networkError);
    expect(result.current.data).toBeUndefined();
  });

  it("does not fetch when enabled is false", async () => {
    const queryFn = vi.fn().mockResolvedValue("disabled-data");

    const { result } = renderHook(() =>
      useDataQuery("disabled-key", queryFn, { enabled: false })
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(queryFn).not.toHaveBeenCalled();
  });

  it("clears cache and allows refetching on clearQueryCache()", async () => {
    const queryFn = vi
      .fn()
      .mockResolvedValueOnce("cache-1")
      .mockResolvedValueOnce("cache-2");

    const { result: firstResult } = renderHook(() =>
      useDataQuery("clear-key", queryFn)
    );

    await waitFor(() => {
      expect(firstResult.current.data).toBe("cache-1");
    });
    expect(queryFn).toHaveBeenCalledTimes(1);

    // Invalidate specific cache key
    clearQueryCache("clear-key");

    const { result: secondResult } = renderHook(() =>
      useDataQuery("clear-key", queryFn)
    );

    await waitFor(() => {
      expect(secondResult.current.data).toBe("cache-2");
    });
    expect(queryFn).toHaveBeenCalledTimes(2);

    // Invalidate all cache
    clearQueryCache();
  });
});
