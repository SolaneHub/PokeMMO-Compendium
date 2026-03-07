import { useQuery } from "@tanstack/react-query";

import { getRaidsData } from "@/firebase/services/raidsService";

export type { Raid } from "@/types/raids";

export const useRaidsData = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["raids"],
    queryFn: async () => {
      const rawData = await getRaidsData();
      rawData.sort((a, b) => {
        if (a.stars !== b.stars) return a.stars - b.stars;
        return a.name.localeCompare(b.name);
      });
      const raidsMap = new Map(rawData.map((r) => [r.name, r]));
      const starLevels = [...new Set(rawData.map((r) => r.stars))].sort(
        (a, b) => a - b
      );
      return {
        raidsData: rawData,
        raidsMap,
        starLevels,
      };
    },
  });

  return {
    raidsData: data?.raidsData || [],
    raidsMap: data?.raidsMap || new Map(),
    starLevels: data?.starLevels || [],
    isLoading,
  };
};
