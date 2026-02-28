import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import BallSelector from "./BallSelector";

describe("BallSelector component", () => {
  it("renders the selected ball and its multiplier", () => {
    render(<BallSelector selectedBall="Ultra Ball" onSelect={vi.fn()} />);
    expect(screen.getByText("Ultra Ball")).toBeInTheDocument();
    expect(screen.getByText(/x2 rate/i)).toBeInTheDocument();
  });

  it("filters balls when typing in search input", () => {
    render(<BallSelector selectedBall="Poké Ball" onSelect={vi.fn()} />);

    // Open dropdown
    fireEvent.click(screen.getByText("Poké Ball"));

    const searchInput = screen.getByPlaceholderText("Find a ball...");
    fireEvent.change(searchInput, { target: { value: "Master" } });

    // It should show Master Ball and hide others
    expect(screen.getByText("Master Ball")).toBeInTheDocument();
    expect(screen.queryByText("Ultra Ball")).not.toBeInTheDocument();
  });

  it("calls onSelect when a ball is chosen", () => {
    const handleSelect = vi.fn();
    render(<BallSelector selectedBall="Poké Ball" onSelect={handleSelect} />);

    fireEvent.click(screen.getByText("Poké Ball")); // Open dropdown
    fireEvent.click(screen.getByText("Ultra Ball")); // Select option

    expect(handleSelect).toHaveBeenCalledWith("Ultra Ball");
  });

  it("displays 'No balls found' if search yields no results", () => {
    render(<BallSelector selectedBall="Poké Ball" onSelect={vi.fn()} />);
    fireEvent.click(screen.getByText("Poké Ball"));

    const searchInput = screen.getByPlaceholderText("Find a ball...");
    fireEvent.change(searchInput, { target: { value: "NonExistentBall" } });

    expect(screen.getByText("No balls found")).toBeInTheDocument();
  });
});
