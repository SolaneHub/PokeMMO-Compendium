import { useCollectionData } from "@/hooks/useCollectionData";
import { RaidSchema } from "@/pages/raids/types/raids";

export type { Raid } from "@/pages/raids/types/raids";

export const useRaidsData = () => {
  const { data, isLoading } = useCollectionData("raids", RaidSchema, {
    sortFn: (a, b) => {
      if (a.stars !== b.stars) return a.stars - b.stars;
      return a.name.localeCompare(b.name);
    },
  });

  const raidsData = data || [];
  const raidsMap = new Map(raidsData.map((r) => [r.name, r]));
  const starLevels = [...new Set(raidsData.map((r) => r.stars))].sort(
    (a, b) => a - b
  );

  return {
    raidsData,
    raidsMap,
    starLevels,
    isLoading,
  };
};

export type UseRaidsDataReturn = ReturnType<typeof useRaidsData>;
