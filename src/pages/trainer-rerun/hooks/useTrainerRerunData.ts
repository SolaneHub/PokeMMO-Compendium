import { getTrainerRerun } from "@/firebase/services/trainerRerunService";
import { useDataQuery } from "@/hooks/useDataQuery";
import { TrainerRerunData } from "@/types/trainerRerun";

export const useTrainerRerunData = () => {
  const { data, isLoading, error } = useDataQuery<TrainerRerunData | null>(
    "trainer_rerun",
    getTrainerRerun
  );

  return {
    trainerRerunData: data || null,
    isLoading,
    error,
  };
};

export type UseTrainerRerunDataReturn = ReturnType<typeof useTrainerRerunData>;
