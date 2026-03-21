import { describe, expect, it, vi } from "vitest";

// We need to mock the environment variable BEFORE the module is loaded
// or mock the module itself if it has top-level side effects like Set initialization.
vi.mock("./adminUtils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./adminUtils")>();
  return {
    ...actual,
  };
});

describe("adminUtils", () => {
  it("should return true if email is in ADMIN_EMAILS", async () => {
    vi.stubEnv("VITE_ADMIN_EMAILS", "admin@example.com,test@test.com");
    const { isAdmin } = await import("./adminUtils?t=" + Date.now());

    expect(isAdmin("admin@example.com")).toBe(true);
    expect(isAdmin("test@test.com")).toBe(true);
  });

  it("should return true regardless of case", async () => {
    vi.stubEnv("VITE_ADMIN_EMAILS", "admin@example.com");
    const { isAdmin } = await import("./adminUtils?t=" + (Date.now() + 1));

    expect(isAdmin("ADMIN@EXAMPLE.COM")).toBe(true);
  });

  it("should return false if email is not in ADMIN_EMAILS", async () => {
    vi.stubEnv("VITE_ADMIN_EMAILS", "admin@example.com");
    const { isAdmin } = await import("./adminUtils?t=" + (Date.now() + 2));

    expect(isAdmin("user@example.com")).toBe(false);
  });

  it("should return false if email is null or undefined", async () => {
    const { isAdmin } = await import("./adminUtils");
    expect(isAdmin(null)).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
    expect(isAdmin("")).toBe(false);
  });
});
