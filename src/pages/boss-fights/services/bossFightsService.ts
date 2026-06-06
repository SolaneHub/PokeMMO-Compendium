import {
  BOSS_FIGHTS_COLLECTION,
  fetchCollectionData,
  updateCollectionBatch,
} from "@/firebase/services/common";
import {
  BossFight,
  BossFightSchema,
} from "@/pages/boss-fights/types/bossFights";

/**
 * Fetches all Boss Fights data from Firestore.
 */
export async function getBossFights(): Promise<BossFight[]> {
  return fetchCollectionData<BossFight>(
    BOSS_FIGHTS_COLLECTION,
    BossFightSchema
  );
}

/**
 * Updates Boss Fights collection.
 */
export async function updateBossFightsCollection(bossFightsArray: BossFight[]) {
  return updateCollectionBatch(BOSS_FIGHTS_COLLECTION, bossFightsArray, (bf) =>
    bf.region && bf.name ? `${bf.region}-${bf.name}`.toLowerCase() : null
  );
}
