import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Pokemon } from "@/types/pokemon";

import PokemonSelection from "./PokemonSelection";

const mockMap = new Map<string, Pokemon>();
mockMap.set("Pikachu", {
  name: "Pikachu",
  types: ["Electric"],
  baseStats: { hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90 },
  abilities: { main: ["Static"], hidden: null },
  moves: [],
  evolutions: [],
  locations: [],
} as unknown as Pokemon);

describe("PokemonSelection component", () => {
  it("renders the title", () => {
    render(
      <PokemonSelection
        pokemonNames={[]}
        selectedPokemon={null}
        onPokemonClick={vi.fn()}
        pokemonMap={mockMap}
      />
    );
    expect(screen.getByText("Select Opponent Pokémon")).toBeInTheDocument();
  });

  it("renders a card for each pokemon name", () => {
    render(
      <PokemonSelection
        pokemonNames={["Pikachu", "Raichu"]}
        selectedPokemon={null}
        onPokemonClick={vi.fn()}
        pokemonMap={mockMap}
      />
    );
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    expect(screen.getByText("Raichu")).toBeInTheDocument();
  });

  it("calls onPokemonClick when a card is clicked", () => {
    const handleClick = vi.fn();
    render(
      <PokemonSelection
        pokemonNames={["Pikachu"]}
        selectedPokemon={null}
        onPokemonClick={handleClick}
        pokemonMap={mockMap}
      />
    );

    // The PokemonCard renders a div with role="button" when onClick is provided
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledWith("Pikachu");
  });
});
