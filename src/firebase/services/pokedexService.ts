import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  setDoc,
  startAfter,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import {
  getPokemonDocId,
  POKEDEX_COLLECTION,
} from "@/firebase/services/common";
import { Pokemon } from "@/types/pokemon";

const POKEDEX_SUMMARY_DOC_ID = "_summary";

/**
 * Fetches all Pokemon data from the 'pokedex' collection.
 */
export async function getPokedexData(): Promise<Pokemon[]> {
  const pokedexRef = collection(db, POKEDEX_COLLECTION);
  const q = query(pokedexRef);
  const querySnapshot = await getDocs(q);
  const pokedex: Pokemon[] = [];
  querySnapshot.forEach((doc) => {
    // Ignore internal metadata documents
    if (doc.id.startsWith("_")) return;
    pokedex.push({ id: doc.id, ...doc.data() } as Pokemon);
  });
  return pokedex;
}

/**
 * Fetches Pokemon data with pagination.
 */
export async function getPokedexPaginated(
  pageSize: number,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{
  data: Pokemon[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}> {
  const pokedexRef = collection(db, POKEDEX_COLLECTION);
  let q = query(pokedexRef, orderBy("dexId"), limit(pageSize));

  if (lastDoc) {
    q = query(
      pokedexRef,
      orderBy("dexId"),
      startAfter(lastDoc),
      limit(pageSize)
    );
  }

  const querySnapshot = await getDocs(q);
  const pokedex: Pokemon[] = [];
  querySnapshot.forEach((doc) => {
    // Ignore internal metadata documents
    if (doc.id.startsWith("_")) return;
    pokedex.push({ id: doc.id, ...doc.data() } as Pokemon);
  });

  return {
    data: pokedex,
    lastDoc:
      querySnapshot.docs.length > 0
        ? querySnapshot.docs[querySnapshot.docs.length - 1]
        : null,
  };
}

/**
 * Fetches the lightweight Pokedex summary.
 */
export async function getPokedexSummary(): Promise<Pokemon[]> {
  const summaryRef = doc(db, POKEDEX_COLLECTION, POKEDEX_SUMMARY_DOC_ID);
  const summaryDoc = await getDoc(summaryRef);

  if (summaryDoc.exists()) {
    return summaryDoc.data().pokemonList as Pokemon[];
  }

  // Fallback: Fetch everything and generate summary if it doesn't exist
  // This is a one-time operation for the first user
  const fullData = await getPokedexData();
  const summary = fullData.map((p) => ({
    id: p.id || null,
    name: p.name || "",
    types: p.types || [],
    dexId: p.dexId ?? null,
    catchRate: p.catchRate ?? null,
    baseStats: p.baseStats || null,
    abilities: p.abilities || null,
    heldItems: p.heldItems || null,
    eggGroups: p.eggGroups || null,
    // Add evolutions names for links
    evolutions: p.evolutions?.map((e) => ({ name: e.name })) || [],
  })) as Pokemon[];

  // Try to save summary for next time (might fail if not admin, but that's okay)
  try {
    await setDoc(summaryRef, {
      pokemonList: summary,
      lastUpdated: new Date().toISOString(),
    });
  } catch (e) {
    console.warn(
      "Failed to save pokedex summary metadata (ignore if not admin):",
      e
    );
  }

  return summary;
}

/**
 * Fetches a single Pokemon by ID.
 */
export async function getPokemonById(
  id: string | number
): Promise<Pokemon | null> {
  const docId = getPokemonDocId(id);
  const docRef = doc(db, POKEDEX_COLLECTION, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Pokemon;
  }
  return null;
}

/**
 * Updates the Pokedex summary metadata.
 */
export async function updatePokedexSummary(pokemonList: Pokemon[]) {
  const summary = pokemonList.map((p) => ({
    id: p.id || null,
    name: p.name || "",
    types: p.types || [],
    dexId: p.dexId ?? null,
    catchRate: p.catchRate ?? null,
    baseStats: p.baseStats || null,
    abilities: p.abilities || null,
    heldItems: p.heldItems || null,
    eggGroups: p.eggGroups || null,
    evolutions: p.evolutions?.map((e) => ({ name: e.name })) || [],
  }));

  const summaryRef = doc(db, POKEDEX_COLLECTION, POKEDEX_SUMMARY_DOC_ID);
  await setDoc(summaryRef, {
    pokemonList: summary,
    lastUpdated: new Date().toISOString(),
  });
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
