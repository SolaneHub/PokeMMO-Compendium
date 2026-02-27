import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { getPokemonDocId, POKEDEX_COLLECTION } from "@/firebase/services/common";
import { Pokemon } from "@/types/pokemon";

/**
 * Fetches all Pokemon data from the 'pokedex' collection.
 */
export async function getPokedexData(): Promise<Pokemon[]> {
  const pokedexRef = collection(db, POKEDEX_COLLECTION);
  const q = query(pokedexRef);
  const querySnapshot = await getDocs(q);
  const pokedex: Pokemon[] = [];
  querySnapshot.forEach((doc) => {
    pokedex.push({ id: doc.id, ...doc.data() } as Pokemon);
  });
  return pokedex;
}

/**
 * Updates Pokedex data in batch.
 */
export async function updatePokedexData(pokedexArray: Pokemon[]) {
  if (!pokedexArray || pokedexArray.length === 0) {
    return;
  }
  const batch = writeBatch(db);
  pokedexArray.forEach((pokemon) => {
    if (pokemon.id) {
      const docId = getPokemonDocId(pokemon.id);
      const docRef = doc(db, POKEDEX_COLLECTION, docId);
      const cleanPokemon = JSON.parse(JSON.stringify(pokemon));
      batch.set(docRef, cleanPokemon, { merge: true });
    }
  });
  await batch.commit();
}

/**
 * Saves a single Pokedex entry.
 */
export async function savePokedexEntry(pokemon: Pokemon) {
  if (!pokemon.name) throw new Error("Pokemon name is required");
  const docId = pokemon.id
    ? getPokemonDocId(pokemon.id)
    : pokemon.name.toLowerCase();
  const docRef = doc(db, POKEDEX_COLLECTION, docId);
  const cleanPokemon = JSON.parse(JSON.stringify(pokemon));
  await setDoc(docRef, cleanPokemon);
}

/**
 * Updates a single Pokedex entry.
 */
export async function updatePokedexEntry(
  id: string | number,
  updates: Partial<Pokemon>
) {
  const docId = getPokemonDocId(id);
  const docRef = doc(db, POKEDEX_COLLECTION, docId);
  await updateDoc(docRef, updates as DocumentData);
}

/**
 * Deletes a Pokedex entry.
 */
export async function deletePokedexEntry(id: string | number) {
  const docId = getPokemonDocId(id);
  const docRef = doc(db, POKEDEX_COLLECTION, docId);
  await deleteDoc(docRef);
}
