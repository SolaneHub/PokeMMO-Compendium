import { act, renderHook } from "@testing-library/react";
import CryptoJS from "crypto-js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePersistentState } from "./usePersistentState";

// Mock CryptoJS to make encryption/decryption predictable regardless of the secret key
vi.mock("crypto-js", () => {
  return {
    default: {
      AES: {
        encrypt: vi.fn((val) => ({
          toString: () => `mock-encrypted:${val}`,
        })),
        decrypt: vi.fn((val) => {
          if (val && val.startsWith("mock-encrypted:")) {
            return {
              toString: () => val.replace("mock-encrypted:", ""),
            };
          }
          // If it doesn't start with our prefix, we simulate a decryption failure (empty result)
          return { toString: () => "" };
        }),
      },
      enc: {
        Utf8: "utf8",
      },
    },
  };
});

describe("usePersistentState hook", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("initializes with provided value if localStorage is empty", () => {
    const { result } = renderHook(() =>
      usePersistentState("test-key", "default")
    );
    expect(result.current[0]).toBe("default");
  });

  it("loads and decrypts value from localStorage", () => {
    const data = { foo: "bar" };
    // Set a value that our mock can decrypt
    localStorage.setItem("test-key", `mock-encrypted:${JSON.stringify(data)}`);

    const { result } = renderHook(() => usePersistentState("test-key", {}));
    expect(result.current[0]).toEqual(data);
  });

  it("falls back to plain JSON if decryption fails", () => {
    const data = { foo: "plain" };
    // Store as plain JSON (no mock-encrypted prefix)
    localStorage.setItem("test-key", JSON.stringify(data));

    const { result } = renderHook(() => usePersistentState("test-key", {}));
    expect(result.current[0]).toEqual(data);
  });

  it("returns initialValue if JSON is malformed in localStorage", () => {
    localStorage.setItem("test-key", "invalid-json{");
    const { result } = renderHook(() =>
      usePersistentState("test-key", "fallback")
    );
    expect(result.current[0]).toBe("fallback");
  });

  it("saves encrypted value to localStorage on change", () => {
    const { result } = renderHook(() =>
      usePersistentState("test-key", "initial")
    );

    act(() => {
      result.current[1]("new-value");
    });

    const saved = localStorage.getItem("test-key");
    expect(saved).toBe(`mock-encrypted:"new-value"`);
    expect(CryptoJS.AES.encrypt).toHaveBeenCalled();
  });
});
