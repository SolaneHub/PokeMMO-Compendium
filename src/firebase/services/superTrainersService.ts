import {
  collection,
  doc,
  getDocs,
  query,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { SUPER_TRAINERS_COLLECTION } from "@/firebase/services/common";
import { SuperTrainer, SuperTrainerSchema } from "@/types/superTrainers";

/**
 * Fetches all Super Trainers data from Firestore.
 */
export async function getSuperTrainers(): Promise<SuperTrainer[]> {
  const collRef = collection(db, SUPER_TRAINERS_COLLECTION);
  const q = query(collRef);
  const querySnapshot = await getDocs(q);
  const trainers: SuperTrainer[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const result = SuperTrainerSchema.safeParse(data);
    if (result.success) {
      trainers.push(result.data);
    } else {
      console.warn(
        `[Zod Validation] Invalid SuperTrainer data for doc ID: ${doc.id}`,
        result.error
      );
    }
  });
  return trainers;
}

/**
 * Updates Super Trainers collection.
 */
export async function updateSuperTrainersCollection(
  trainersArray: SuperTrainer[]
) {
  if (!trainersArray || trainersArray.length === 0) return;
  const batch = writeBatch(db);
  trainersArray.forEach((trainer) => {
    if (trainer.name) {
      const docId = trainer.name.toLowerCase();
      const docRef = doc(db, SUPER_TRAINERS_COLLECTION, docId);
      const cleanData = JSON.parse(JSON.stringify(trainer));
      batch.set(docRef, cleanData);
    }
  });
  await batch.commit();
}
