/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

export function checkFirestoreRulesContent(
  rulesContent: string,
  expectedCollections: string[]
): string[] {
  const errors: string[] = [];
  const addError = (msg: string) => errors.push(msg);

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

  // 3. Estrazione dinamica delle collezioni
  if (expectedCollections.length === 0) {
    addError(
      "Nessuna collezione trovata analizzando src/firebase/services/common.ts"
    );
  }

  // 4. Verifica copertura collezioni nelle regole
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
  const notUpdatingMatch = rulesContent.match(
    /notUpdating\(\s*\[([^\]]+)\]\s*\)/
  );
  if (notUpdatingMatch?.[1]) {
    const fields = notUpdatingMatch[1]
      .split(",")
      .map((f) => f.trim().replace(/['"]/g, ""));
    const requiredFields = [
      "admin",
      "role",
      "permissions",
      "createdAt",
      "banned",
    ];
    const missingFields = requiredFields.filter((f) => !fields.includes(f));
    if (missingFields.length > 0) {
      addError(
        "Campi protetti incompleti in notUpdating: richiesti admin, role, permissions, createdAt, banned"
      );
    }
  } else {
    addError(
      "Campi protetti incompleti in notUpdating: richiesti admin, role, permissions, createdAt, banned"
    );
  }

  if (!rulesContent.includes("!('admin' in request.resource.data)")) {
    addError(
      "Regola create in /users/{userId} non vieta esplicitamente il campo 'admin'"
    );
  }

  // 7. Verifica isolamento in lettura di /users/{userId}
  const usersBlockMatch = rulesContent.match(
    /match\s+\/users\/\{userId\}\s*\{([\s\S]*?)\n\s*\}/
  );
  if (!usersBlockMatch?.[1]) {
    addError("Blocco match /users/{userId} non trovato");
  } else {
    const usersBlock = usersBlockMatch[1];
    if (/allow\s+read\s*:\s*if\s+true\s*;/.test(usersBlock)) {
      addError("Rilevata lettura pubblica non protetta su /users/{userId}");
    }
    if (!usersBlock.includes("allow read: if isOwner(userId) || isAdmin();")) {
      addError(
        "Regola match /users/{userId} non contiene 'allow read: if isOwner(userId) || isAdmin();'"
      );
    }
  }

  // 8. Verifica protezione in scrittura delle collezioni di gioco statiche
  const staticCollections = [
    "pokedex",
    "raids",
    "super_trainers",
    "pickup",
    "boss_fights",
    "trainer_rerun",
    "moves",
  ];

  for (const col of staticCollections) {
    const staticBlockRegex = new RegExp(
      `match\\s+\\/${col}\\/\\{document=\\*\\*\\}\\s*\\{([\\s\\S]*?)\\}`
    );
    const staticMatch = rulesContent.match(staticBlockRegex);
    if (!staticMatch?.[1]) {
      addError(`Blocco match /${col}/{document=**} non trovato`);
    } else {
      const blockContent = staticMatch[1];
      if (!blockContent.includes("allow write: if isAdmin();")) {
        addError(
          `Collezione statica '${col}' non protetta in scrittura con 'allow write: if isAdmin();'`
        );
      }
    }
  }

  return errors;
}

if (process.argv[1]?.endsWith("validateFirestoreRules.ts")) {
  console.log("🔒 Avvio validazione regole Firestore Security Rules...\n");

  const rulesPath = path.join(rootDir, "firestore", "firestore.rules");
  if (!fs.existsSync(rulesPath)) {
    console.error("❌ File firestore/firestore.rules non trovato!");
    process.exit(1);
  }

  const rulesContent = fs.readFileSync(rulesPath, "utf-8");

  // Estrazione dinamica delle collezioni da common.ts
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
    if (match[1]) {
      expectedCollections.push(match[1]);
    }
  }

  console.log(
    `➡️ Verifica copertura di ${expectedCollections.length} collezioni...`
  );

  const errors = checkFirestoreRulesContent(rulesContent, expectedCollections);

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
}
