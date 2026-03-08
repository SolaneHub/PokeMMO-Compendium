import * as firestore from "firebase/firestore";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { setMockDocs } from "@/test/setup";
import { BossFight } from "@/types/bossFights";

import { getBossFights, updateBossFightsCollection } from "./bossFightsService";

vi.mock("./common", () => ({
  BOSS_FIGHTS_COLLECTION: "bossFights",
}));

describe("bossFightsService", () => {
  const mockBoss: BossFight = {
    name: "Giovanni",
    region: "Kanto",
    type: "Ground",
    image: "giovanni.png",
    teams: {
      "Final Fight": {
        pokemonNames: ["Nidoking"],
        pokemonStrategies: {
          Nidoking: [],
        },
      },
    },
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

  describe("getBossFights", () => {
    it("returns an array of boss fights from firestore", async () => {
      setMockDocs([mockBoss]);

      const result = await getBossFights();

      expect(result.length).toBe(1);
      const boss = result[0];
      if (!boss) throw new Error("Boss not found");
      expect(boss.name).toBe("Giovanni");
    });

    it("filters out invalid boss fights and warns", async () => {
      setMockDocs([
        mockBoss,
        { id: "invalid", name: 123 } as unknown as BossFight,
      ]); // Invalid name type

      const result = await getBossFights();

      expect(result.length).toBe(1);
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe("updateBossFightsCollection", () => {
    it("calls writeBatch and commit with correct data", async () => {
      await updateBossFightsCollection([mockBoss]);

      expect(firestore.writeBatch).toHaveBeenCalled();
      const results = vi.mocked(firestore.writeBatch).mock.results;
      const mockBatch = results[0]?.value;
      if (!mockBatch) throw new Error("Batch not found");
      expect(mockBatch.set).toHaveBeenCalled();
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("does nothing if array is empty", async () => {
      await updateBossFightsCollection([]);

      expect(firestore.writeBatch).not.toHaveBeenCalled();
    });

    it("skips boss fights without a name or region", async () => {
      const invalidBoss1 = { ...mockBoss, name: "" };
      const invalidBoss2 = { ...mockBoss, region: "" };
      await updateBossFightsCollection([invalidBoss1, invalidBoss2]);

      const results = vi.mocked(firestore.writeBatch).mock.results;
      const mockBatch = results[0]?.value;
      if (!mockBatch) throw new Error("Batch not found");
      expect(mockBatch.set).not.toHaveBeenCalled();
    });
  });
});
