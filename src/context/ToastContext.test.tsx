import { act, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ToastProvider, useToast } from "./ToastContext";

describe("ToastContext", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("throws error if useToast is used outside of ToastProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {
      // Mock console.error
    });
    expect(() => renderHook(() => useToast())).toThrow(
      "useToast must be used within a ToastProvider"
    );
    consoleError.mockRestore();
  });

  it("shows a toast and then it disappears after duration", async () => {
    const TestComponent = () => {
      const showToast = useToast();
      return (
        <button onClick={() => showToast("Test Message", "success", 1000)}>
          Show Toast
        </button>
      );
    };

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText("Show Toast");
    act(() => {
      button.click();
    });

    expect(screen.getByText("Test Message")).toBeInTheDocument();
    expect(screen.getByText("Test Message")).toHaveClass("bg-green-500");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText("Test Message")).not.toBeInTheDocument();
  });

  it("shows multiple toasts with different types", () => {
    const TestComponent = () => {
      const showToast = useToast();
      return (
        <div>
          <button onClick={() => showToast("Success Msg", "success")}>
            Btn Success
          </button>
          <button onClick={() => showToast("Error Msg", "error")}>
            Btn Error
          </button>
          <button onClick={() => showToast("Info Msg", "info")}>
            Btn Info
          </button>
        </div>
      );
    };

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      screen.getByText("Btn Success").click();
    });
    act(() => {
      vi.advanceTimersByTime(10);
      screen.getByText("Btn Error").click();
    });
    act(() => {
      vi.advanceTimersByTime(10);
      screen.getByText("Btn Info").click();
    });

    expect(screen.getByText("Success Msg")).toHaveClass("bg-green-500");
    expect(screen.getByText("Error Msg")).toHaveClass("bg-red-500");
    expect(screen.getByText("Info Msg")).toHaveClass("bg-blue-500");
  });
});
