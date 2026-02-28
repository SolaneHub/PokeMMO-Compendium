import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { MOVES_COLLECTION } from "@/firebase/services/common";
import { getPokedexData } from "@/firebase/services/pokedexService";
import {
  MoveMaster,
  MoveMasterSchema,
  Pokemon,
  PokemonMove,
} from "@/types/pokemon";

/**
 * Fetches all Moves from the master list.
 */
export async function getMoves(): Promise<MoveMaster[]> {
  const movesRef = collection(db, MOVES_COLLECTION);
  const q = query(movesRef, orderBy("name"));
  const querySnapshot = await getDocs(q);
  const moves: MoveMaster[] = [];
  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    const result = MoveMasterSchema.safeParse(data);
    if (result.success) {
      moves.push(result.data);
    } else {
      console.warn(
        `[Zod Validation] Invalid Move data for doc ID: ${doc.id}`,
        result.error
      );
    }
  });
  return moves;
}

/**
 * Saves a Move to the master list.
 */
export async function saveMove(move: MoveMaster) {
  if (!move.name) throw new Error("Move name is required");
  const docId = move.id || move.name.toLowerCase().replace(/\s+/g, "-");
  const docRef = doc(db, MOVES_COLLECTION, docId);
  const { id: _, ...dataToSave } = move;
  await setDoc(docRef, dataToSave);
}

/**
 * Deletes a Move from the master list.
 */
export async function deleteMove(id: string) {
  const docRef = doc(db, MOVES_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Scans the entire Pokedex, extracts unique moves with their details,
 * and saves them to the moves master list.
 */
export async function importMovesFromPokedex() {
  const pokedex = await getPokedexData();
  const movesMap = new Map<string, MoveMaster>();

  pokedex.forEach((pokemon: Pokemon) => {
    if (pokemon.moves) {
      pokemon.moves.forEach((move: PokemonMove) => {
        if (move.name && !movesMap.has(move.name.toLowerCase())) {
          // Create MoveMaster object from the move data in the Pokedex
          const moveMaster: MoveMaster = {
            name: move.name,
            type: move.type || "",
            category: move.category || "",
            power: move.power || "",
            accuracy: move.accuracy || "",
            pp: move.pp || "",
          };
          movesMap.set(move.name.toLowerCase(), moveMaster);
        }
      });
    }
  });

  const batch = writeBatch(db);
  let count = 0;

  movesMap.forEach((move) => {
    const docId = move.name.toLowerCase().replace(/\s+/g, "-");
    const docRef = doc(db, MOVES_COLLECTION, docId);
    const { id: _, ...dataToSave } = move;
    batch.set(docRef, dataToSave, { merge: true });
    count++;
  });

  if (count > 0) {
    await batch.commit();
  }

  return count;
}
