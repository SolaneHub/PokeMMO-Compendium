import {
  collection,
  doc,
  getDoc,
  getDocs,
  type Query,
  query,
  type QueryDocumentSnapshot,
  WriteBatch,
  writeBatch,
} from "firebase/firestore/lite";
import { z } from "zod";

import { db } from "@/firebase/config";

// --- Collection References ---
export const USERS_COLLECTION = "users";
export const TEAMS_COLLECTION = "elite_four_teams";
export const POKEDEX_COLLECTION = "pokedex";
export const SUPER_TRAINERS_COLLECTION = "super_trainers";
export const PICKUP_COLLECTION = "pickup";
export const BOSS_FIGHTS_COLLECTION = "boss_fights";
export const TRAINER_RERUN_COLLECTION = "trainer_rerun";
export const MOVES_COLLECTION = "moves";
export const RAIDS_COLLECTION = "raids";

/**
 * Executes Firestore batch operations in chunks (default 400) to respect Firestore's 500 writes limit.
 */
export async function commitBatchInChunks<T>(
  items: T[],
  chunkSize = 400,
  operation: (batch: WriteBatch, item: T) => void
): Promise<void> {
  for (let i = 0; i < items.length; i += chunkSize) {
    const batch = writeBatch(db);
    const chunk = items.slice(i, i + chunkSize);
    chunk.forEach((item) => operation(batch, item));
    await batch.commit();
  }
}

/**
 * Helper function to normalize doc IDs for Pokedex entries
 */
export function getPokemonDocId(id: string | number) {
  if (typeof id === "number") {
    return id.toString().padStart(3, "0");
  }
  if (typeof id === "string" && /^\d+$/.test(id)) {
    return id.padStart(3, "0");
  }
  return id;
}

/**
 * Fetches all documents in a Firestore collection and validates them using a Zod schema.
 */
export async function fetchCollectionData<T>(
  collectionName: string,
  schema: z.ZodSchema<T>,
  options?: { includeId?: boolean }
): Promise<T[]> {
  const collRef = collection(db, collectionName);
  const q = query(collRef);
  const querySnapshot = await getDocs(q);
  const items: T[] = [];

  querySnapshot.forEach((doc) => {
    if (doc.id.startsWith("_")) return; // Skip internal metadata
    const rawData = options?.includeId
      ? { id: doc.id, ...doc.data() }
      : doc.data();
    const result = schema.safeParse(rawData);
    if (result.success) {
      items.push(result.data);
    } else {
      console.warn(
        `[Zod Validation] Invalid data in collection "${collectionName}" for doc ID: ${doc.id}`,
        result.error
      );
    }
  });

  return items;
}

/**
 * Fetches documents matching a Firestore Query and validates them using a Zod schema.
 */
export async function fetchQueryDocuments<T>(
  q: Query,
  schema: z.ZodSchema<T>,
  transformDoc?: (doc: QueryDocumentSnapshot) => Record<string, unknown>
): Promise<T[]> {
  const querySnapshot = await getDocs(q);
  const items: T[] = [];
  querySnapshot.forEach((doc) => {
    const rawData = transformDoc
      ? transformDoc(doc)
      : { id: doc.id, ...doc.data() };
    const result = schema.safeParse(rawData);
    if (result.success) {
      items.push(result.data);
    } else {
      console.warn(
        `[Zod Validation] Invalid document ID: ${doc.id}`,
        result.error
      );
    }
  });
  return items;
}

/**
 * Fetches a single document from a Firestore collection and validates it using a Zod schema.
 */
export async function fetchDocumentData<T>(
  collectionName: string,
  docId: string,
  schema: z.ZodSchema<T>
): Promise<T | null> {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;

  const rawData = { id: docSnap.id, ...docSnap.data() };
  const result = schema.safeParse(rawData);
  if (result.success) {
    return result.data;
  } else {
    console.warn(
      `[Zod Validation] Invalid data in collection "${collectionName}" for doc ID: ${docId}`,
      result.error
    );
    return null;
  }
}

/**
 * Updates a batch of documents in a Firestore collection using writeBatch in chunks.
 */
export async function updateCollectionBatch<T extends Record<string, unknown>>(
  collectionName: string,
  items: T[],
  getDocId: (item: T) => string | null | undefined
): Promise<void> {
  if (!items || items.length === 0) return;
  await commitBatchInChunks(items, 400, (batch, item) => {
    const docId = getDocId(item);
    if (!docId) return; // Skip invalid or empty document IDs
    const docRef = doc(db, collectionName, docId);
    const cleanData = structuredClone(item);
    batch.set(docRef, cleanData);
  });
}
