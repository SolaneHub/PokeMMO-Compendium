import { describe, expect, it } from "vitest";

import {
  calculateSummarySize,
  generateSimulatedSummaryPayload,
  MAX_THRESHOLD_BYTES,
  validateSummaryThresholds,
  WARNING_THRESHOLD_BYTES,
} from "./checkPokedexSummarySize";

describe("checkPokedexSummarySize", () => {
  it("calculates byte size correctly for controlled payloads", () => {
    const payload = { hello: "world" };
    const expectedLength = Buffer.byteLength(JSON.stringify(payload), "utf8");
    expect(calculateSummarySize(payload)).toBe(expectedLength);

    const utf8Payload = { pokemon: "Nidoran♀", region: "Kanto" };
    expect(calculateSummarySize(utf8Payload)).toBe(
      Buffer.byteLength(JSON.stringify(utf8Payload), "utf8")
    );
  });

  it("ensures standard 650 Pokemon catalog remains well below 500 KB (~202 KB)", () => {
    const payload = generateSimulatedSummaryPayload();

    expect(payload.pokemonList).toHaveLength(649);

    const sizeBytes = calculateSummarySize(payload);
    const sizeKb = sizeBytes / 1024;

    // Verify it stays well below the 500 KB (512,000 bytes) warning threshold
    expect(sizeBytes).toBeLessThan(WARNING_THRESHOLD_BYTES);
    // Verify it is around ~202 KB (+/- 20 KB margin)
    expect(sizeKb).toBeGreaterThan(180);
    expect(sizeKb).toBeLessThan(230);

    const validation = validateSummaryThresholds(sizeBytes);
    expect(validation.valid).toBe(true);
    expect(validation.isWarning).toBe(false);
  });

  it("triggers error when payload exceeds 800 KB (e.g. accidental moves and descriptions)", () => {
    // Threshold unit check
    const overMaxResult = validateSummaryThresholds(MAX_THRESHOLD_BYTES + 1);
    expect(overMaxResult.valid).toBe(false);
    expect(overMaxResult.message).toContain(
      "supera la soglia massima consentita"
    );

    // Warning unit check
    const warningResult = validateSummaryThresholds(
      WARNING_THRESHOLD_BYTES + 1
    );
    expect(warningResult.valid).toBe(true);
    expect(warningResult.isWarning).toBe(true);
    expect(warningResult.message).toContain("supera la soglia di allerta");

    // Bloated payload simulation: 650 Pokemon with moves & descriptions
    const basePayload = generateSimulatedSummaryPayload();
    const bloatedSummary = basePayload.pokemonList.map((p) => ({
      ...p,
      description:
        "A very long detailed pokedex entry description describing the habitat, behavior, lifecycle, and history of this Pokemon in various regions.".repeat(
          5
        ),
      moves: Array.from({ length: 40 }, (_, idx) => ({
        name: `Move ${idx + 1}`,
        type: "Normal",
        power: 80,
        accuracy: 100,
        pp: 15,
        level: idx + 1,
      })),
      locations: Array.from({ length: 10 }, (_, idx) => ({
        region: "Kanto",
        area: `Route ${idx + 1}`,
        method: "Walk",
        chance: 20,
      })),
    }));

    const bloatedPayload = {
      pokemonList: bloatedSummary,
      lastUpdated: new Date().toISOString(),
    };

    const bloatedSizeBytes = calculateSummarySize(bloatedPayload);
    expect(bloatedSizeBytes).toBeGreaterThan(MAX_THRESHOLD_BYTES);

    const bloatedValidation = validateSummaryThresholds(bloatedSizeBytes);
    expect(bloatedValidation.valid).toBe(false);
    expect(bloatedValidation.isWarning).toBe(true);
  });
});
