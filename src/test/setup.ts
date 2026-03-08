import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

// Mock HTMLDialogElement methods for JSDOM
if (typeof HTMLDialogElement !== "undefined") {
  HTMLDialogElement.prototype.showModal = vi.fn(function (
    this: HTMLDialogElement
  ) {
    this.open = true;
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.open = false;
  });
}

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

// Set environment for React act()
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Setup MSW Server for network interception
export const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Global Firebase Mocks
vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({
    currentUser: null,
  })),
  onAuthStateChanged: vi.fn((_auth, callback) => {
    callback(null);
    return () => {
      /* noop */
    };
  }),
  setPersistence: vi.fn(() => Promise.resolve()),
  browserLocalPersistence: {},
  GoogleAuthProvider: class {
    setCustomParameters = vi.fn();
  },
  signOut: vi.fn(() => Promise.resolve()),
  signInWithPopup: vi.fn(() => Promise.resolve()),
}));

// Better Firestore Mock with internal state
let mockDocs: unknown[] = [];
export const setMockDocs = (docs: unknown[]) => {
  mockDocs = docs;
};

const mapMockDoc = (doc: unknown) => ({
  id: (doc as { id?: string }).id || "1",
  data: () => doc,
});

vi.mock("firebase/firestore", () => ({
  initializeFirestore: vi.fn(() => ({})),
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(() => ({ id: "mock-collection" })),
  doc: vi.fn((_db, _coll, id) => ({ id: id || "mock-doc" })),
  getDoc: vi.fn(async () => ({
    exists: () => mockDocs.length > 0,
    data: () => (mockDocs.length > 0 ? mockDocs[0] : null),
  })),
  getDocs: vi.fn(async () => ({
    empty: mockDocs.length === 0,
    docs: mockDocs.map(mapMockDoc),
    forEach: (callback: (doc: { id: string; data: () => unknown }) => void) =>
      mockDocs.forEach((doc: unknown) => callback(mapMockDoc(doc))),
  })),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  startAfter: vi.fn(),
  addDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  writeBatch: vi.fn(() => ({
    set: vi.fn(),
    commit: vi.fn(() => Promise.resolve()),
  })),
  collectionGroup: vi.fn(),
  persistentLocalCache: vi.fn(),
  persistentMultipleTabManager: vi.fn(),
  Timestamp: {
    now: vi.fn(() => ({ toDate: () => new Date() })),
    fromDate: vi.fn((date: Date) => ({ toDate: () => date })),
  },
  FieldValue: {
    serverTimestamp: vi.fn(),
  },
}));
