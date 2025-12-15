import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { auth } from "@/firebase/config";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth functions
  async function signup(email, password, recaptchaToken) {
    if (!recaptchaToken) {
      throw new Error("reCAPTCHA verification failed. Please try again.");
    }
    // Client-side reCAPTCHA check is active. Server-side verification is disabled.
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(email, password, recaptchaToken) {
    if (!recaptchaToken) {
      throw new Error("reCAPTCHA verification failed. Please try again.");
    }
    // Client-side reCAPTCHA check is active. Server-side verification is disabled.
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function googleSignIn() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      signup,
      login,
      logout,
      googleSignIn,
    }),
    [currentUser, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
