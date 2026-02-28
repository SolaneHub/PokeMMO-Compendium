import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeAll, afterAll } from "vitest";

import PokemonGrid from "./PokemonGrid";
import { Pokemon } from "@/types/pokemon";

const mockPokemonList = Array.from(
  { length: 45 },
  (_, i) =>
    ({
      name: `Pokemon ${i + 1}`,
      types: ["Normal"],
      baseStats: { hp: 1, atk: 1, def: 1, spa: 1, spd: 1, spe: 1 },
    }) as any as Pokemon
);

describe("PokemonGrid component", () => {
  // Mock IntersectionObserver
  beforeAll(() => {
    class MockIntersectionObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
    window.IntersectionObserver = MockIntersectionObserver as any;
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("renders empty state when list is empty", () => {
    render(
      <PokemonGrid
        pokemonList={[]}
        selectedPokemon={null}
        onSelectPokemon={() => {}}
      />
    );
    expect(screen.getByText("No Pokémon found.")).toBeInTheDocument();
  });

  it("renders a limited number of pokemon initially (pagination)", () => {
    render(
      <PokemonGrid
        pokemonList={mockPokemonList}
        selectedPokemon={null}
        onSelectPokemon={() => {}}
      />
    );

    // Default page size is 40
    expect(screen.getByText("Pokemon 1")).toBeInTheDocument();
    expect(screen.getByText("Pokemon 40")).toBeInTheDocument();
    expect(screen.queryByText("Pokemon 41")).not.toBeInTheDocument();

    expect(screen.getByText("Loading more Pokémon...")).toBeInTheDocument();
  });
});
