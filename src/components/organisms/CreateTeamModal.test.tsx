import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import CreateTeamModal from "./CreateTeamModal";

// useActionState is mocked to just return the state and a sync function
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    useActionState: vi.fn((submitFn, initialState) => {
      // Mock returning [state, actionFormFn, isPending]
      return [initialState, submitFn, false];
    }),
  };
});

describe("CreateTeamModal component", () => {
  it("renders correctly", () => {
    render(
      <CreateTeamModal
        onClose={() => {
          /* noop */
        }}
        onSubmit={async () => ({})}
      />
    );
    expect(screen.getByText("Create New Team")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("e.g. My Kanto Farm Team")
    ).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", () => {
    const handleClose = vi.fn();
    render(
      <CreateTeamModal onClose={handleClose} onSubmit={async () => ({})} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
