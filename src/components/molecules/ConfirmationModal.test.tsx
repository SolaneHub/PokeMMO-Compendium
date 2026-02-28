import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ConfirmationModal from "./ConfirmationModal";

describe("ConfirmationModal component", () => {
  it("renders with correct text props", () => {
    render(
      <ConfirmationModal
        title="Delete Team"
        message="Are you sure you want to delete this team?"
        confirmText="Yes, delete"
        cancelText="No, cancel"
        onConfirm={() => {
          /* noop */
        }}
        onCancel={() => {
          /* noop */
        }}
      />
    );

    expect(screen.getByText("Delete Team")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this team?")
    ).toBeInTheDocument();
    expect(screen.getByText("Yes, delete")).toBeInTheDocument();
    expect(screen.getByText("No, cancel")).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    const handleConfirm = vi.fn();
    render(
      <ConfirmationModal
        title="Title"
        message="Message"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={() => {
          /* noop */
        }}
      />
    );

    fireEvent.click(screen.getByText("Confirm"));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button is clicked", () => {
    const handleCancel = vi.fn();
    render(
      <ConfirmationModal
        title="Title"
        message="Message"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={() => {
          /* noop */
        }}
        onCancel={handleCancel}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});
