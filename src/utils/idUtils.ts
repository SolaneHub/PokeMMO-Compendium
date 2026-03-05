/**
 * Generates a unique ID using the Web Crypto API if available.
 * Falls back to a pseudo-random generator ONLY if crypto is not available.
 * These IDs are intended for UI keys and non-security-critical identifiers.
 */
export function generateId(prefix = "id"): string {
  // Try to use the Web Crypto API (standard in modern browsers and Node.js)
  let cryptoObj: Crypto | undefined;

  if (typeof crypto !== "undefined") {
    cryptoObj = crypto;
  } else if (typeof globalThis !== "undefined") {
    cryptoObj = globalThis.crypto;
  }

  if (cryptoObj) {
    // 1. Try randomUUID (most modern and robust)
    if (typeof cryptoObj.randomUUID === "function") {
      return `${prefix}-${cryptoObj.randomUUID()}`;
    }

    // 2. Try getRandomValues (widely supported fallback)
    if (typeof cryptoObj.getRandomValues === "function") {
      const array = new Uint32Array(1);
      cryptoObj.getRandomValues(array);
      const randomVal = array[0];
      if (randomVal !== undefined) {
        return `${prefix}-${Date.now()}-${randomVal.toString(36)}`;
      }
    }
  }

  /**
   * Last resort fallback (non-cryptographic).
   * Flagged by security scanners because Math.random() is predictable.
   * SAFE HERE: These IDs are used only for UI elements (list keys, temp form IDs)
   * and never for security-critical tokens, passwords, or encryption seeds.
   */
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
