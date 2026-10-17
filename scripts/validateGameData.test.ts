import { describe, expect, it } from "vitest";

import { FEATURE_CONFIG } from "../src/utils/featureConfig";
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

  it("rileva errore se una feature ha link non valido (es. privo di '/' iniziale)", () => {
    const invalidFeatureConfig = {
      ...FEATURE_CONFIG,
      pokedex: {
        ...FEATURE_CONFIG.pokedex,
        link: "pokedex", // Mancanza dello slash iniziale
      },
    };

    const errors = validateGameDataRecords({
      featureConfig: invalidFeatureConfig,
    });

    expect(
      errors.some(
        (err) =>
          err.source === "FEATURE_CONFIG[pokedex]" &&
          err.message.includes("Field 'link' must start with '/'")
      )
    ).toBe(true);
  });

  it("rileva errore se una feature ha color non conforme a formato esadecimale valido", () => {
    const invalidFeatureConfig = {
      ...FEATURE_CONFIG,
      breeding: {
        ...FEATURE_CONFIG.breeding,
        color: "invalid-color",
      },
    };

    const errors = validateGameDataRecords({
      featureConfig: invalidFeatureConfig,
    });

    expect(
      errors.some(
        (err) =>
          err.source === "FEATURE_CONFIG[breeding]" &&
          err.message.includes(
            "Field 'color' must be a valid 6-character hex string"
          )
      )
    ).toBe(true);
  });

  it("rileva errore se una Poké Ball ha moltiplicatore non valido (< 1 o NaN)", () => {
    const invalidBallTypes = [
      { name: "Broken Ball", multiplier: 0.5 },
      { name: "NaN Ball", multiplier: Number.NaN },
    ];

    const errors = validateGameDataRecords({
      ballTypes: invalidBallTypes,
    });

    expect(
      errors.some(
        (err) =>
          err.source === "BALL_TYPES[Broken Ball]" &&
          err.message.includes("Field 'multiplier' must be a number >= 1")
      )
    ).toBe(true);

    expect(
      errors.some(
        (err) =>
          err.source === "BALL_TYPES[NaN Ball]" &&
          err.message.includes("Field 'multiplier' must be a number >= 1")
      )
    ).toBe(true);
  });
});
