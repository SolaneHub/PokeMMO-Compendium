import { act, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ConfirmationProvider, useConfirm } from "./ConfirmationContext";

// Mock ConfirmationModal to simplify testing the context logic
vi.mock("@/components/molecules/ConfirmationModal", () => ({
  default: ({
    title,
    message,
    onConfirm,
    onCancel,
  }: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }) => (
    <div data-testid="confirmation-modal">
      <h1>{title}</h1>
      <p>{message}</p>
      <button onClick={onConfirm}>Confirm Btn</button>
      <button onClick={onCancel}>Cancel Btn</button>
    </div>
  ),
}));

describe("ConfirmationContext", () => {
  it("throws error if useConfirm is used outside of ConfirmationProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {
      // Mock console.error
    });
    expect(() => renderHook(() => useConfirm())).toThrow(
      "useConfirm must be used within a ConfirmationProvider"
    );
    consoleError.mockRestore();
  });

  it("resolves true when confirm button is clicked", async () => {
    let result: boolean | null = null;
    const TestComponent = () => {
      const confirm = useConfirm();
      return (
        <button
          onClick={async () => {
            result = await confirm({
              title: "Are you sure?",
              message: "Delete this?",
            });
          }}
        >
          Open Confirm
        </button>
      );
    };

    render(
      <ConfirmationProvider>
        <TestComponent />
      </ConfirmationProvider>
    );

    const openBtn = screen.getByText("Open Confirm");
    await act(async () => {
      openBtn.click();
    });

    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();

    const confirmBtn = screen.getByText("Confirm Btn");
    await act(async () => {
      confirmBtn.click();
    });

    expect(result).toBe(true);
    expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();
  });

  it("resolves false when cancel button is clicked", async () => {
    let result: boolean | null = null;
    const TestComponent = () => {
      const confirm = useConfirm();
      return (
        <button
          onClick={async () => {
            result = await confirm({ title: "Sure?", message: "Cancel this?" });
          }}
        >
          Open Confirm
        </button>
      );
    };

    render(
      <ConfirmationProvider>
        <TestComponent />
      </ConfirmationProvider>
    );

    const openBtn = screen.getByText("Open Confirm");
    await act(async () => {
      openBtn.click();
    });

    const cancelBtn = screen.getByText("Cancel Btn");
    await act(async () => {
      cancelBtn.click();
    });

    expect(result).toBe(false);
    expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();
  });

  it("does not allow opening multiple modals simultaneously", async () => {
    let result2: boolean | null = null;
    const TestComponent = () => {
      const confirm = useConfirm();
      return (
        <div>
          <button
            onClick={async () => {
              await confirm({ title: "Title 1", message: "Msg 1" });
            }}
          >
            Open 1
          </button>
          <button
            onClick={async () => {
              result2 = await confirm({ title: "Title 2", message: "Msg 2" });
            }}
          >
            Open 2
          </button>
        </div>
      );
    };

    render(
      <ConfirmationProvider>
        <TestComponent />
      </ConfirmationProvider>
    );

    await act(async () => {
      screen.getByText("Open 1").click();
    });

    // Try to open second one while first is open
    await act(async () => {
      screen.getByText("Open 2").click();
    });

    expect(result2).toBe(false); // Second one should resolve immediately to false
    expect(screen.getByText("Title 1")).toBeInTheDocument(); // First one should still be there
  });
});
