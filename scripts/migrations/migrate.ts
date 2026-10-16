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
import {
  BOSS_FIGHTS_COLLECTION,
  commitBatchInChunks,
  POKEDEX_COLLECTION,
} from "../../src/firebase/services/common";
import { updateTrainerRerun } from "../../src/firebase/services/trainerRerunService";
import { BossFight } from "../../src/types/bossFights";
import { Pokemon } from "../../src/types/pokemon";
import { TrainerRerunData } from "../../src/types/trainerRerun";

/**
 * Verifies the number of Pokedex documents in Firestore.
 */
export async function verifyPokedexMigration() {
  try {
    const coll = collection(db, POKEDEX_COLLECTION);
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
    const pokedexRef = collection(db, POKEDEX_COLLECTION);
    const q = query(pokedexRef);
    const querySnapshot = await getDocs(q);

    const batchSize = 450;
    const docs = querySnapshot.docs;
    let totalCleaned = 0;

    await commitBatchInChunks(docs, batchSize, (batch, document) => {
      const docRef = doc(db, POKEDEX_COLLECTION, document.id);
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

  const batchSize = 450;
  let totalMigrated = 0;

  try {
    await commitBatchInChunks(bossFightsData, batchSize, (batch, bossFight) => {
      if (bossFight.name && bossFight.region) {
        const docId = `${bossFight.region}-${bossFight.name}`.toLowerCase();
        const docRef = doc(db, BOSS_FIGHTS_COLLECTION, docId);
        const cleanBossFight = structuredClone(bossFight);
        batch.set(docRef, cleanBossFight);
        totalMigrated++;
      }
    });

    console.log(
      `Boss Fights migrati con successo! ${totalMigrated} boss fight aggiunti al database.`
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Errore migrazione Boss Fights: ${message}`);
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
          const docRef = doc(db, POKEDEX_COLLECTION, pokemon.id.toString());
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
