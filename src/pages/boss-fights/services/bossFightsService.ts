import {
  BOSS_FIGHTS_COLLECTION,
  fetchCollectionData,
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
