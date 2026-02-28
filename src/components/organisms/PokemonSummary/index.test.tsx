import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PokemonSummary from "./index";
import { Pokemon } from "@/types/pokemon";

vi.mock("@/context/PokedexContext", () => ({
  usePokedexContext: () => ({
    getPokemonDetails: vi.fn().mockResolvedValue({
      name: "Bulbasaur",
      id: 1,
      moves: [{ name: "Tackle" }],
      baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
      types: ["Grass", "Poison"],
    }),
  }),
}));

const mockPokemon: Pokemon = {
  name: "Bulbasaur",
  id: 1,
  types: ["Grass", "Poison"],
  category: "Seed Pokemon",
  baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
  abilities: { main: ["Overgrow"] },
  moves: [],
  evolutions: [],
  locations: [],
};

describe("PokemonSummary component", () => {
  it("renders null if pokemon is missing", () => {
    const { container } = render(
      <PokemonSummary
        pokemon={null}
        allPokemon={[]}
        onClose={() => {}}
        onSelectPokemon={() => {}}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders overview initially", () => {
    render(
      <PokemonSummary
        pokemon={mockPokemon}
        allPokemon={[]}
        onClose={() => {}}
        onSelectPokemon={() => {}}
      />
    );
    // Pokedex ID and name
    expect(screen.getByText("#001")).toBeInTheDocument();
    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();

    // Check if category is rendered
    expect(screen.getByText("Seed Pokemon")).toBeInTheDocument();

    // Overview tab should be active
    const overviewTab = screen.getByText("OVERVIEW");
    expect(overviewTab).toHaveClass("text-blue-400"); // active class from Tabs molecule
  });

  it("changes tabs when clicked", () => {
    render(
      <PokemonSummary
        pokemon={mockPokemon}
        allPokemon={[]}
        onClose={() => {}}
        onSelectPokemon={() => {}}
      />
    );

    const statsTab = screen.getByText("STATS");
    fireEvent.click(statsTab);

    expect(statsTab).toHaveClass("text-blue-400");
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <PokemonSummary
        pokemon={mockPokemon}
        allPokemon={[]}
        onClose={handleClose}
        onSelectPokemon={() => {}}
      />
    );

    fireEvent.click(screen.getByText("×"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
