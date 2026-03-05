import { act, renderHook, waitFor } from "@testing-library/react";
import * as firebaseAuth from "firebase/auth";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider, useAuth } from "./AuthContext";

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws error if useAuth is used outside provider", () => {
    // Suppress console.error for expected React error boundary message
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(vi.fn());
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within an AuthProvider"
    );
    consoleSpy.mockRestore();
  });

  describe("with AuthProvider", () => {
    it("initializes with loading state and handles unauthenticated user", async () => {
      // Setup mock to return null immediately
      vi.mocked(firebaseAuth.onAuthStateChanged).mockImplementation(
        (_auth, callback) => {
          (callback as (user: firebaseAuth.User | null) => void)(null);
          return vi.fn(); // unsubscribe
        }
      );

      const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

      // After callback, loading should be false and currentUser null
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.currentUser).toBeNull();
      expect(result.current.isAdmin).toBe(false);
    });

    it("handles authenticated regular user", async () => {
      const mockUser = {
        uid: "user-123",
        getIdTokenResult: vi
          .fn()
          .mockResolvedValue({ claims: { admin: false } }),
      };

      vi.mocked(firebaseAuth.onAuthStateChanged).mockImplementation(
        (_auth, callback) => {
          (callback as (user: unknown) => void)(mockUser);
          return vi.fn();
        }
      );

      const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.currentUser).toEqual(mockUser);
      expect(result.current.isAdmin).toBe(false);
    });

    it("handles authenticated admin user", async () => {
      const mockUser = {
        uid: "admin-123",
        getIdTokenResult: vi
          .fn()
          .mockResolvedValue({ claims: { admin: true } }),
      };

      vi.mocked(firebaseAuth.onAuthStateChanged).mockImplementation(
        (_auth, callback) => {
          (callback as (user: unknown) => void)(mockUser);
          return vi.fn();
        }
      );

      const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.currentUser).toEqual(mockUser);
      expect(result.current.isAdmin).toBe(true);
    });

    it("calls googleSignIn correctly", async () => {
      vi.mocked(firebaseAuth.onAuthStateChanged).mockImplementation(
        (_auth, cb) => {
          (cb as (user: null) => void)(null);
          return vi.fn();
        }
      );

      const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

      await act(async () => {
        await result.current.googleSignIn();
      });

      expect(firebaseAuth.signInWithPopup).toHaveBeenCalled();
    });

    it("calls logout correctly", async () => {
      vi.mocked(firebaseAuth.onAuthStateChanged).mockImplementation(
        (_auth, cb) => {
          (cb as (user: null) => void)(null);
          return vi.fn();
        }
      );

      const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

      await act(async () => {
        await result.current.logout();
      });

      expect(firebaseAuth.signOut).toHaveBeenCalled();
    });
  });
});
