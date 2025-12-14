import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "@/firebase/config";
import { extractPokedexData } from "@/shared/utils/pokedexDataExtraction";
import { initializePokemonColorMap } from "@/shared/utils/pokemonMoveColors";

// Simple in-memory cache to prevent re-fetching/re-processing
// Since pokedex data is static for the session, this is safe and efficient.
let cachedPokedexData = null;

const initialEmptyState = {
  pokemonNames: [],
  moveNames: [],
  abilityNames: [],
  itemNames: [],
  allPokemonData: [], // Now refers to the raw list fetched from Firestore
  pokemonMap: new Map(), // New: Map for quick lookups
  pokemonColorMap: {}, // Add this line
  isLoading: true,
};

export const usePokedexData = () => {
  const [data, setData] = useState(() => {
    if (cachedPokedexData) {
      return cachedPokedexData;
    }
    return initialEmptyState;
  });

  useEffect(() => {
    // If we already have data in memory, return. This check is crucial for
    // ensuring data is fetched only once per session or until cache is cleared.
    if (cachedPokedexData) {
      return;
    }

    let isMounted = true; // To prevent setting state on unmounted component

    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pokedex"));

        const rawData = querySnapshot.docs.map((doc) => doc.data());

        // Sort by ID to ensure consistent order (Firestore doesn't guarantee order)
        rawData.sort((a, b) => (a.id || 0) - (b.id || 0));

        const initializedPokemonColorMap = initializePokemonColorMap(rawData); // Call and store the returned map

        const processed = extractPokedexData(rawData);
        const pokemonMap = new Map(rawData.map((p) => [p.name, p])); // Create the map here

        const finalData = {
          ...processed,
          allPokemonData: rawData, // Store the raw data for general use
          fullList: rawData, // Add fullList property for consumers like PokedexPage
          pokemonMap: pokemonMap, // Expose the map
          pokemonColorMap: initializedPokemonColorMap, // Add the initialized map here
          isLoading: false,
        };

        cachedPokedexData = finalData; // Cache the fetched data
        if (isMounted) {
          setData(finalData); // Update component state
        }
      } catch (err) {
        console.error("Failed to load Pokedex data from Firestore:", err);
        if (isMounted) setData({ ...initialEmptyState, isLoading: false });
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup for unmounted components
    };
  }, []);
  // Removed `data` from dependencies to prevent infinite loops.
  // The `cachedPokedexData` handles memoization across renders.

  return data;
};
