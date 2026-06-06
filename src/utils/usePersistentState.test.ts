import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { usePersistentState } from "./usePersistentState";

describe("usePersistentState hook", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes with provided value if localStorage is empty", () => {
    const { result } = renderHook(() =>
      usePersistentState("test-key", "default")
    );
    expect(result.current[0]).toBe("default");
  });

  it("loads and parses value from localStorage", () => {
    const data = { foo: "bar" };
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

  it("saves value to localStorage on change", () => {
    const { result } = renderHook(() =>
      usePersistentState("test-key", "initial")
    );

    act(() => {
      result.current[1]("new-value");
    });

    const saved = localStorage.getItem("test-key");
    expect(saved).toBe(JSON.stringify("new-value"));
  });
});
