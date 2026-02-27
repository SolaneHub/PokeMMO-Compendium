import {
  collection,
  doc,
  getDocs,
  query,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { BOSS_FIGHTS_COLLECTION } from "@/firebase/services/common";
import { BossFight } from "@/types/bossFights";

/**
 * Fetches all Boss Fights data from Firestore.
 */
export async function getBossFights(): Promise<BossFight[]> {
  const collRef = collection(db, BOSS_FIGHTS_COLLECTION);
  const q = query(collRef);
  const querySnapshot = await getDocs(q);
  const bossFights: BossFight[] = [];
  querySnapshot.forEach((doc) => {
    bossFights.push(doc.data() as BossFight);
  });
  return bossFights;
}

/**
 * Updates Boss Fights collection.
 */
export async function updateBossFightsCollection(bossFightsArray: BossFight[]) {
  if (!bossFightsArray || bossFightsArray.length === 0) return;
  const batch = writeBatch(db);
  bossFightsArray.forEach((bossFight) => {
    if (bossFight.name && bossFight.region) {
      const docId = `${bossFight.region}-${bossFight.name}`.toLowerCase();
      const docRef = doc(db, BOSS_FIGHTS_COLLECTION, docId);
      const cleanData = JSON.parse(JSON.stringify(bossFight));
      batch.set(docRef, cleanData);
    }
  });
  await batch.commit();
}
