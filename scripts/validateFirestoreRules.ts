/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const errors: string[] = [];

function addError(msg: string) {
  errors.push(msg);
}

console.log("🔒 Avvio validazione regole Firestore Security Rules...\n");

const rulesPath = path.join(rootDir, "firestore", "firestore.rules");
if (!fs.existsSync(rulesPath)) {
  console.error("❌ File firestore/firestore.rules non trovato!");
  process.exit(1);
}

const rulesContent = fs.readFileSync(rulesPath, "utf-8");

// 1. Validazione Header e Sintassi di base
if (!rulesContent.includes("rules_version = '2';")) {
  addError("Manca l'header obbligatorio: rules_version = '2';");
}
if (!rulesContent.includes("service cloud.firestore")) {
  addError("Manca la dichiarazione: service cloud.firestore");
}

// 2. Bilanciamento parentesi graffe
const openBraces = (rulesContent.match(/\{/g) || []).length;
const closeBraces = (rulesContent.match(/\}/g) || []).length;
if (openBraces !== closeBraces) {
  addError(
    `Parentesi graffe sbilanciate: aperte ${openBraces}, chiuse ${closeBraces}`
  );
}

// 3. Estrazione dinamica delle collezioni da common.ts
const commonPath = path.join(
  rootDir,
  "src",
  "firebase",
  "services",
  "common.ts"
);
const commonContent = fs.readFileSync(commonPath, "utf-8");
const collectionRegex = /export const [A-Z0-9_]+_COLLECTION = "([^"]+)";/g;
const expectedCollections: string[] = [];
let match: RegExpExecArray | null;
while ((match = collectionRegex.exec(commonContent)) !== null) {
  expectedCollections.push(match[1]);
}

if (expectedCollections.length === 0) {
  addError(
    "Nessuna collezione trovata analizzando src/firebase/services/common.ts"
  );
}

// 4. Verifica copertura collezioni nelle regole
console.log(
  `➡️ Verifica copertura di ${expectedCollections.length} collezioni...`
);
for (const col of expectedCollections) {
  const colRegex = new RegExp(`match\\s+.*\\b${col}\\b`);
  if (!colRegex.test(rulesContent)) {
    addError(
      `Collezione '${col}' non coperta da alcuna regola match in firestore.rules`
    );
  }
}

// 5. Verifica assenza scritture pubbliche non protette
const openWriteRegex =
  /allow\s+(write|create|update|delete)\s*:\s*if\s+true\s*;/;
if (openWriteRegex.test(rulesContent)) {
  addError(
    "Trovata regola con scrittura pubblica incondizionata (allow write/create/update/delete: if true;)"
  );
}

// 6. Verifica protezione campi sensibili utenti
if (
  !rulesContent.includes(
    "['admin', 'role', 'permissions', 'createdAt', 'banned']"
  )
) {
  addError(
    "Regola match /users/{userId} non contiene la lista completa di campi protetti notUpdating(...)"
  );
}
if (!rulesContent.includes("!('admin' in request.resource.data)")) {
  addError(
    "Regola create in /users/{userId} non vieta esplicitamente il campo 'admin'"
  );
}

// Report Finale
console.log("========================================");
console.log("📊 REPORT SICUREZZA FIRESTORE RULES");
console.log("========================================");

if (errors.length > 0) {
  console.error(`❌ Trovati ${errors.length} errori nelle regole Firestore:`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  console.error("\n❌ Validazione regole FALLITA.");
  process.exit(1);
} else {
  console.log(
    `✅ Header, sintassi e ${expectedCollections.length} collezioni verificate.`
  );
  console.log("✨ Regole Firestore conformi agli standard di sicurezza.\n");
  process.exit(0);
}
