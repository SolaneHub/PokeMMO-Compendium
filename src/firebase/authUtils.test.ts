import { onAuthStateChanged } from "firebase/auth";
import { describe, expect, it, vi } from "vitest";

import { AppUser } from "@/types/auth";

import { getCurrentUser } from "./authUtils";

// Mocking firebase/auth
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
}));

// Mocking firebase config
vi.mock("@/firebase/config", () => ({
  auth: {} as unknown as import("firebase/auth").Auth,
}));

describe("authUtils", () => {
  describe("getCurrentUser", () => {
    it("should resolve with mapped AppUser when authenticated", async () => {
      const mockFirebaseUser = {
        uid: "user123",
        email: "test@example.com",
        displayName: "Test User",
        photoURL: "https://example.com/avatar.png",
      };

      vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
        // Simulate async behavior so unsubscribe is initialized
        setTimeout(
          () =>
            (callback as (user: typeof mockFirebaseUser | null) => void)(
              mockFirebaseUser
            ),
          0
        );
        return vi.fn() as unknown as import("firebase/auth").Unsubscribe;
      });

      const user = await getCurrentUser();
      expect(user).toEqual<AppUser>({
        uid: "user123",
        email: "test@example.com",
        displayName: "Test User",
      });
      expect(user).not.toHaveProperty("photoURL");
    });

    it("should resolve with null when not authenticated", async () => {
      vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
        setTimeout(() => (callback as (user: null) => void)(null), 0);
        return vi.fn() as unknown as import("firebase/auth").Unsubscribe;
      });

      const user = await getCurrentUser();
      expect(user).toBeNull();
    });

    it("should reject on error", async () => {
      vi.mocked(onAuthStateChanged).mockImplementation(
        (_auth, _callback, errorCallback) => {
          if (errorCallback) {
            setTimeout(() => errorCallback(new Error("Auth error")), 0);
          }
          return vi.fn() as unknown as import("firebase/auth").Unsubscribe;
        }
      );

      await expect(getCurrentUser()).rejects.toThrow("Auth error");
    });
  });
});
