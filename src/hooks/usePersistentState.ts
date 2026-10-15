import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return initialValue;
      return JSON.parse(saved);
    } catch {
      // Return initialValue if localStorage is unavailable or entry is corrupted
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [key, state]);

  return [state, setState];
}
