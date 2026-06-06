import { SUPER_TRAINERS_COLLECTION } from "@/firebase/services/common";
import { useCollectionData } from "@/hooks/useCollectionData";
import { SuperTrainerSchema } from "@/pages/super-trainers/types/superTrainers";

export const useSuperTrainersData = () => {
  const { data, isLoading } = useCollectionData(
    SUPER_TRAINERS_COLLECTION,
    SuperTrainerSchema,
    {
      sortFn: (a, b) => (a.name || "").localeCompare(b.name || ""),
    }
  );

  return {
    superTrainersData: data || [],
    isLoading,
  };
};

export type UseSuperTrainersDataReturn = ReturnType<
  typeof useSuperTrainersData
>;
