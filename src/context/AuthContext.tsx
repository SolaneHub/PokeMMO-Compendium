import {
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
  User,
} from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { auth } from "@/firebase/config";

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(false);

  function logout() {
    return signOut(auth);
  }

  function googleSignIn() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    return signInWithRedirect(auth, provider);
  }

  useEffect(() => {
    // Handle redirect result to capture sign-in error or success
    getRedirectResult(auth).catch((error) => {
      console.error("Redirect Sign In Error:", error);
    });

    let abortController = new AbortController();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      abortController.abort();
      abortController = new AbortController();
      setCurrentUser(user);
      if (user) {
        setAdminLoading(true);
        try {
          const tokenResult = await user.getIdTokenResult(true);
          setIsAdmin(!!tokenResult.claims.admin);
        } catch (error) {
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
