import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "@/firebase/config";
let cachedRaidsData = null;
const initialEmptyState = {
  raidsData: [],
  raidsMap: new Map(),
  starLevels: [],
  isLoading: true,
};
export const useRaidsData = () => {
  const [data, setData] = useState(() => {
    if (cachedRaidsData) {
      return cachedRaidsData;
    }
    return initialEmptyState;
  });
  useEffect(() => {
    if (cachedRaidsData) {
      return;
    }
    let isMounted = true;
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "raids"));
        const rawData = querySnapshot.docs.map((doc) => doc.data());
        rawData.sort((a, b) => {
          if (a.stars !== b.stars) return a.stars - b.stars;
          return a.name.localeCompare(b.name);
        });
        const raidsMap = new Map(rawData.map((r) => [r.name, r]));
        const starLevels = [...new Set(rawData.map((r) => r.stars))].sort(
          (a, b) => a - b
        );
        const finalData = {
          raidsData: rawData,
          raidsMap,
          starLevels,
          isLoading: false,
        };
        cachedRaidsData = finalData;
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
