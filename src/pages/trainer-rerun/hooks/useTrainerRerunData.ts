import { useQuery } from "@tanstack/react-query";

import { getTrainerRerun } from "@/pages/trainer-rerun/services/trainerRerunService";
import { TrainerRerunData } from "@/pages/trainer-rerun/types/trainerRerun";

export const useTrainerRerunData = () => {
  const { data, isLoading } = useQuery<TrainerRerunData | null>({
    queryKey: ["trainer_rerun"],
    queryFn: getTrainerRerun,
  });

  return {
    trainerRerunData: data || null,
    isLoading,
  };
};

export type UseTrainerRerunDataReturn = ReturnType<typeof useTrainerRerunData>;
