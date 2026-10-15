/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { pickupPokemonBuilds } from "../src/constants/pickupBuilds";
import { eliteFourMembers } from "../src/utils/eliteFourMembers";
import { getSpriteUrlByName } from "../src/utils/pokemonImageHelper";
import { moveTypeMap } from "../src/utils/pokemonMoveColors";
import { pokemonRegions } from "../src/utils/regionData";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

interface ValidationError {
  source: string;
  message: string;
}

const errors: ValidationError[] = [];
let totalRecordsValidated = 0;

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

console.log("🔍 Avvio validazione programmaticità dati di gioco...\n");

// 1. Validazione Regioni
console.log("➡️ Validazione pokemonRegions...");
const regionIds = new Set<string>();
const regionNames = new Set<string>();
for (const region of pokemonRegions) {
  totalRecordsValidated++;
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
console.log("➡️ Validazione eliteFourMembers...");
for (const member of eliteFourMembers) {
  totalRecordsValidated++;
  const src = `eliteFourMembers[${member.region} - ${member.name}]`;
  validateStringField(member.name, "name", src);
  validateStringField(member.region, "region", src);
  validateStringField(member.type, "type", src);
  if (validateStringField(member.image, "image", src)) {
    const imagePath = path.join(rootDir, "public", "trainers", member.image);
    if (!fs.existsSync(imagePath)) {
      addError(
        src,
        `Trainer image file does not exist in public/trainers/: '${member.image}'`
      );
    }
  }
}

// 3. Validazione moveTypeMap (Costante mosse)
console.log("➡️ Validazione moveTypeMap...");
for (const [moveName, moveType] of Object.entries(moveTypeMap)) {
  totalRecordsValidated++;
  const src = `moveTypeMap[${moveName}]`;
  validateStringField(moveName, "moveName", src);
  validateStringField(moveType, "moveType", src);
}

// 4. Validazione pickupPokemonBuilds
console.log("➡️ Validazione pickupPokemonBuilds...");
const pickupPokemonNames = new Set<string>();
for (const build of pickupPokemonBuilds) {
  totalRecordsValidated++;
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

// 5. Validazione file JSON (se presenti in data/ o src/data/)
const jsonFolders = [
  path.join(rootDir, "src", "data"),
  path.join(rootDir, "data"),
];

for (const folder of jsonFolders) {
  if (fs.existsSync(folder)) {
    const files = fs.readdirSync(folder).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const filePath = path.join(folder, file);
      console.log(`➡️ Validazione file JSON: ${file}...`);
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(content);

        // Se è boss-fights o super-trainers o raids
        if (Array.isArray(parsed)) {
          const itemIds = new Set<string>();
          for (const item of parsed) {
            totalRecordsValidated++;
            const src = `${file}[${item.name || "unnamed"}]`;
            if (item.name) {
              validateStringField(item.name, "name", src);
              const compositeId =
                `${item.region || ""}-${item.name}`.toLowerCase();
              if (itemIds.has(compositeId)) {
                addError(
                  src,
                  `Duplicate identifier in ${file}: '${compositeId}'`
                );
              }
              itemIds.add(compositeId);
            }

            // Verifica strategie e pokemonNames
            if (item.teams && typeof item.teams === "object") {
              const teamsObj = item.teams as Record<
                string,
                {
                  pokemonNames?: unknown[];
                  pokemonStrategies?: Record<string, unknown>;
                }
              >;
              for (const [teamName, teamData] of Object.entries(teamsObj)) {
                totalRecordsValidated++;
                const teamSrc = `${src}.teams[${teamName}]`;
                const pokemonNames: unknown[] = teamData.pokemonNames || [];
                const pokemonStrategies: Record<string, unknown> =
                  teamData.pokemonStrategies || {};

                // Verifica che tutti i pokemonNames siano validi
                for (const pName of pokemonNames) {
                  validateStringField(pName, "pokemonName", teamSrc);
                }

                // Verifica chiavi di strategia orfane
                for (const strategyPokemon of Object.keys(pokemonStrategies)) {
                  if (
                    pokemonNames.length > 0 &&
                    !pokemonNames.includes(strategyPokemon)
                  ) {
                    addError(
                      teamSrc,
                      `Orphan strategy key found for '${strategyPokemon}' which is not in pokemonNames`
                    );
                  }
                }
              }
            }

            // Verifica raid teamStrategies e moves
            if (Array.isArray(item.moves)) {
              for (const move of item.moves) {
                validateStringField(move, "move", src);
              }
            }
            if (Array.isArray(item.teamStrategies)) {
              const strategyIds = new Set<string>();
              for (const strat of item.teamStrategies) {
                totalRecordsValidated++;
                const stratSrc = `${src}.strategy[${strat.id || strat.label || "unknown"}]`;
                if (strat.id) {
                  if (strategyIds.has(strat.id)) {
                    addError(
                      stratSrc,
                      `Duplicate strategy ID '${strat.id}' in ${file}`
                    );
                  }
                  strategyIds.add(strat.id);
                }
              }
            }
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        addError(file, `Malformed JSON file: ${msg}`);
      }
    }
  }
}

// Output report
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
  console.log(`✅ ${totalRecordsValidated} record validati, 0 errori.`);
  console.log(
    "✨ Integrità referenziale dei dati di gioco verificata con successo.\n"
  );
  process.exit(0);
}
