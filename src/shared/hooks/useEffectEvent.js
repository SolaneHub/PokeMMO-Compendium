import { useCallback, useLayoutEffect, useRef } from "react";

/**
 * A shim for the upcoming React `useEffectEvent` hook.
 *
 * This hook allows you to define an event handler that can read the latest
 * props and state, but has a stable identity. You can call this function
 * from inside `useEffect`, and it won't trigger the effect to re-run.
 *
 * @param {Function} handler - The function to be wrapped.
 * @returns {Function} A stable function that calls the latest version of `handler`.
 */
export function useEffectEvent(handler) {
  const handlerRef = useRef(null);

  // Use useLayoutEffect to ensure the ref is updated before any effects run
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args) => {
    const fn = handlerRef.current;
    return fn?.(...args);
  }, []);
}
