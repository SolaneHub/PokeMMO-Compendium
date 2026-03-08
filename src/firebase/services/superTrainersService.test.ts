import * as firestore from "firebase/firestore";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { setMockDocs } from "@/test/setup";
import { SuperTrainer } from "@/types/superTrainers";

import {
  getSuperTrainers,
  updateSuperTrainersCollection,
} from "./superTrainersService";

vi.mock("./common", () => ({
  SUPER_TRAINERS_COLLECTION: "superTrainers",
}));

describe("superTrainersService", () => {
  const mockTrainer: SuperTrainer = {
    name: "Red",
    region: "Kanto",
    type: "Normal",
    image: "red.png",
    teams: {
      "Team 1": {
        pokemonNames: ["Pikachu"],
        pokemonStrategies: {
          Pikachu: [],
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

  describe("getSuperTrainers", () => {
    it("returns an array of super trainers from firestore", async () => {
      setMockDocs([mockTrainer]);

      const result = await getSuperTrainers();

      expect(result.length).toBe(1);
      const trainer = result[0];
      if (!trainer) throw new Error("Trainer not found");
      expect(trainer.name).toBe("Red");
    });

    it("filters out invalid trainers and warns", async () => {
      setMockDocs([
        mockTrainer,
        { id: "invalid", name: 123 } as unknown as SuperTrainer,
      ]); // Invalid name type

      const result = await getSuperTrainers();

      expect(result.length).toBe(1);
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe("updateSuperTrainersCollection", () => {
    it("calls writeBatch and commit with correct data", async () => {
      await updateSuperTrainersCollection([mockTrainer]);

      expect(firestore.writeBatch).toHaveBeenCalled();
      const results = vi.mocked(firestore.writeBatch).mock.results;
      const mockBatch = results[0]?.value;
      if (!mockBatch) throw new Error("Batch not found");
      expect(mockBatch.set).toHaveBeenCalled();
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("does nothing if array is empty", async () => {
      await updateSuperTrainersCollection([]);

      expect(firestore.writeBatch).not.toHaveBeenCalled();
    });

    it("skips trainers without a name", async () => {
      const invalidTrainer = { ...mockTrainer, name: "" };
      await updateSuperTrainersCollection([invalidTrainer]);

      const results = vi.mocked(firestore.writeBatch).mock.results;
      const mockBatch = results[0]?.value;
      if (!mockBatch) throw new Error("Batch not found");
      expect(mockBatch.set).not.toHaveBeenCalled();
    });
  });
});
