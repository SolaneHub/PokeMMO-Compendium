import { PICKUP_COLLECTION } from "@/firebase/services/common";
import { useCollectionData } from "@/hooks/useCollectionData";
import { PickupRegionSchema } from "@/pages/pickup/types/pickup";

export const usePickupData = () => {
  const { data, isLoading } = useCollectionData(
    PICKUP_COLLECTION,
    PickupRegionSchema,
    {
      includeId: true,
      sortFn: (a, b) => (a.name || "").localeCompare(b.name || ""),
    }
  );

  return {
    regions: data || [],
    isLoading,
  };
};

export type UsePickupDataReturn = ReturnType<typeof usePickupData>;
