import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Pokemon } from "@/types/pokemon";

import PokemonOverview from "./PokemonOverview";

const mockPokemon: Pokemon = {
  id: 1,
  name: "Snorlax",
  description: "It sleeps constantly.",
  types: ["Normal"],
  baseStats: { hp: 160, atk: 110, def: 65, spa: 65, spd: 110, spe: 30 },
  abilities: { main: ["Immunity", "Thick Fat"], hidden: "Gluttony" },
  height: "2.1m",
  weight: "460.0kg",
  catchRate: 25,
  eggGroups: ["Monster"],
  heldItems: ["Leftovers"],
  moves: [],
  locations: [],
  evolutions: [],
};

describe("PokemonOverview component", () => {
  it("renders description and basic info", () => {
    render(<PokemonOverview pokemon={mockPokemon} />);

    expect(screen.getByText("It sleeps constantly.")).toBeInTheDocument();
    expect(screen.getByText("Immunity")).toBeInTheDocument();
    expect(screen.getByText("Thick Fat")).toBeInTheDocument();

    // Hidden ability has a small tag
    expect(screen.getByText("Gluttony")).toBeInTheDocument();
    expect(screen.getByText("Hidden")).toBeInTheDocument();
  });

  it("renders InfoCards with properties", () => {
    render(<PokemonOverview pokemon={mockPokemon} />);

    expect(screen.getByText("Height")).toBeInTheDocument();
    expect(screen.getByText("2.1m")).toBeInTheDocument();
    expect(screen.getByText("Monster")).toBeInTheDocument(); // Egg group
    expect(screen.getByText("Leftovers")).toBeInTheDocument(); // Held items
  });

  describe("renderHeldItems logic", () => {
    it("handles heldItems as 'None' or null", () => {
      const p = { ...mockPokemon, heldItems: "None" };
      const { rerender } = render(<PokemonOverview pokemon={p as Pokemon} />);
      expect(screen.getAllByText("None").length).toBeGreaterThan(0);

      rerender(
        <PokemonOverview
          pokemon={
            { ...mockPokemon, heldItems: undefined } as unknown as Pokemon
          }
        />
      );
      expect(screen.getAllByText("None").length).toBeGreaterThan(0);
    });

    it("handles heldItems as empty array", () => {
      const p = { ...mockPokemon, heldItems: [] };
      render(<PokemonOverview pokemon={p as Pokemon} />);
      expect(screen.getAllByText("None").length).toBeGreaterThan(0);
    });

    it("handles heldItems as an object/record", () => {
      const p = {
        ...mockPokemon,
        heldItems: { "Choice Scarf": "5%", Leftovers: "1%" },
      };
      render(<PokemonOverview pokemon={p as Pokemon} />);
      expect(screen.getByText(/Choice Scarf/)).toBeInTheDocument();
      expect(screen.getByText("(5%)")).toBeInTheDocument();
      expect(screen.getByText(/Leftovers/)).toBeInTheDocument();
      expect(screen.getByText("(1%)")).toBeInTheDocument();
    });

    it("handles heldItems as an empty object", () => {
      const p = { ...mockPokemon, heldItems: {} };
      render(<PokemonOverview pokemon={p as Pokemon} />);
      expect(screen.getAllByText("None").length).toBeGreaterThan(0);
    });

    it("handles heldItems as a plain string", () => {
      const p = { ...mockPokemon, heldItems: "Choice Band" };
      render(<PokemonOverview pokemon={p as Pokemon} />);
      expect(screen.getByText("Choice Band")).toBeInTheDocument();
    });
  });

  it("handles eggGroups as a plain string", () => {
    const p = { ...mockPokemon, eggGroups: "Undiscovered" };
    render(<PokemonOverview pokemon={p as Pokemon} />);
    expect(screen.getByText("Undiscovered")).toBeInTheDocument();
  });

  it("handles gender ratio defaults", () => {
    const p = { ...mockPokemon, genderRatio: undefined };
    render(<PokemonOverview pokemon={p as Pokemon} />);
    expect(screen.getByText("0% ♂")).toBeInTheDocument();
    expect(screen.getByText("0% ♀")).toBeInTheDocument();
  });
});
