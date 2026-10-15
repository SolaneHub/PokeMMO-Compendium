import { z } from "zod";

import { fetchCollectionData } from "@/firebase/services/common";
import { useDataQuery } from "@/hooks/useDataQuery";

interface UseCollectionOptions<T> {
  sortFn?: (a: T, b: T) => number;
  includeId?: boolean;
  enabled?: boolean;
  staleTime?: number;
}

/**
 * Generic custom hook to fetch a Firestore collection using lightweight in-memory useDataQuery.
 * Supports schema-based validation (Zod), sorting, and inclusion of document IDs.
 */
export function useCollectionData<T>(
  collectionName: string,
  schema: z.ZodSchema<T>,
  options: UseCollectionOptions<T> = {}
) {
  return useDataQuery(
    collectionName,
    async () => {
      const data = await fetchCollectionData<T>(collectionName, schema, {
        ...(options?.includeId !== undefined && {
          includeId: options.includeId,
        }),
      });
      if (options.sortFn) {
        data.sort(options.sortFn);
      }
      return data;
    },
    {
      enabled: options.enabled,
      ttl: options.staleTime,
    }
  );
}
