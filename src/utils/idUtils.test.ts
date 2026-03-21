import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { generateId } from "./idUtils";

describe("idUtils", () => {
  const originalCrypto = globalThis.crypto;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "crypto", {
      value: originalCrypto,
      writable: true,
      configurable: true,
    });
  });

  it("uses crypto.randomUUID if available", () => {
    const mockUUID = "mock-uuid-123";
    const mockCrypto = {
      randomUUID: vi.fn().mockReturnValue(mockUUID),
    };

    Object.defineProperty(globalThis, "crypto", {
      value: mockCrypto,
      writable: true,
      configurable: true,
    });

    const result = generateId("test");
    expect(result).toBe(`test-${mockUUID}`);
    expect(mockCrypto.randomUUID).toHaveBeenCalled();
  });

  it("uses crypto.getRandomValues as fallback if randomUUID is missing", () => {
    const mockCrypto = {
      getRandomValues: vi.fn((array) => {
        array[0] = 12345;
        return array;
      }),
    };

    Object.defineProperty(globalThis, "crypto", {
      value: mockCrypto,
      writable: true,
      configurable: true,
    });

    const result = generateId("test");
    expect(result).toContain("test-");
    expect(result).toContain("9ix"); // 12345 in base 36 is "9ix"
    expect(mockCrypto.getRandomValues).toHaveBeenCalled();
  });

  it("uses globalThis.crypto if crypto is not directly defined", () => {
    const mockUUID = "mock-uuid-456";
    const mockCrypto = {
      randomUUID: vi.fn().mockReturnValue(mockUUID),
    };

    // We need to temporarily hide the top-level 'crypto' variable
    // In Vitest/Node environment, this can be tricky, but we can try to stub it
    vi.stubGlobal("crypto", undefined);

    Object.defineProperty(globalThis, "crypto", {
      value: mockCrypto,
      writable: true,
      configurable: true,
    });

    const result = generateId("test");
    expect(result).toBe(`test-${mockUUID}`);

    vi.unstubAllGlobals();
  });

  it("falls back to Math.random if crypto is missing", () => {
    Object.defineProperty(globalThis, "crypto", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    // Also mock globalThis.crypto just in case it's different
    vi.stubGlobal("crypto", undefined);

    const spy = vi.spyOn(Math, "random").mockReturnValue(0.123456789);

    const result = generateId("fallback");
    expect(result).toContain("fallback-");
    expect(spy).toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("uses default prefix 'id' if none provided", () => {
    const result = generateId();
    expect(result.startsWith("id-")).toBe(true);
  });
});
