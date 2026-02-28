import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Pokemon } from "@/types/pokemon";

import RaidModal from "./index";

const mockRaid = {
  name: "Rayquaza",
  stars: 5,
  moves: [],
  teamStrategies: [],
  mechanics: {
    ability: "Air Lock",
  },
};

const mockPokemonMap = new Map<string, Pokemon>();

describe("RaidModal component", () => {
  it("renders null if currentRaid is not provided", () => {
    const { container } = render(
      <RaidModal
        raidName="Rayquaza"
        onClose={() => {
          /* noop */
        }}
        pokemonMap={mockPokemonMap}
        currentRaid={null}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders modal header with boss name and stars", () => {
    render(
      <RaidModal
        raidName="Rayquaza"
        onClose={() => {
          /* noop */
        }}
        pokemonMap={mockPokemonMap}
        currentRaid={mockRaid}
      />
    );
    expect(screen.getByText("Rayquaza")).toBeInTheDocument();
    expect(screen.getByText("5★ Raid")).toBeInTheDocument();
  });

  it("switches tabs correctly", () => {
    render(
      <RaidModal
        raidName="Rayquaza"
        onClose={() => {
          /* noop */
        }}
        pokemonMap={mockPokemonMap}
        currentRaid={mockRaid}
      />
    );

    // Initially on STRATEGY tab
    expect(screen.getByText("No strategy data available.")).toBeInTheDocument();

    // Switch to MECHANICS tab
    fireEvent.click(screen.getByText("MECHANICS"));
    expect(screen.getByText("Air Lock")).toBeInTheDocument();
  });

  it("calls onClose when the background overlay is clicked", () => {
    const handleClose = vi.fn();
    const { container } = render(
      <RaidModal
        raidName="Rayquaza"
        onClose={handleClose}
        pokemonMap={mockPokemonMap}
        currentRaid={mockRaid}
      />
    );

    // The outermost div is the background overlay
    const overlay = container.firstElementChild as HTMLElement;
    fireEvent.click(overlay);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
