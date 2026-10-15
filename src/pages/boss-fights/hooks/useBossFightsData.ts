import { BOSS_FIGHTS_COLLECTION } from "@/firebase/services/common";
import { useCollectionData } from "@/hooks/useCollectionData";
import { BossFightSchema } from "@/pages/boss-fights/types/bossFights";

export const useBossFightsData = () => {
  const { data, isLoading, error } = useCollectionData(
    BOSS_FIGHTS_COLLECTION,
    BossFightSchema,
    {
      sortFn: (a, b) => (a.name || "").localeCompare(b.name || ""),
    }
  );

  return {
    bossFightsData: data || [],
    isLoading,
    error,
  };
};

export type UseBossFightsDataReturn = ReturnType<typeof useBossFightsData>;
