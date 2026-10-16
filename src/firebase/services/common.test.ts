import * as firestore from "firebase/firestore/lite";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import {
  commitBatchInChunks,
  fetchQueryDocuments,
  getPokemonDocId,
  updateCollectionBatch,
} from "./common";

describe("firebase/common", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPokemonDocId", () => {
    it("returns stringified lowercase ID when passed a string number", () => {
      expect(getPokemonDocId("001")).toBe("001");
      expect(getPokemonDocId("25")).toBe("025");
    });

    it("returns stringified number when passed a number", () => {
      expect(getPokemonDocId(1)).toBe("001");
      expect(getPokemonDocId(150)).toBe("150");
    });

    it("returns string as is when passed a name", () => {
      expect(getPokemonDocId("Bulbasaur")).toBe("Bulbasaur");
      expect(getPokemonDocId("Mr. Mime")).toBe("Mr. Mime");
    });
  });

  describe("commitBatchInChunks", () => {
    it("does nothing when items array is empty", async () => {
      const mockOp = vi.fn();
      await commitBatchInChunks([], 400, mockOp);
      expect(firestore.writeBatch).not.toHaveBeenCalled();
      expect(mockOp).not.toHaveBeenCalled();
    });

    it("executes single batch when items count is below chunkSize", async () => {
      const mockOp = vi.fn();
      const items = Array.from({ length: 50 }, (_, i) => ({ id: `item-${i}` }));

      await commitBatchInChunks(items, 400, mockOp);

      expect(firestore.writeBatch).toHaveBeenCalledTimes(1);
      expect(mockOp).toHaveBeenCalledTimes(50);
    });

    it("chunks batch operations when items count exceeds chunkSize (>400)", async () => {
      const mockOp = vi.fn();
      // 850 items with chunk size 400 should trigger ceil(850 / 400) = 3 batches
      const items = Array.from({ length: 850 }, (_, i) => ({
        id: `item-${i}`,
      }));

      await commitBatchInChunks(items, 400, mockOp);

      expect(firestore.writeBatch).toHaveBeenCalledTimes(3);
      expect(mockOp).toHaveBeenCalledTimes(850);
    });
  });

  describe("updateCollectionBatch", () => {
    it("returns early when items array is empty", async () => {
      await updateCollectionBatch(
        "test-col",
        [],
        (item: { id: string }) => item.id
      );
      expect(firestore.writeBatch).not.toHaveBeenCalled();
    });

    it("updates documents in chunks and skips items with empty docId", async () => {
      const items = [
        { id: "1", name: "Alpha" },
        { id: "", name: "Skip Me" },
        { id: "2", name: "Beta" },
      ];

      await updateCollectionBatch("test-col", items, (item) => item.id || null);

      expect(firestore.writeBatch).toHaveBeenCalledTimes(1);
      expect(firestore.doc).toHaveBeenCalledWith(
        expect.anything(),
        "test-col",
        "1"
      );
      expect(firestore.doc).toHaveBeenCalledWith(
        expect.anything(),
        "test-col",
        "2"
      );
      expect(firestore.doc).not.toHaveBeenCalledWith(
        expect.anything(),
        "test-col",
        ""
      );
    });
  });

  describe("fetchQueryDocuments", () => {
    const TestSchema = z.object({
      id: z.string(),
      title: z.string(),
      count: z.number().optional(),
    });

    it("parses and validates valid documents with safeParse", async () => {
      const mockDocs = [
        { id: "doc-1", data: () => ({ title: "First", count: 10 }) },
        { id: "doc-2", data: () => ({ title: "Second" }) },
      ];
      vi.mocked(firestore.getDocs).mockResolvedValueOnce({
        forEach: (cb: (doc: unknown) => void) => mockDocs.forEach(cb),
      } as unknown as firestore.QuerySnapshot);

      const result = await fetchQueryDocuments(
        {} as firestore.Query,
        TestSchema
      );
      expect(result).toEqual([
        { id: "doc-1", title: "First", count: 10 },
        { id: "doc-2", title: "Second" },
      ]);
    });

    it("correctly applies custom transformDoc parameter", async () => {
      const mockDocs = [
        {
          id: "doc-custom",
          data: () => ({ title: "Custom Title" }),
          ref: { parent: { parent: { id: "user-123" } } },
        },
      ];
      vi.mocked(firestore.getDocs).mockResolvedValueOnce({
        forEach: (cb: (doc: unknown) => void) => mockDocs.forEach(cb),
      } as unknown as firestore.QuerySnapshot);

      const ExtendedSchema = z.object({
        id: z.string(),
        title: z.string(),
        ownerId: z.string(),
      });

      const result = await fetchQueryDocuments(
        {} as firestore.Query,
        ExtendedSchema,
        (doc) => {
          const customDoc = doc as unknown as {
            id: string;
            data: () => Record<string, unknown>;
            ref: { parent: { parent?: { id: string } } };
          };
          return {
            id: customDoc.id,
            ownerId: customDoc.ref.parent.parent?.id ?? "unknown",
            ...customDoc.data(),
          };
        }
      );

      expect(result).toEqual([
        {
          id: "doc-custom",
          title: "Custom Title",
          ownerId: "user-123",
        },
      ]);
    });

    it("discards invalid documents and logs a console.warn", async () => {
      const warnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => undefined);
      const mockDocs = [
        { id: "valid-doc", data: () => ({ title: "Valid" }) },
        { id: "invalid-doc", data: () => ({ invalidField: 123 }) },
      ];
      vi.mocked(firestore.getDocs).mockResolvedValueOnce({
        forEach: (cb: (doc: unknown) => void) => mockDocs.forEach(cb),
      } as unknown as firestore.QuerySnapshot);

      const result = await fetchQueryDocuments(
        {} as firestore.Query,
        TestSchema
      );

      expect(result).toEqual([{ id: "valid-doc", title: "Valid" }]);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "[Zod Validation] Invalid document ID: invalid-doc"
        ),
        expect.anything()
      );
      warnSpy.mockRestore();
    });
  });
});
