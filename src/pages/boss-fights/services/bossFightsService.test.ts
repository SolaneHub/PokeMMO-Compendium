import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { BossFight } from "@/pages/boss-fights/types/bossFights";
import { setMockDocs } from "@/test/setup";

import { getBossFights } from "./bossFightsService";

vi.mock("@/firebase/services/common", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/firebase/services/common")>();
  return {
    ...actual,
    BOSS_FIGHTS_COLLECTION: "bossFights",
  };
});

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
});
