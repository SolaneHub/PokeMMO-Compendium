import {
  AggregateQuerySnapshot,
  Firestore,
  getCountFromServer,
  getDocs,
  QuerySnapshot,
  WriteBatch,
  writeBatch,
} from "firebase/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { updateBossFightsCollection } from "@/firebase/services/bossFightsService";
import { updateTrainerRerun } from "@/firebase/services/trainerRerunService";
import { BossFight } from "@/types/bossFights";
import { Pokemon } from "@/types/pokemon";
import { TrainerRerunData } from "@/types/trainerRerun";

import {
  cleanupPokedexImages,
  migrateBossFightsToFirestore,
  migratePokedexToFirestore,
  migrateTrainerRerunToFirestore,
  verifyPokedexMigration,
} from "./migrationUtils";

// Mocking firebase/firestore
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  deleteField: vi.fn(() => "deleteField"),
  doc: vi.fn(),
  getCountFromServer: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  writeBatch: vi.fn(),
}));

// Mocking firebase config
vi.mock("@/firebase/config", () => ({
  db: {} as unknown as Firestore,
}));

// Mocking services
vi.mock("@/firebase/services/bossFightsService", () => ({
  updateBossFightsCollection: vi.fn(),
}));

vi.mock("@/firebase/services/trainerRerunService", () => ({
  updateTrainerRerun: vi.fn(),
}));

