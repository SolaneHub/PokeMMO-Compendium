import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { auth } from "@/firebase/config";
import { logger } from "@/shared/utils/logger";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(false);

  function logout() {
    return signOut(auth);
  }

  function googleSignIn() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  useEffect(() => {
    let abortController = new AbortController();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      abortController.abort();
      abortController = new AbortController();
      setCurrentUser(user);

      if (user) {
        setAdminLoading(true);
        try {
          // Force refresh to get latest claims
          const tokenResult = await user.getIdTokenResult(true);
          setIsAdmin(!!tokenResult.claims.admin);
        } catch (error) {
          logger.error("Error checking admin claim in AuthContext:", error);
          setIsAdmin(false);
        } finally {
          setAdminLoading(false);
          setLoading(false);
        }
      } else {
        setIsAdmin(false);
        setAdminLoading(false);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAdmin,
      loading: loading || adminLoading,
      logout,
      googleSignIn,
    }),
    [currentUser, isAdmin, loading, adminLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
