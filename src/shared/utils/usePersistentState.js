import { useEffect, useState } from "react";

export function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch (error) {
      // If an error occurs, e.g., due to localStorage being unavailable,
      // return the initial value.
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      // If an error occurs, e.g., due to localStorage being full or unavailable,
      // log the error but don't prevent the component from functioning.
    }
  }, [key, state]);

  return [state, setState];
}
