import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "@/firebase/config";
import { SuperTrainer } from "@/types/superTrainers";

interface SuperTrainersData {
  superTrainersData: SuperTrainer[];
  isLoading: boolean;
}

let cachedSuperTrainersData: SuperTrainersData | null = null;

const initialEmptyState: SuperTrainersData = {
  superTrainersData: [],
  isLoading: true,
};

export const useSuperTrainersData = () => {
  const [data, setData] = useState<SuperTrainersData>(() => {
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
        const querySnapshot = await getDocs(collection(db, "super_trainers"));
        const rawData = querySnapshot.docs.map((doc) =>
          doc.data()
        ) as SuperTrainer[];

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
