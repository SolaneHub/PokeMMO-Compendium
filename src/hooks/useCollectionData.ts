import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { fetchCollectionData } from "@/firebase/services/common";

interface UseCollectionOptions<T> {
  sortFn?: (a: T, b: T) => number;
  includeId?: boolean;
  enabled?: boolean;
  staleTime?: number;
}

/**
 * Generic custom hook to fetch a Firestore collection using TanStack Query.
 * Supports schema-based validation (Zod), sorting, and inclusion of document IDs.
 */
export function useCollectionData<T>(
  collectionName: string,
  schema: z.ZodSchema<T>,
  options: UseCollectionOptions<T> = {}
) {
  return useQuery({
    queryKey: [collectionName],
    queryFn: async () => {
      const data = await fetchCollectionData<T>(collectionName, schema, {
        includeId: options.includeId,
      });
      if (options.sortFn) {
        data.sort(options.sortFn);
      }
      return data;
    },
    enabled: options.enabled,
    staleTime: options.staleTime,
  });
}
