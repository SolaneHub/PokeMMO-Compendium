/* eslint-disable no-console */
import { standardPokemonList } from "../src/constants/standardPokemonList";

export const WARNING_THRESHOLD_BYTES = 512_000; // 500 KB (512.000 byte)
export const MAX_THRESHOLD_BYTES = 819_200; // 800 KB (819.200 byte)

export interface PokedexSummaryItem {
  id: string | null;
  name: string;
  types: string[];
  dexId: string | null;
  catchRate: number | null;
  baseStats: {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
  abilities: { main: string[]; hidden: string | null };
  heldItems: string;
  eggGroups: string[];
  evolutions: { name: string }[];
  moves: unknown[];
  locations: unknown[];
}

export interface PokedexSummaryPayload {
  pokemonList: PokedexSummaryItem[];
  lastUpdated: string;
}

/**
 * Generates a simulated payload of 650 Pokémon with the exact structure
 * defined in src/firebase/services/pokedexService.ts:134-161 (including emptied moves and locations).
 */
export const generateSimulatedSummaryPayload = (
  customList: readonly string[] = standardPokemonList
): PokedexSummaryPayload => {
  const summary: PokedexSummaryItem[] = customList.map((name, index) => ({
    id: String(index + 1),
    name,
    types: ["Normal"],
    dexId: String(index + 1).padStart(3, "0"),
    catchRate: 45,
    baseStats: {
      hp: 50,
      atk: 50,
      def: 50,
      spa: 50,
      spd: 50,
      spe: 50,
    },
    abilities: { main: ["Ability 1", "Ability 2"], hidden: "Hidden Ability" },
    heldItems: "None",
    eggGroups: ["Field"],
    evolutions: [{ name: "EvoPokemon" }],
    moves: [],
    locations: [],
  }));

  return {
    pokemonList: summary,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Calculates the exact UTF-8 byte length of a JSON payload.
 */
export const calculateSummarySize = (payload: unknown): number => {
  return Buffer.byteLength(JSON.stringify(payload), "utf8");
};

export interface SummaryThresholdResult {
  valid: boolean;
  isWarning: boolean;
  sizeBytes: number;
  sizeKb: number;
  message: string;
}

/**
 * Validates the summary size against warning (500 KB) and max error (800 KB) thresholds.
 */
export const validateSummaryThresholds = (
  sizeBytes: number
): SummaryThresholdResult => {
  const sizeKb = Number((sizeBytes / 1024).toFixed(2));

  if (sizeBytes > MAX_THRESHOLD_BYTES) {
    return {
      valid: false,
      isWarning: true,
      sizeBytes,
      sizeKb,
      message: `Dimensione (${sizeKb} KB / ${sizeBytes} byte) supera la soglia massima consentita di 800 KB (${MAX_THRESHOLD_BYTES} byte).`,
    };
  }

  if (sizeBytes > WARNING_THRESHOLD_BYTES) {
    return {
      valid: true,
      isWarning: true,
      sizeBytes,
      sizeKb,
      message: `Dimensione (${sizeKb} KB / ${sizeBytes} byte) supera la soglia di allerta di 500 KB (${WARNING_THRESHOLD_BYTES} byte).`,
    };
  }

  return {
    valid: true,
    isWarning: false,
    sizeBytes,
    sizeKb,
    message: `Dimensione (${sizeKb} KB / ${sizeBytes} byte) entro le soglie di sicurezza (< 500 KB).`,
  };
};

// CLI Entrypoint
if (
  process.argv[1]?.replace(/\\/g, "/").endsWith("checkPokedexSummarySize.ts")
) {
  const payload = generateSimulatedSummaryPayload();
  const sizeBytes = calculateSummarySize(payload);
  const sizeKb = (sizeBytes / 1024).toFixed(2);

  console.log(
    `Dimensione stimata pokedex:_summary: ${sizeKb} KB (${sizeBytes} byte)`
  );

  const validation = validateSummaryThresholds(sizeBytes);
  if (!validation.valid) {
    console.error(`❌ ERRORE: ${validation.message}`);
    process.exit(1);
  } else {
    if (validation.isWarning) {
      console.warn(`⚠️ ATTENZIONE: ${validation.message}`);
    } else {
      console.log(`✅ CONFERMA: ${validation.message}`);
    }
    process.exit(0);
  }
}
