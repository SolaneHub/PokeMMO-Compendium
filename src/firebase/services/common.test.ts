import * as firestore from "firebase/firestore/lite";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  commitBatchInChunks,
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
});
