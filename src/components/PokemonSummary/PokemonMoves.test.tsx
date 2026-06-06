import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PokemonMoves from "./PokemonMoves";

const mockMoves = [
  {
    level: 1,
    name: "Tackle",
    type: "Normal",
    category: "Physical",
    power: 40,
    accuracy: 100,
    pp: 35,
  },
  {
    level: 5,
    name: "Growl",
    type: "Normal",
    category: "Status",
    power: "-",
    accuracy: 100,
    pp: 40,
  },
];

describe("PokemonMoves component", () => {
  it("renders moves with their details", () => {
    render(<PokemonMoves moves={mockMoves} />);

    expect(screen.getByText("Level Up Moves")).toBeInTheDocument();
    expect(screen.getByText("Tackle")).toBeInTheDocument();
    expect(screen.getAllByText("40").length).toBeGreaterThan(0); // power / pp
    expect(screen.getByText("35")).toBeInTheDocument(); // pp
  });

  it("filters moves by search query", () => {
    render(<PokemonMoves moves={mockMoves} />);

    const input = screen.getByPlaceholderText("Search move...");
    fireEvent.change(input, { target: { value: "Growl" } });

    expect(screen.getByText("Growl")).toBeInTheDocument();
    expect(screen.queryByText("Tackle")).not.toBeInTheDocument();
  });

  it("shows fallback text if search yields no results", () => {
    render(<PokemonMoves moves={mockMoves} />);

    const input = screen.getByPlaceholderText("Search move...");
    fireEvent.change(input, { target: { value: "Hyper Beam" } });

    expect(screen.getByText("No moves found.")).toBeInTheDocument();
  });
});
