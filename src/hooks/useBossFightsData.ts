import { useQuery } from "@tanstack/react-query";

import { getBossFights } from "@/firebase/services/bossFightsService";

export const useBossFightsData = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["bossFights"],
    queryFn: async () => {
      const rawData = await getBossFights();
      return rawData.sort((a, b) => {
        const nameA = a.name || "";
        const nameB = b.name || "";
        return nameA.localeCompare(nameB);
      });
    },
  });

  return {
    bossFightsData: data || [],
    isLoading,
  };
};
