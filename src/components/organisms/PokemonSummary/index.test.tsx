import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { PokedexContext, PokedexContextType } from "@/context/PokedexContext";
import { Move, Pokemon } from "@/types/pokemon";

import PokemonSummary from "./index";

const mockPokemon: Pokemon = {
  id: 1,
  dexId: 1,
  name: "Bulbasaur",
  types: ["Grass", "Poison"],
  category: "Seed Pokémon",
  description:
    "A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.",
  baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
  typeDefenses: {},
  moves: [{ name: "Tackle", level: 1, method: "level-up" } as Move],
  locations: [],
};

const mockContextValue: Partial<PokedexContextType> = {
  fullList: [mockPokemon],
  isLoading: false,
  getPokemonDetails: vi.fn().mockResolvedValue(mockPokemon),
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <PokedexContext.Provider value={mockContextValue as PokedexContextType}>
        {ui}
      </PokedexContext.Provider>
    </MemoryRouter>
  );
};

describe("PokemonSummary component", () => {
  it("renders null if pokemon is missing", () => {
    const { container } = renderWithProviders(
      <PokemonSummary
        pokemon={null}
        allPokemon={[]}
        onClose={vi.fn()}
        onSelectPokemon={vi.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders overview initially", async () => {
    renderWithProviders(
      <PokemonSummary
        pokemon={mockPokemon}
        allPokemon={[mockPokemon]}
        onClose={vi.fn()}
        onSelectPokemon={vi.fn()}
      />
    );

    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("#001")).toBeInTheDocument();
    expect(screen.getByText("OVERVIEW")).toBeInTheDocument();
    if (mockPokemon.description) {
      expect(screen.getByText(mockPokemon.description)).toBeInTheDocument();
    }
  });

  it("changes tabs when clicked", async () => {
    renderWithProviders(
      <PokemonSummary
        pokemon={mockPokemon}
        allPokemon={[mockPokemon]}
        onClose={vi.fn()}
        onSelectPokemon={vi.fn()}
      />
    );

    const statsTab = screen.getByText("STATS");
    fireEvent.click(statsTab);

    await waitFor(() => {
      expect(screen.getByText("hp")).toBeInTheDocument();
      expect(screen.getByText("atk")).toBeInTheDocument();
    });
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    renderWithProviders(
      <PokemonSummary
        pokemon={mockPokemon}
        allPokemon={[mockPokemon]}
        onClose={handleClose}
        onSelectPokemon={vi.fn()}
      />
    );

    const closeBtn = screen.getByLabelText("Close summary");
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });
});
