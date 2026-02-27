import { collection, getDocs, query } from "firebase/firestore";

import { db } from "@/firebase/config";
import { Raid } from "@/types/raids";

/**
 * Fetches all Raids data from Firestore.
 */
export async function getRaidsData(): Promise<Raid[]> {
  const collRef = collection(db, "raids");
  const q = query(collRef);
  const querySnapshot = await getDocs(q);
  const raids: Raid[] = [];
  querySnapshot.forEach((doc) => {
    raids.push(doc.data() as Raid);
  });
  return raids;
}
