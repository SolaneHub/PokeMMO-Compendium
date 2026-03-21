import { onAuthStateChanged, User } from "firebase/auth";
import { describe, expect, it, vi } from "vitest";

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
    it("should resolve with user when authenticated", async () => {
      const mockUser = {
        uid: "user123",
        email: "test@example.com",
      } as unknown as User;

      vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
        // Simulate async behavior so unsubscribe is initialized
        setTimeout(
          () => (callback as (user: User | null) => void)(mockUser),
          0
        );
        return vi.fn() as unknown as import("firebase/auth").Unsubscribe;
      });

      const user = await getCurrentUser();
      expect(user).toEqual(mockUser);
    });

    it("should resolve with null when not authenticated", async () => {
      vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
        setTimeout(() => (callback as (user: User | null) => void)(null), 0);
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
