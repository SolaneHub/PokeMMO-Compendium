import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "@/firebase/config";
import { TRAINER_RERUN_COLLECTION } from "@/firebase/services/common";
import { TrainerRerunData } from "@/types/trainerRerun";

/**
 * Fetches Trainer Rerun data from Firestore.
 * There's only one main document for trainer rerun.
 */
export async function getTrainerRerun(): Promise<TrainerRerunData | null> {
  const docRef = doc(db, TRAINER_RERUN_COLLECTION, "main");
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data() as TrainerRerunData;
}

/**
 * Updates Trainer Rerun document.
 */
export async function updateTrainerRerun(data: TrainerRerunData) {
  const docRef = doc(db, TRAINER_RERUN_COLLECTION, "main");
  const cleanData = JSON.parse(JSON.stringify(data));
  await setDoc(docRef, cleanData);
}
