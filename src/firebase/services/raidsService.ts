import { collection, getDocs, query } from "firebase/firestore";

import { db } from "@/firebase/config";
import { Raid, RaidSchema } from "@/types/raids";

/**
 * Fetches all Raids data from Firestore.
 */
export async function getRaidsData(): Promise<Raid[]> {
  const collRef = collection(db, "raids");
  const q = query(collRef);
  const querySnapshot = await getDocs(q);
  const raids: Raid[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const result = RaidSchema.safeParse(data);
    if (result.success) {
      raids.push(result.data);
    } else {
      console.warn(
        `[Zod Validation] Invalid Raid data for doc ID: ${doc.id}`,
        result.error
      );
    }
  });
  return raids;
}
