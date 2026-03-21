import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as PokedexHooks from "@/hooks/usePokedexData";
import { Pokemon } from "@/types/pokemon";

import PokedexPage from "./PokedexPage";

// Mocking dependencies
vi.mock("@/hooks/usePokedexData");

// Mocking organisms to simplify
vi.mock("@/components/organisms/PokemonGrid", () => ({
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

vi.mock("@/components/organisms/PokemonSummary", () => ({
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
    { name: "Bulbasaur", types: ["Grass"] } as Pokemon,
    { name: "Ivysaur", types: ["Grass"] } as Pokemon,
    { name: "Charmander", types: ["Fire"] } as Pokemon,
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(PokedexHooks.usePokedexData).mockReturnValue({
      fullList: mockPokemon,
      isLoading: false,
    } as unknown as PokedexHooks.UsePokedexDataReturn);
  });

  it("shows loading state", () => {
    vi.mocked(PokedexHooks.usePokedexData).mockReturnValue({
      isLoading: true,
      fullList: [],
    } as unknown as PokedexHooks.UsePokedexDataReturn);
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
