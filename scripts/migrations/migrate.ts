/* eslint-disable no-console */
import {
  collection,
  deleteField,
  doc,
  getCountFromServer,
  getDocs,
  query,
} from "firebase/firestore/lite";

import { db } from "../../src/firebase/config";
import { commitBatchInChunks } from "../../src/firebase/services/common";
import { updateBossFightsCollection } from "../../src/pages/boss-fights/services/bossFightsService";
import { BossFight } from "../../src/pages/boss-fights/types/bossFights";
import { updateTrainerRerun } from "../../src/pages/trainer-rerun/services/trainerRerunService";
import { TrainerRerunData } from "../../src/pages/trainer-rerun/types/trainerRerun";
import { Pokemon } from "../../src/types/pokemon";

/**
 * Verifies the number of Pokedex documents in Firestore.
 */
export async function verifyPokedexMigration() {
  try {
    const coll = collection(db, "pokedex");
    const snapshot = await getCountFromServer(coll);
    const serverCount = snapshot.data().count;
    console.log(`✅ Verifica completata! Firestore: ${serverCount} documenti.`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Errore verifica: ${message}`);
  }
}

/**
 * Removes 'sprite' and 'background' fields from all Pokedex entries.
 */
export async function cleanupPokedexImages() {
  try {
    const pokedexRef = collection(db, "pokedex");
    const q = query(pokedexRef);
    const querySnapshot = await getDocs(q);

    const batchSize = 450;
    const docs = querySnapshot.docs;
    let totalCleaned = 0;

    await commitBatchInChunks(docs, batchSize, (batch, document) => {
      const docRef = doc(db, "pokedex", document.id);
      batch.update(docRef, {
        sprite: deleteField(),
        background: deleteField(),
      });
      totalCleaned++;
    });

    console.log(
      `✅ Pulizia completata! Rimosse immagini da ${totalCleaned} Pokémon.`
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Errore durante la pulizia: ${message}`);
  }
}

/**
 * Migrates Boss Fights data to Firestore.
 */
export async function migrateBossFightsToFirestore(
  bossFightsData: BossFight[]
) {
  if (!bossFightsData || bossFightsData.length === 0) {
    console.warn("Nessun dato Boss Fight fornito.");
    return;
  }

  try {
    await updateBossFightsCollection(bossFightsData);
    console.log("Boss Fights migrati con successo!");
  } catch (error: unknown) {
    console.error(`Errore migrazione Boss Fights: ${error}`);
  }
}

/**
 * Migrates Trainer Rerun data to Firestore.
 */
export async function migrateTrainerRerunToFirestore(data: TrainerRerunData) {
  if (!data) return;

  try {
    await updateTrainerRerun(data);
    console.log("Trainer Rerun migrato con successo!");
  } catch (error: unknown) {
    console.error(`Errore migrazione Trainer Rerun: ${error}`);
  }
}

/**
 * Migrates Pokedex data to Firestore.
 *
 * @param {Pokemon[]} sourcePokedexData - The array of Pokemon objects to migrate.
 */
export async function migratePokedexToFirestore(sourcePokedexData: Pokemon[]) {
  if (!sourcePokedexData || sourcePokedexData.length === 0) {
    console.warn("Nessun dato Pokedex fornito per la migrazione.");
    return;
  }

  const batchSize = 450;
  let totalMigrated = 0;

  try {
    await commitBatchInChunks(
      sourcePokedexData,
      batchSize,
      (batch, pokemon) => {
        if (pokemon.id) {
          const docRef = doc(db, "pokedex", pokemon.id.toString());
          const cleanPokemon = structuredClone(pokemon);
          batch.set(docRef, cleanPokemon);
          totalMigrated++;
        }
      }
    );

    console.log(
      `Migrazione completata! ${totalMigrated} Pokémon aggiunti al database.`
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Errore durante la migrazione: ${message}`);
  }
}
