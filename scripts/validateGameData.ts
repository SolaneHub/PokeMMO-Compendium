/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  BALL_TYPES,
  STATUS_CONDITIONS,
} from "../src/constants/calculatorConstants";
import { pickupPokemonBuilds } from "../src/constants/pickupBuilds";
import { standardPokemonList } from "../src/constants/standardPokemonList";
import { PokemonTypeSchema } from "../src/types/pokemon";
import { eliteFourMembers } from "../src/utils/eliteFourMembers";
import { Feature, FEATURE_CONFIG } from "../src/utils/featureConfig";
import { getSpriteUrlByName } from "../src/utils/pokemonImageHelper";
import { moveTypeMap } from "../src/utils/pokemonMoveColors";
import { pokemonRegions } from "../src/utils/regionData";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

export interface ValidationError {
  source: string;
  message: string;
}

export interface ValidateGameDataOptions {
  checkFileExists?: (relPath: string) => boolean;
  featureConfig?: Record<string, Feature>;
  ballTypes?: { name: string; multiplier: number }[];
  statusConditions?: { name: string; multiplier: number; gradient: string }[];
  pokemonList?: string[];
}

const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

export function validateGameDataRecords(
  options?: ValidateGameDataOptions
): ValidationError[] {
  const errors: ValidationError[] = [];

  function addError(source: string, message: string) {
    errors.push({ source, message });
  }

  function validateStringField(
    val: unknown,
    fieldName: string,
    source: string
  ): boolean {
    if (typeof val !== "string" || val.trim().length === 0) {
      addError(
        source,
        `Field '${fieldName}' must be a non-empty string, got: ${JSON.stringify(val)}`
      );
      return false;
    }
    return true;
  }

  // 1. Validazione Regioni
  const regionIds = new Set<string>();
  const regionNames = new Set<string>();
  for (const region of pokemonRegions) {
    const src = `pokemonRegions[${region.id || "unknown"}]`;
    if (validateStringField(region.id, "id", src)) {
      if (regionIds.has(region.id)) {
        addError(src, `Duplicate region ID detected: '${region.id}'`);
      }
      regionIds.add(region.id);
    }
    if (validateStringField(region.name, "name", src)) {
      if (regionNames.has(region.name)) {
        addError(src, `Duplicate region name detected: '${region.name}'`);
      }
      regionNames.add(region.name);
    }
    validateStringField(region.bgColor, "bgColor", src);
  }

  // 2. Validazione Membri Superquattro (Elite Four)
  for (const member of eliteFourMembers) {
    const src = `eliteFourMembers[${member.region} - ${member.name}]`;
    validateStringField(member.name, "name", src);
    validateStringField(member.region, "region", src);
    validateStringField(member.type, "type", src);
    if (validateStringField(member.image, "image", src)) {
      const exists = options?.checkFileExists
        ? options.checkFileExists(member.image)
        : fs.existsSync(path.join(rootDir, "public", "trainers", member.image));
      if (!exists) {
        addError(
          src,
          `Trainer image file does not exist in public/trainers/: '${member.image}'`
        );
      }
    }
  }

  // 3. Validazione moveTypeMap (Costante mosse)
  for (const [moveName, moveType] of Object.entries(moveTypeMap)) {
    const src = `moveTypeMap[${moveName}]`;
    validateStringField(moveName, "moveName", src);
    validateStringField(moveType, "moveType", src);

    const typeResult = PokemonTypeSchema.safeParse(moveType);
    if (!typeResult.success || moveType === "" || moveType === "Various") {
      addError(
        src,
        `Move type '${moveType}' for move '${moveName}' is not a valid PokemonType.`
      );
    }
  }

  // 4. Validazione pickupPokemonBuilds
  const pickupPokemonNames = new Set<string>();
  for (const build of pickupPokemonBuilds) {
    const src = `pickupPokemonBuilds[${build.name}]`;
    if (validateStringField(build.name, "name", src)) {
      if (pickupPokemonNames.has(build.name)) {
        addError(
          src,
          `Duplicate Pokemon build in pickupPokemonBuilds: '${build.name}'`
        );
      }
      pickupPokemonNames.add(build.name);

      const sprite = getSpriteUrlByName(build.name);
      if (!sprite) {
        addError(
          src,
          `Pokemon name '${build.name}' does not map to a valid sprite URL in pokemonImageHelper.`
        );
      }
    }

    if (build.moves) {
      if (!Array.isArray(build.moves)) {
        addError(src, `Field 'moves' must be an array`);
      } else {
        for (const move of build.moves) {
          validateStringField(move, "move", src);
        }
      }
    }
  }

  // 5. Validazione FEATURE_CONFIG
  const targetFeatureConfig = options?.featureConfig ?? FEATURE_CONFIG;
  for (const [key, feature] of Object.entries(targetFeatureConfig)) {
    const src = `FEATURE_CONFIG[${key}]`;
    validateStringField(feature.title, "title", src);
    validateStringField(feature.description, "description", src);

    if (validateStringField(feature.link, "link", src)) {
      if (!feature.link.startsWith("/")) {
        addError(
          src,
          `Field 'link' must start with '/', got: '${feature.link}'`
        );
      }
    }

    if (validateStringField(feature.color, "color", src)) {
      if (!HEX_COLOR_REGEX.test(feature.color)) {
        addError(
          src,
          `Field 'color' must be a valid 6-character hex string (#RRGGBB), got: '${feature.color}'`
        );
      }
    }

    if (feature.icon === null || feature.icon === undefined) {
      addError(
        src,
        `Field 'icon' must be defined, got: ${String(feature.icon)}`
      );
    }
  }

  // 6. Validazione BALL_TYPES & STATUS_CONDITIONS
  const targetBallTypes = options?.ballTypes ?? BALL_TYPES;
  for (const ball of targetBallTypes) {
    const src = `BALL_TYPES[${ball.name || "unknown"}]`;
    validateStringField(ball.name, "name", src);
    if (
      typeof ball.multiplier !== "number" ||
      Number.isNaN(ball.multiplier) ||
      ball.multiplier < 1
    ) {
      addError(
        src,
        `Field 'multiplier' must be a number >= 1, got: ${ball.multiplier}`
      );
    }
  }

  const targetStatusConditions = options?.statusConditions ?? STATUS_CONDITIONS;
  for (const status of targetStatusConditions) {
    const src = `STATUS_CONDITIONS[${status.name || "unknown"}]`;
    validateStringField(status.name, "name", src);
    if (
      typeof status.multiplier !== "number" ||
      Number.isNaN(status.multiplier) ||
      status.multiplier < 1
    ) {
      addError(
        src,
        `Field 'multiplier' must be a number >= 1, got: ${status.multiplier}`
      );
    }
    validateStringField(status.gradient, "gradient", src);
  }

  // 7. Validazione standardPokemonList
  const targetPokemonList = options?.pokemonList ?? standardPokemonList;
  const listSrc = "standardPokemonList";
  if (!Array.isArray(targetPokemonList) || targetPokemonList.length < 600) {
    addError(
      listSrc,
      `standardPokemonList must be an array with at least 600 elements, got: ${
        Array.isArray(targetPokemonList)
          ? targetPokemonList.length
          : typeof targetPokemonList
      }`
    );
  } else {
    const uniquePokemon = new Set(targetPokemonList);
    if (uniquePokemon.size !== targetPokemonList.length) {
      addError(
        listSrc,
        `standardPokemonList contains duplicate entries (total: ${targetPokemonList.length}, unique: ${uniquePokemon.size})`
      );
    }

    for (const name of targetPokemonList) {
      validateStringField(name, "pokemon", listSrc);
    }
  }

  return errors;
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("validateGameData.ts")) {
  console.log("🔍 Avvio validazione programmaticità dati di gioco...\n");
  console.log("➡️ Validazione pokemonRegions...");
  console.log("➡️ Validazione eliteFourMembers...");
  console.log("➡️ Validazione moveTypeMap...");
  console.log("➡️ Validazione pickupPokemonBuilds...");
  console.log("➡️ Validazione FEATURE_CONFIG...");
  console.log("➡️ Validazione BALL_TYPES & STATUS_CONDITIONS...");
  console.log("➡️ Validazione standardPokemonList...");

  const errors = validateGameDataRecords();

  console.log("\n========================================");
  console.log("📊 REPORT VALIDAZIONE INTEGRITÀ DATI");
  console.log("========================================");

  if (errors.length > 0) {
    console.error(`❌ Trovati ${errors.length} errori di integrità:`);
    for (const err of errors) {
      console.error(`  - [${err.source}] ${err.message}`);
    }
    console.error(`\n❌ Validazione FALLITA.`);
    process.exit(1);
  } else {
    console.log(
      "✨ Integrità referenziale dei dati di gioco verificata con successo.\n"
    );
    process.exit(0);
  }
}
