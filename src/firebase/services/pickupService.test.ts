import * as firestore from "firebase/firestore";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { setMockDocs } from "@/test/setup";
import { PickupRegion } from "@/types/pickup";

import { getPickupData, updatePickupCollection } from "./pickupService";

vi.mock("./common", () => ({
  PICKUP_COLLECTION: "pickup",
}));

describe("pickupService", () => {
  const mockRegion: PickupRegion = {
    id: "kanto",
    name: "Kanto",
    locations: [
      {
        name: "Route 1",
        items: {
          Common: ["Potion", "Antidote"],
        },
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "warn").mockImplementation(() => {
      // Mock console.warn
    });
  });

  afterEach(() => {
    setMockDocs([]);
    vi.restoreAllMocks();
  });

  describe("getPickupData", () => {
    it("returns an array of pickup regions from firestore", async () => {
      setMockDocs([mockRegion]);

      const result = await getPickupData();

      expect(result.length).toBe(1);
      const region = result[0];
      if (!region) throw new Error("Region not found");
      expect(region.name).toBe("Kanto");
    });

    it("filters out invalid regions and warns", async () => {
      setMockDocs([
        mockRegion,
        { id: "invalid", name: 123 } as unknown as PickupRegion,
      ]); // Invalid name type

      const result = await getPickupData();

      expect(result.length).toBe(1);
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe("updatePickupCollection", () => {
    it("calls writeBatch and commit with correct data", async () => {
      await updatePickupCollection([mockRegion]);

      expect(firestore.writeBatch).toHaveBeenCalled();
      const results = vi.mocked(firestore.writeBatch).mock.results;
      const mockBatch = results[0]?.value;
      if (!mockBatch) throw new Error("Batch not found");
      expect(mockBatch.set).toHaveBeenCalled();
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("does nothing if array is empty", async () => {
      await updatePickupCollection([]);

      expect(firestore.writeBatch).not.toHaveBeenCalled();
    });

    it("skips regions without a name", async () => {
      const invalidRegion = { ...mockRegion, name: "" };
      await updatePickupCollection([invalidRegion]);

      const results = vi.mocked(firestore.writeBatch).mock.results;
      const mockBatch = results[0]?.value;
      if (!mockBatch) throw new Error("Batch not found");
      expect(mockBatch.set).not.toHaveBeenCalled();
    });
  });
});
