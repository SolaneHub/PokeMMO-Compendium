import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "@/firebase/config";
import { PickupRegion } from "@/types/pickup";

interface PickupData {
  regions: PickupRegion[];
  isLoading: boolean;
}

let cachedPickupData: PickupData | null = null;

const initialEmptyState: PickupData = { regions: [], isLoading: true };

export const usePickupData = () => {
  const [data, setData] = useState<PickupData>(() => {
    if (cachedPickupData) {
      return cachedPickupData;
    }
    return initialEmptyState;
  });

  useEffect(() => {
    if (cachedPickupData) {
      return;
    }
    let isMounted = true;
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pickup"));
        const regions = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as PickupRegion[];

        regions.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        const finalData = { regions, isLoading: false };
        cachedPickupData = finalData;
        if (isMounted) {
          setData(finalData);
        }
      } catch (err) {
        if (isMounted) setData({ ...initialEmptyState, isLoading: false });
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return data;
};
