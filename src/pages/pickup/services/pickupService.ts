import {
  fetchCollectionData,
  PICKUP_COLLECTION,
  updateCollectionBatch,
} from "@/firebase/services/common";
import { PickupRegion, PickupRegionSchema } from "@/pages/pickup/types/pickup";

/**
 * Fetches all Pickup data from Firestore.
 */
export async function getPickupData(): Promise<PickupRegion[]> {
  return fetchCollectionData<PickupRegion>(
    PICKUP_COLLECTION,
    PickupRegionSchema,
    {
      includeId: true,
    }
  );
}

/**
 * Updates Pickup collection.
 */
export async function updatePickupCollection(regionsArray: PickupRegion[]) {
  return updateCollectionBatch(PICKUP_COLLECTION, regionsArray, (region) =>
    region.name ? region.name.toLowerCase() : null
  );
}
