import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";

const SECRET_KEY = import.meta.env.VITE_STORAGE_SECRET_KEY;

export function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
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
        // Decryption failed, proceed to fallback
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
      /* empty */
    }
  }, [key, state]);

  return [state, setState];
}
