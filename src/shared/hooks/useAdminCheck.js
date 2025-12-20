import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

import { logger } from "@/shared/utils/logger";

export function useAdminCheck(enabled = true) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(enabled);
  const auth = getAuth();

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const checkAdmin = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (user) {
          // ForceRefresh true è importante per scaricare il nuovo claim appena messo
          const tokenResult = await user.getIdTokenResult(true);
          setIsAdmin(!!tokenResult.claims.admin);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        logger.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    // Controlla al caricamento e ogni volta che cambia l'utente
    return auth.onAuthStateChanged(() => {
      checkAdmin();
    });
  }, [auth, enabled]);

  return { isAdmin, loading };
}
