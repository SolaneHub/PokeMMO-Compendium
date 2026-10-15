import { useDataQuery } from "@/hooks/useDataQuery";
import { getTrainerRerun } from "@/pages/trainer-rerun/services/trainerRerunService";
import { TrainerRerunData } from "@/pages/trainer-rerun/types/trainerRerun";

export const useTrainerRerunData = () => {
  const { data, isLoading } = useDataQuery<TrainerRerunData | null>(
    "trainer_rerun",
    getTrainerRerun
  );

  return {
    trainerRerunData: data || null,
    isLoading,
  };
};

export type UseTrainerRerunDataReturn = ReturnType<typeof useTrainerRerunData>;
