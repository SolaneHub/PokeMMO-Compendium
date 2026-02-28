import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "@/firebase/config";

/**
 * Returns the current user as a promise.
 * Wait for Firebase to initialize its auth state.
 */
export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
}
