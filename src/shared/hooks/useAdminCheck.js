import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

import { logger } from "@/shared/utils/logger";

export function useAdminCheck(enabled = true) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(enabled);
  const auth = getAuth();

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      setIsAdmin(false);
      return;
    }

    let isMounted = true;

    const checkAdmin = async (user) => {
      if (!user) {
        if (isMounted) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        logger.debug(`Checking admin for user: ${user.email}`);
        // ForceRefresh true is important to get the latest claims
        const tokenResult = await user.getIdTokenResult(true);
        if (isMounted) {
          const isAdminValue = !!tokenResult.claims.admin;
          logger.debug(`Admin claim result for ${user.email}: ${isAdminValue}`);
          setIsAdmin(isAdminValue);
        }
      } catch (error) {
        logger.error("Error checking admin status:", error);
        if (isMounted) {
          setIsAdmin(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      checkAdmin(user);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [auth, enabled]);

  return { isAdmin, loading };
}
