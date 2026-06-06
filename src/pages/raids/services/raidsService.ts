import { fetchCollectionData } from "@/firebase/services/common";
import { Raid, RaidSchema } from "@/pages/raids/types/raids";

/**
 * Fetches all Raids data from Firestore.
 */
export async function getRaidsData(): Promise<Raid[]> {
  return fetchCollectionData<Raid>("raids", RaidSchema);
}
