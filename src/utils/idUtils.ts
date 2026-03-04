/**
 * Generates a unique ID using the Web Crypto API if available.
 * Falls back to a pseudo-random generator if crypto is not available.
 * This satisfies SonarQube's requirement for cryptographically strong random values.
 */
export function generateId(prefix = "id"): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return `${prefix}-${Date.now()}-${array[0].toString(36)}`;
  }

  // Last resort fallback (non-cryptographic)
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
