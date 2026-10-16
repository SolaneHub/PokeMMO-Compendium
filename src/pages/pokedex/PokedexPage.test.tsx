import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as PokedexContext from "@/context/PokedexContext";
import { createMockPokedexContext, createMockPokemon } from "@/test/factories";
import { Pokemon } from "@/types/pokemon";

import PokedexPage from "./PokedexPage";

// Mocking dependencies
vi.mock("@/context/PokedexContext");

// Mocking organisms to simplify
vi.mock("@/components/PokemonGrid", () => ({
  default: ({
    pokemonList,
    onSelectPokemon,
  }: {
    pokemonList: Pokemon[];
    onSelectPokemon: (p: Pokemon) => void;
  }) => (
    <div data-testid="pokemon-grid">
      {pokemonList.map((p) => (
        <button key={p.name} onClick={() => onSelectPokemon(p)}>
          {p.name}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("@/components/PokemonSummary", () => ({
  default: ({
    pokemon,
    onClose,
  }: {
    pokemon: Pokemon;
    onClose: () => void;
  }) => (
    <div data-testid="pokemon-summary">
      <span>Summary for {pokemon.name}</span>
      <button onClick={onClose}>Close Summary</button>
    </div>
  ),
}));

describe("PokedexPage", () => {
  const mockPokemon: Pokemon[] = [
    createMockPokemon({ name: "Bulbasaur", types: ["Grass", "Poison"] }),
    createMockPokemon({ name: "Ivysaur", types: ["Grass"] }),
    createMockPokemon({ name: "Charmander", types: ["Fire"] }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(PokedexContext.usePokedexContext).mockReturnValue(
      createMockPokedexContext({ fullList: mockPokemon, isLoading: false })
    );
  });

  it("shows loading state", () => {
    vi.mocked(PokedexContext.usePokedexContext).mockReturnValue(
      createMockPokedexContext({ isLoading: true, fullList: [] })
    );
    render(<PokedexPage />);
    expect(screen.getByText("Loading Pokémon data...")).toBeInTheDocument();
  });

  it("renders grid and handles search and selection", () => {
    render(
      <MemoryRouter>
        <PokedexPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Pokédex")).toBeInTheDocument();
    expect(screen.getByTestId("pokemon-grid")).toBeInTheDocument();
    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();

    // Search
    const searchInput = screen.getByPlaceholderText("Search Pokémon...");
    fireEvent.change(searchInput, { target: { value: "Char" } });

    expect(screen.getByText("Charmander")).toBeInTheDocument();
    expect(screen.queryByText("Bulbasaur")).not.toBeInTheDocument();

    // Selection
    fireEvent.click(screen.getByText("Charmander"));
    expect(screen.getByTestId("pokemon-summary")).toBeInTheDocument();
    expect(screen.getByText("Summary for Charmander")).toBeInTheDocument();

    // Close summary
    fireEvent.click(screen.getByText("Close Summary"));
    expect(screen.queryByTestId("pokemon-summary")).not.toBeInTheDocument();
  });
});
