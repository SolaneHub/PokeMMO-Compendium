import * as firestore from "firebase/firestore";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { setMockDocs } from "@/test/setup";
import { TrainerRerunData } from "@/types/trainerRerun";

import { getTrainerRerun, updateTrainerRerun } from "./trainerRerunService";

vi.mock("./common", () => ({
  TRAINER_RERUN_COLLECTION: "trainerRerun",
}));

describe("trainerRerunService", () => {
  const mockData: TrainerRerunData = {
    intro: {
      title: "Intro Title",
      description: ["Line 1"],
    },
    requirements: {
      title: "Requirements",
      items: ["Item 1"],
    },
    tips_tricks: {
      title: "Tips & Tricks",
      items: ["Tip 1"],
    },
    regions: [
      {
        name: "Kanto",
        routes: [
          {
            name: "Route 1",
            trainers: [{ name: "Youngster", money: 100 }],
          },
        ],
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

  describe("getTrainerRerun", () => {
    it("returns trainer rerun data if document exists", async () => {
      setMockDocs([mockData]);

      const result = await getTrainerRerun();

      expect(result).toBeDefined();
      expect(result?.intro.title).toBe("Intro Title");
    });

    it("returns null if document does not exist", async () => {
      setMockDocs([]);
      vi.mocked(firestore.getDoc).mockResolvedValueOnce({
        exists: () => false,
      } as unknown as firestore.DocumentSnapshot);

      const result = await getTrainerRerun();

      expect(result).toBeNull();
    });

    it("returns null and warns if data is invalid", async () => {
      setMockDocs([{ intro: { title: 123 } }]); // Invalid title type

      const result = await getTrainerRerun();

      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe("updateTrainerRerun", () => {
    it("calls setDoc with correct parameters", async () => {
      await updateTrainerRerun(mockData);

      expect(firestore.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          intro: expect.objectContaining({ title: "Intro Title" }),
        })
      );
    });
  });
});