describe("migrationUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("alert", vi.fn());
    vi.stubGlobal(
      "confirm",
      vi.fn(() => true)
    );
  });

  describe("verifyPokedexMigration", () => {
    it("should alert the document count on success", async () => {
      vi.mocked(getCountFromServer).mockResolvedValue({
        data: () => ({ count: 151 }),
      } as unknown as AggregateQuerySnapshot<
        Record<string, unknown>,
        string,
        MockDocumentData
      >);

      await verifyPokedexMigration();

      expect(alert).toHaveBeenCalledWith(
        expect.stringContaining("151 documenti")
      );
    });

    it("should alert error on failure", async () => {
      vi.mocked(getCountFromServer).mockRejectedValue(
        new Error("Firebase error")
      );

      await verifyPokedexMigration();

      expect(alert).toHaveBeenCalledWith(
        expect.stringContaining("Errore verifica: Firebase error")
      );
    });
  });

  describe("cleanupPokedexImages", () => {
    it("should do nothing if confirmation is cancelled", async () => {
      vi.stubGlobal(
        "confirm",
        vi.fn(() => false)
      );

      await cleanupPokedexImages();

      expect(getDocs).not.toHaveBeenCalled();
    });

    it("should cleanup images in batches", async () => {
      const mockDocs = Array.from({ length: 500 }, (_, i) => ({
        id: `id${i}`,
      }));

      vi.mocked(getDocs).mockResolvedValue({
        docs: mockDocs,
      } as unknown as QuerySnapshot<unknown, MockDocumentData>);

      const mockBatch = {
        update: vi.fn(),
        commit: vi.fn().mockResolvedValue(undefined),
      };
      vi.mocked(writeBatch).mockReturnValue(mockBatch as unknown as WriteBatch);

      await cleanupPokedexImages();

      expect(mockBatch.update).toHaveBeenCalledTimes(500);
      expect(mockBatch.commit).toHaveBeenCalledTimes(2); // 450 + 50
      expect(alert).toHaveBeenCalledWith(
        expect.stringContaining("Pulizia completata! Rimosse immagini da 500")
      );
    });
  });

  describe("migrateBossFightsToFirestore", () => {
    it("should alert if no data is provided", async () => {
      await migrateBossFightsToFirestore([]);
      expect(alert).toHaveBeenCalledWith("Nessun dato Boss Fight fornito.");
    });

    it("should do nothing if confirmation is cancelled", async () => {
      vi.stubGlobal(
        "confirm",
        vi.fn(() => false)
      );
      await migrateBossFightsToFirestore([
        { name: "Boss" } as unknown as BossFight,
      ]);
      expect(updateBossFightsCollection).not.toHaveBeenCalled();
    });

    it("should call updateBossFightsCollection on success", async () => {
      const mockData = [{ name: "Boss" } as unknown as BossFight];
      await migrateBossFightsToFirestore(mockData);

      expect(updateBossFightsCollection).toHaveBeenCalledWith(mockData);
      expect(alert).toHaveBeenCalledWith("Boss Fights migrati con successo!");
    });

    it("should alert error on failure", async () => {
      vi.mocked(updateBossFightsCollection).mockRejectedValue(
        new Error("Service error")
      );
      await migrateBossFightsToFirestore([
        { name: "Boss" } as unknown as BossFight,
      ]);
      expect(alert).toHaveBeenCalledWith(
        expect.stringContaining("Errore migrazione Boss Fights")
      );
    });
  });

  describe("migrateTrainerRerunToFirestore", () => {
    it("should do nothing if no data is provided", async () => {
      await migrateTrainerRerunToFirestore(null as unknown as TrainerRerunData);
      expect(confirm).not.toHaveBeenCalled();
    });

    it("should do nothing if confirmation is cancelled", async () => {
      vi.stubGlobal(
        "confirm",
        vi.fn(() => false)
      );
      await migrateTrainerRerunToFirestore({
        some: "data",
      } as unknown as TrainerRerunData);
      expect(updateTrainerRerun).not.toHaveBeenCalled();
    });

    it("should call updateTrainerRerun on success", async () => {
      const mockData = { some: "data" } as unknown as TrainerRerunData;
      await migrateTrainerRerunToFirestore(mockData);

      expect(updateTrainerRerun).toHaveBeenCalledWith(mockData);
      expect(alert).toHaveBeenCalledWith("Trainer Rerun migrato con successo!");
    });

    it("should alert error on failure", async () => {
      vi.mocked(updateTrainerRerun).mockRejectedValue(
        new Error("Service error")
      );
      await migrateTrainerRerunToFirestore({
        some: "data",
      } as unknown as TrainerRerunData);
      expect(alert).toHaveBeenCalledWith(
        expect.stringContaining("Errore migrazione Trainer Rerun")
      );
    });
  });

  describe("migratePokedexToFirestore", () => {
    it("should alert if no data is provided", async () => {
      await migratePokedexToFirestore([]);
      expect(alert).toHaveBeenCalledWith(
        "Nessun dato Pokedex fornito per la migrazione."
      );
    });

    it("should do nothing if confirmation is cancelled", async () => {
      vi.stubGlobal(
        "confirm",
        vi.fn(() => false)
      );
      await migratePokedexToFirestore([{ id: 1 } as unknown as Pokemon]);
      expect(writeBatch).not.toHaveBeenCalled();
    });

    it("should skip pokemon without id", async () => {
      const mockPokedex = [{ name: "NoId" } as unknown as Pokemon];
      const mockBatch = {
        set: vi.fn(),
        commit: vi.fn().mockResolvedValue(undefined),
      };
      vi.mocked(writeBatch).mockReturnValue(mockBatch as unknown as WriteBatch);

      await migratePokedexToFirestore(mockPokedex);

      expect(mockBatch.set).not.toHaveBeenCalled();
      expect(alert).toHaveBeenCalledWith(
        expect.stringContaining("Migrazione completata! 0 Pokémon")
      );
    });

    it("should migrate pokedex in batches", async () => {
      const mockPokedex = Array.from(
        { length: 500 },
        (_, i) =>
          ({
            id: (i + 1).toString(),
            name: `Poke${i}`,
          }) as unknown as Pokemon
      );

      const mockBatch = {
        set: vi.fn(),
        commit: vi.fn().mockResolvedValue(undefined),
      };
      vi.mocked(writeBatch).mockReturnValue(mockBatch as unknown as WriteBatch);

      await migratePokedexToFirestore(mockPokedex);

      expect(mockBatch.set).toHaveBeenCalledTimes(500);
      expect(mockBatch.commit).toHaveBeenCalledTimes(2);
      expect(alert).toHaveBeenCalledWith(
        expect.stringContaining("Migrazione completata! 500 Pokémon")
      );
    });

    it("should alert error on failure", async () => {
      vi.mocked(writeBatch).mockImplementation(() => {
        throw new Error("Batch error");
      });
      await migratePokedexToFirestore([{ id: 1 } as unknown as Pokemon]);
      expect(alert).toHaveBeenCalledWith(
        expect.stringContaining("Errore durante la migrazione: Batch error")
      );
    });
  });
});

type MockDocumentData = Record<string, unknown>;
