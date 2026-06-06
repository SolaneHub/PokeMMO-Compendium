import { doc, setDoc } from "firebase/firestore";

import { db } from "@/firebase/config";
import {
  fetchDocumentData,
  TRAINER_RERUN_COLLECTION,
} from "@/firebase/services/common";
import {
  TrainerRerunData,
  TrainerRerunDataSchema,
} from "@/pages/trainer-rerun/types/trainerRerun";

/**
 * Fetches Trainer Rerun data from Firestore.
 * There's only one main document for trainer rerun.
 */
export async function getTrainerRerun(): Promise<TrainerRerunData | null> {
  return fetchDocumentData<TrainerRerunData>(
    TRAINER_RERUN_COLLECTION,
    "main",
    TrainerRerunDataSchema
  );
}

/**
 * Updates Trainer Rerun document.
 */
export async function updateTrainerRerun(data: TrainerRerunData) {
  const docRef = doc(db, TRAINER_RERUN_COLLECTION, "main");
  const cleanData = structuredClone(data);
  await setDoc(docRef, cleanData);
}
