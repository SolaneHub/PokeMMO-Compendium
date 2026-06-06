import {
  fetchCollectionData,
  SUPER_TRAINERS_COLLECTION,
  updateCollectionBatch,
} from "@/firebase/services/common";
import {
  SuperTrainer,
  SuperTrainerSchema,
} from "@/pages/super-trainers/types/superTrainers";

/**
 * Fetches all Super Trainers data from Firestore.
 */
export async function getSuperTrainers(): Promise<SuperTrainer[]> {
  return fetchCollectionData<SuperTrainer>(
    SUPER_TRAINERS_COLLECTION,
    SuperTrainerSchema
  );
}

/**
 * Updates Super Trainers collection.
 */
export async function updateSuperTrainersCollection(
  trainersArray: SuperTrainer[]
) {
  return updateCollectionBatch(
    SUPER_TRAINERS_COLLECTION,
    trainersArray,
    (trainer) => (trainer.name ? trainer.name.toLowerCase() : null)
  );
}
