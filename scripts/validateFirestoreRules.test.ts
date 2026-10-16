import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { checkFirestoreRulesContent } from "./validateFirestoreRules";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const realRules = fs.readFileSync(
  path.join(rootDir, "firestore", "firestore.rules"),
  "utf-8"
);

const EXPECTED_COLLECTIONS = [
  "users",
  "elite_four_teams",
  "pokedex",
  "super_trainers",
  "pickup",
  "boss_fights",
  "trainer_rerun",
  "moves",
  "raids",
];

describe("checkFirestoreRulesContent", () => {
  it("restituisce 0 errori fornendo il contenuto reale di firestore/firestore.rules e le 9 collezioni di common.ts", () => {
    const errors = checkFirestoreRulesContent(realRules, EXPECTED_COLLECTIONS);
    expect(errors).toEqual([]);
  });

  it("rileva l'assenza di rules_version = '2';", () => {
    const invalidRules = realRules.replace("rules_version = '2';", "");
    const errors = checkFirestoreRulesContent(
      invalidRules,
      EXPECTED_COLLECTIONS
    );
    expect(errors).toContain(
      "Manca l'header obbligatorio: rules_version = '2';"
    );
  });

  it("rileva parentesi graffe sbilanciate", () => {
    const invalidRules = realRules + "\n}";
    const errors = checkFirestoreRulesContent(
      invalidRules,
      EXPECTED_COLLECTIONS
    );
    expect(
      errors.some((err) => err.includes("Parentesi graffe sbilanciate"))
    ).toBe(true);
  });

  it("rileva la mancata copertura di una collezione attesa", () => {
    const errors = checkFirestoreRulesContent(realRules, [
      ...EXPECTED_COLLECTIONS,
      "uncovered_collection",
    ]);
    expect(errors).toContain(
      "Collezione 'uncovered_collection' non coperta da alcuna regola match in firestore.rules"
    );
  });

  it("rileva una scrittura pubblica incondizionata (allow write: if true;)", () => {
    const invalidRules = realRules.replace(
      "allow write: if isAdmin();",
      "allow write: if true;"
    );
    const errors = checkFirestoreRulesContent(
      invalidRules,
      EXPECTED_COLLECTIONS
    );
    expect(errors).toContain(
      "Trovata regola con scrittura pubblica incondizionata (allow write/create/update/delete: if true;)"
    );
  });

  it("rileva campi mancanti nella funzione notUpdating (es. rimozione di 'admin' o 'banned')", () => {
    const invalidRules = realRules.replace("'banned'", "'otherField'");
    const errors = checkFirestoreRulesContent(
      invalidRules,
      EXPECTED_COLLECTIONS
    );
    expect(errors).toContain(
      "Campi protetti incompleti in notUpdating: richiesti admin, role, permissions, createdAt, banned"
    );
  });

  it("rileva lettura pubblica incondizionata su /users/{userId}", () => {
    const invalidRules = realRules.replace(
      "allow read: if isOwner(userId) || isAdmin();",
      "allow read: if true;"
    );
    const errors = checkFirestoreRulesContent(
      invalidRules,
      EXPECTED_COLLECTIONS
    );
    expect(errors).toContain(
      "Rilevata lettura pubblica non protetta su /users/{userId}"
    );
  });
});
