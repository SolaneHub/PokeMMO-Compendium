import { render, screen } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { Pokemon } from "@/types/pokemon";

import PokemonGrid from "./PokemonGrid";

const mockPokemonList = Array.from(
  { length: 45 },
  (_, i) =>
    ({
      name: `Pokemon ${i + 1}`,
      types: ["Normal"],
      baseStats: { hp: 1, atk: 1, def: 1, spa: 1, spd: 1, spe: 1 },
    }) as unknown as Pokemon
);

describe("PokemonGrid component", () => {
  // Mock IntersectionObserver
  beforeAll(() => {
    class MockIntersectionObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("renders empty state when list is empty", () => {
    render(
      <PokemonGrid
        pokemonList={[]}
        selectedPokemon={null}
        onSelectPokemon={vi.fn()}
      />
    );
    expect(screen.getByText("No Pokémon found.")).toBeInTheDocument();
  });

  it("renders a limited number of pokemon initially (pagination)", () => {
    render(
      <PokemonGrid
        pokemonList={mockPokemonList}
        selectedPokemon={null}
        onSelectPokemon={vi.fn()}
      />
    );

    // Default page size is 40
    expect(screen.getByText("Pokemon 1")).toBeInTheDocument();
    expect(screen.getByText("Pokemon 40")).toBeInTheDocument();
    expect(screen.queryByText("Pokemon 41")).not.toBeInTheDocument();

    expect(screen.getByText("Loading more Pokémon...")).toBeInTheDocument();
  });
});
