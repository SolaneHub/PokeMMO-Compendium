import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import Shell from "./Shell";

// Mocking Sidebar
vi.mock("@/components/organisms/Sidebar", () => ({
  default: ({
    isOpen,
    setIsOpen,
  }: {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
  }) => (
    <div data-testid="sidebar" className={isOpen ? "open" : "closed"}>
      <button onClick={() => setIsOpen(false)}>Close</button>
    </div>
  ),
}));

describe("Shell", () => {
  it("renders and toggles sidebar on mobile", () => {
    render(
      <MemoryRouter>
        <Shell />
      </MemoryRouter>
    );

    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toHaveClass("closed");

    // Mobile button is only visible if lg:hidden is not active, but we can find it
    const toggleBtn = screen.getByRole("button", { name: "" });
    fireEvent.click(toggleBtn);

    expect(sidebar).toHaveClass("open");
  });
});
