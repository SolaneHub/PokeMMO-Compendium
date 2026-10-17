import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { fetchCollectionData } from "@/firebase/services/common";
import { useCollectionData } from "@/hooks/useCollectionData";

vi.mock("@/firebase/services/common", () => ({
  fetchCollectionData: vi.fn(),
}));

describe("useCollectionData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("invoca fetchCollectionData con collection name, schema e includeId", async () => {
    const mockData = [{ id: "doc-1", title: "Test Doc" }];
    vi.mocked(fetchCollectionData).mockResolvedValueOnce(mockData);

    const schema = z.object({ id: z.string(), title: z.string() });

    const { result } = renderHook(() =>
      useCollectionData("testCollection", schema, { includeId: true })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchCollectionData).toHaveBeenCalledWith("testCollection", schema, {
      includeId: true,
    });
    expect(result.current.data).toEqual(mockData);
  });

  it("ordina i dati restituiti quando viene fornita una funzione sortFn", async () => {
    const mockData = [
      { id: "2", order: 20 },
      { id: "1", order: 10 },
      { id: "3", order: 30 },
    ];
    vi.mocked(fetchCollectionData).mockResolvedValueOnce([...mockData]);

    const schema = z.object({ id: z.string(), order: z.number() });
    const sortFn = (a: { order: number }, b: { order: number }) =>
      a.order - b.order;

    const { result } = renderHook(() =>
      useCollectionData("sortedCollection", schema, { sortFn })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([
      { id: "1", order: 10 },
      { id: "2", order: 20 },
      { id: "3", order: 30 },
    ]);
  });

  it("non esegue il fetch quando enabled è impostato a false", () => {
    const schema = z.object({ id: z.string() });

    const { result } = renderHook(() =>
      useCollectionData("disabledCollection", schema, { enabled: false })
    );

    expect(fetchCollectionData).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
