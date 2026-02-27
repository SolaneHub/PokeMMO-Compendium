import {
  collection,
  deleteField,
  doc,
  getCountFromServer,
  getDocs,
  query,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { updateBossFightsCollection } from "@/firebase/services/bossFightsService";
import { updateTrainerRerun } from "@/firebase/services/trainerRerunService";
import { BossFight } from "@/types/bossFights";
import { Pokemon } from "@/types/pokemon";
import { TrainerRerunData } from "@/types/trainerRerun";

/**
 * Verifies the number of Pokedex documents in Firestore.
 */
export async function verifyPokedexMigration() {
  try {
    const coll = collection(db, "pokedex");
    const snapshot = await getCountFromServer(coll);
    const serverCount = snapshot.data().count;
    alert(`✅ Verifica completata!\nFirestore: ${serverCount} documenti.`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    alert(`Errore verifica: ${message}`);
  }
}

/**
 * Removes 'sprite' and 'background' fields from all Pokedex entries.
 */
export async function cleanupPokedexImages() {
  if (
    !window.confirm(
      "Sei sicuro di voler eliminare i riferimenti alle immagini dal database? Questa operazione è irreversibile."
    )
  ) {
    return;
  }

  try {
    const pokedexRef = collection(db, "pokedex");
    const q = query(pokedexRef);
    const querySnapshot = await getDocs(q);

    const batchSize = 450;
    const docs = querySnapshot.docs;
    let totalCleaned = 0;

    for (let i = 0; i < docs.length; i += batchSize) {
      const batch = writeBatch(db);
      const chunk = docs.slice(i, i + batchSize);

      chunk.forEach((document) => {
        const docRef = doc(db, "pokedex", document.id);
        batch.update(docRef, {
          sprite: deleteField(),
          background: deleteField(),
        });
        totalCleaned++;
      });

      await batch.commit();
    }

    alert(
      `✅ Pulizia completata! Rimosse immagini da ${totalCleaned} Pokémon.`
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    alert(`Errore durante la pulizia: ${message}`);
  }
}

/**
 * Migrates Boss Fights data to Firestore.
 */
export async function migrateBossFightsToFirestore(
  bossFightsData: BossFight[]
) {
  if (!bossFightsData || bossFightsData.length === 0) {
    alert("Nessun dato Boss Fight fornito.");
    return;
  }

  if (!window.confirm("Migrare i Boss Fights su Firestore?")) return;

  try {
    await updateBossFightsCollection(bossFightsData);
    alert("Boss Fights migrati con successo!");
  } catch (error: unknown) {
    alert(`Errore migrazione Boss Fights: ${error}`);
  }
}

/**
 * Migrates Trainer Rerun data to Firestore.
 */
export async function migrateTrainerRerunToFirestore(data: TrainerRerunData) {
  if (!data) return;
  if (!window.confirm("Migrare Trainer Rerun su Firestore?")) return;

  try {
    await updateTrainerRerun(data);
    alert("Trainer Rerun migrato con successo!");
  } catch (error: unknown) {
    alert(`Errore migrazione Trainer Rerun: ${error}`);
  }
}

/**
 * Migrates Pokedex data to Firestore.
 *
 * @param {Pokemon[]} sourcePokedexData - The array of Pokemon objects to migrate.
 */
export async function migratePokedexToFirestore(sourcePokedexData: Pokemon[]) {
  if (!sourcePokedexData || sourcePokedexData.length === 0) {
    alert("Nessun dato Pokedex fornito per la migrazione.");
    return;
  }

  if (
    !window.confirm(
      "Sei sicuro di voler migrare i dati del Pokedex su Firestore? Questa operazione potrebbe sovrascrivere i dati esistenti."
    )
  ) {
    return;
  }

  const batchSize = 450;
  let totalMigrated = 0;
  const chunks: Pokemon[][] = [];

  for (let i = 0; i < sourcePokedexData.length; i += batchSize) {
    chunks.push(sourcePokedexData.slice(i, i + batchSize));
  }

  try {
    for (const chunk of chunks) {
      const batch = writeBatch(db);
      let chunkMigrated = 0;

      chunk.forEach((pokemon) => {
        if (pokemon.id) {
          const docRef = doc(db, "pokedex", pokemon.id.toString());
          const cleanPokemon = JSON.parse(JSON.stringify(pokemon));
          batch.set(docRef, cleanPokemon);
          chunkMigrated++;
        }
      });

      await batch.commit();
      totalMigrated += chunkMigrated;
    }

    alert(
      `Migrazione completata! ${totalMigrated} Pokémon aggiunti al database.`
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    alert(`Errore durante la migrazione: ${message}`);
  }
}
