import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "@/firebase/config";

let cachedSuperTrainersData = null;

const initialEmptyState = {
  superTrainersData: [],
  isLoading: true,
};

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
        const querySnapshot = await getDocs(collection(db, "super_trainers"));
        const rawData = querySnapshot.docs.map((doc) => doc.data());

        // Sort by name
        rawData.sort((a, b) => a.name.localeCompare(b.name));

        const finalData = {
          superTrainersData: rawData,
          isLoading: false,
        };

        cachedSuperTrainersData = finalData;
        if (isMounted) {
          setData(finalData);
        }
      } catch (err) {
        console.error("Error fetching super trainers:", err);
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
