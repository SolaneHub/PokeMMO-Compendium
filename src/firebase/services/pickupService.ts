import {
  collection,
  doc,
  getDocs,
  query,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { PICKUP_COLLECTION } from "@/firebase/services/common";
import { PickupRegion } from "@/types/pickup";

/**
 * Fetches all Pickup data from Firestore.
 */
export async function getPickupData(): Promise<PickupRegion[]> {
  const collRef = collection(db, PICKUP_COLLECTION);
  const q = query(collRef);
  const querySnapshot = await getDocs(q);
  const regions: PickupRegion[] = [];
  querySnapshot.forEach((doc) => {
    regions.push({ ...doc.data(), id: doc.id } as PickupRegion);
  });
  return regions;
}

/**
 * Updates Pickup collection.
 */
export async function updatePickupCollection(regionsArray: PickupRegion[]) {
  if (!regionsArray || regionsArray.length === 0) return;
  const batch = writeBatch(db);
  regionsArray.forEach((region) => {
    if (region.name) {
      const docId = region.name.toLowerCase();
      const docRef = doc(db, PICKUP_COLLECTION, docId);
      const cleanData = JSON.parse(JSON.stringify(region));
      batch.set(docRef, cleanData);
    }
  });
  await batch.commit();
}
