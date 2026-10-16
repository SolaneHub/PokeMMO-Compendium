import { describe, expect, it } from "vitest";

import { validateGameDataRecords } from "./validateGameData";

describe("validateGameDataRecords", () => {
  it("restituisce 0 errori con i dati attuali del repository", () => {
    const errors = validateGameDataRecords();
    expect(errors).toEqual([]);
  });

  it("rileva errore se checkFileExists restituisce false per una risorsa immagine", () => {
    const errors = validateGameDataRecords({
      checkFileExists: () => false,
    });
    expect(errors.length).toBeGreaterThan(0);
    expect(
      errors.some((err) =>
        err.message.includes(
          "Trainer image file does not exist in public/trainers/"
        )
      )
    ).toBe(true);
  });
});
