import CryptoJS from "crypto-js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

// Use a more robust fallback key. In a real app, this should be provided via environment variables.
const SECRET_KEY =
  import.meta.env.VITE_STORAGE_SECRET_KEY ||
  "pkm-cmp-v1-obfuscation-key-2024-secure-fallback";

export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return initialValue;
      try {
        const bytes = CryptoJS.AES.decrypt(saved, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (decrypted) {
          return JSON.parse(decrypted);
        }
      } catch (e) {
        // Fallback if decryption fails
      }
      return JSON.parse(saved);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(state),
        SECRET_KEY
      ).toString();
      localStorage.setItem(key, encrypted);
    } catch {
      /* ignore */
    }
  }, [key, state]);

  return [state, setState];
}
