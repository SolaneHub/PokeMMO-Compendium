import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Pokemon } from "@/types/pokemon";

import PokemonEvolutions from "./PokemonEvolutions";

const mockPokemon: Pokemon = {
  id: 2,
  name: "Ivysaur",
  types: ["Grass", "Poison"],
  baseStats: { hp: 1, atk: 1, def: 1, spa: 1, spd: 1, spe: 1 },
  abilities: { main: [], hidden: null },
  moves: [],
  locations: [],
  evolutions: [
    { name: "Bulbasaur" },
    { name: "Ivysaur", level: 16 },
    { name: "Venusaur", level: 32 },
  ],
};

const allPokemonMock: Pokemon[] = [
  { ...mockPokemon, name: "Bulbasaur", evolutions: [] },
  mockPokemon,
  { ...mockPokemon, name: "Venusaur", evolutions: [] },
  { ...mockPokemon, name: "Mega Venusaur", evolutions: [] },
];

describe("PokemonEvolutions component", () => {
  it("renders the evolution tree with current active state", () => {
    render(
      <PokemonEvolutions
        pokemon={mockPokemon}
        allPokemon={allPokemonMock}
        onSelectPokemon={() => {
          /* noop */
        }}
        variants={[]}
      />
    );
    expect(screen.getByText("Evolution Tree")).toBeInTheDocument();

    // Check all evolutions are rendered
    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("Ivysaur")).toBeInTheDocument();
    expect(screen.getByText("Venusaur")).toBeInTheDocument();

    // Check level constraints
    expect(screen.getByText("16")).toBeInTheDocument();
    expect(screen.getByText("32")).toBeInTheDocument();

    // Check active styling for Ivysaur (blue text)
    const ivysaurText = screen.getByText("Ivysaur");
    expect(ivysaurText).toHaveClass("text-blue-400");
  });

  it("renders alternative forms if provided", () => {
    render(
      <PokemonEvolutions
        pokemon={{ ...mockPokemon, name: "Venusaur" }}
        allPokemon={allPokemonMock}
        onSelectPokemon={() => {
          /* noop */
        }}
        variants={["Mega Venusaur"]}
      />
    );

    expect(screen.getByText("Alternative Forms")).toBeInTheDocument();
    expect(screen.getByText("Mega Venusaur")).toBeInTheDocument();
  });

  it("calls onSelectPokemon when another evolution is clicked", () => {
    const handleSelect = vi.fn();
    render(
      <PokemonEvolutions
        pokemon={mockPokemon}
        allPokemon={allPokemonMock}
        onSelectPokemon={handleSelect}
        variants={[]}
      />
    );

    // Click on Venusaur container
    const venusaurBtn = screen.getByText("Venusaur").closest("div.group");
    if (venusaurBtn) {
      fireEvent.click(venusaurBtn);
    }

    // Should call with Venusaur's pokemon object
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Venusaur" })
    );
  });
});
