import { useEffect, useState } from "react";

import { getBossFights } from "@/firebase/services/bossFightsService";
import { BossFight } from "@/types/bossFights";

interface BossFightsData {
  bossFightsData: BossFight[];
  isLoading: boolean;
}

let cachedBossFightsData: BossFightsData | null = null;

const initialEmptyState: BossFightsData = {
  bossFightsData: [],
  isLoading: true,
};

export const useBossFightsData = () => {
  const [data, setData] = useState<BossFightsData>(() => {
    if (cachedBossFightsData) {
      return cachedBossFightsData;
    }
    return initialEmptyState;
  });

  useEffect(() => {
    if (cachedBossFightsData) {
      return;
    }
    let isMounted = true;
    const fetchData = async () => {
      try {
        const rawData = await getBossFights();

        rawData.sort((a, b) => {
          const nameA = a.name || "";
          const nameB = b.name || "";
          return nameA.localeCompare(nameB);
        });

        const finalData = { bossFightsData: rawData, isLoading: false };
        cachedBossFightsData = finalData;
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
