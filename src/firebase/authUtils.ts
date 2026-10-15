import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/firebase/config";
import { AppUser } from "@/types/auth";

/**
 * Returns the current user as a promise.
 * Wait for Firebase to initialize its auth state.
 */
export function getCurrentUser(): Promise<AppUser | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        const appUser: AppUser | null = user
          ? {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
            }
          : null;
        resolve(appUser);
      },
      reject
    );
  });
}
