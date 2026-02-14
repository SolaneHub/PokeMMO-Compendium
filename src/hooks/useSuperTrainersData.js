import { useEffect, useState } from "react";

import { getSuperTrainers } from "@/firebase/firestoreService";
let cachedSuperTrainersData = null;
const initialEmptyState = { superTrainersData: [], isLoading: true };
export const useSuperTrainersData = () => {
  const [data, setData] = useState(() => {
    if (cachedSuperTrainersData) {
      return cachedSuperTrainersData;
    }
    return initialEmptyState;
  });
  useEffect(() => {
    if (cachedSuperTrainersData) {
      return;
    }
    let isMounted = true;
    const fetchData = async () => {
      try {
        const rawData = await getSuperTrainers();
        rawData.sort((a, b) => {
          const nameA = a.name || "";
          const nameB = b.name || "";
          return nameA.localeCompare(nameB);
        });
        const finalData = { superTrainersData: rawData, isLoading: false };
        cachedSuperTrainersData = finalData;
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
