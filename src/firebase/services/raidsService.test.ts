import {
  collection,
  DocumentData,
  getDocs,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Raid } from "@/types/raids";

import { getRaidsData } from "./raidsService";

// Mocking firebase/firestore
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
}));

// Mocking firebase config
vi.mock("@/firebase/config", () => ({
  db: {} as unknown as import("firebase/firestore").Firestore,
}));

describe("raidsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRaidsData", () => {
    it("should fetch and parse raids data successfully", async () => {
      const mockRaidData: Raid = {
        name: "Boss 1",
        stars: 5,
        moves: ["Move 1"],
        teamStrategies: [],
        locations: {
          Kanto: "Route 1",
        },
        mechanics: {
          ability: "Intimidate",
          notes: "Some notes",
        },
      };

      const mockDoc = {
        id: "doc1",
        data: () => mockRaidData,
      } as unknown as QueryDocumentSnapshot<DocumentData>;

      const mockSnapshot = {
        forEach: (
          callback: (doc: QueryDocumentSnapshot<DocumentData>) => void
        ) => callback(mockDoc),
      } as unknown as QuerySnapshot<DocumentData>;

      vi.mocked(getDocs).mockResolvedValue(mockSnapshot);

      const result = await getRaidsData();

      expect(collection).toHaveBeenCalled();
      expect(query).toHaveBeenCalled();
      expect(getDocs).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockRaidData);
    });

    it("should warn and skip invalid raid data", async () => {
      const invalidRaidData = {
        invalidField: "invalid",
      };

      const mockDoc = {
        id: "invalidDoc",
        data: () => invalidRaidData,
      } as unknown as QueryDocumentSnapshot<DocumentData>;

      const mockSnapshot = {
        forEach: (
          callback: (doc: QueryDocumentSnapshot<DocumentData>) => void
        ) => callback(mockDoc),
      } as unknown as QuerySnapshot<DocumentData>;

      vi.mocked(getDocs).mockResolvedValue(mockSnapshot);
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {
        return vi.fn();
      });

      const result = await getRaidsData();

      expect(result).toHaveLength(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[Zod Validation] Invalid Raid data"),
        expect.anything()
      );
    });
  });
});
