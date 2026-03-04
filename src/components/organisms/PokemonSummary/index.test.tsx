import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Pokemon } from "@/types/pokemon";

import PokemonSummary from "./index";

vi.mock("@/context/PokedexContext", () => ({
  usePokedexContext: () => ({
    getPokemonDetails: vi.fn().mockResolvedValue({
      name: "Bulbasaur",
      id: 1,
      category: "Seed Pokemon",
      description: "A strange seed was planted on its back at birth.",
      moves: [{ name: "Tackle" }],
      baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
      types: ["Grass", "Poison"],
      abilities: { main: ["Overgrow"], hidden: null },
      evolutions: [],
      locations: [],
    }),
  }),
}));

const mockPokemon: Pokemon = {
  name: "Bulbasaur",
  id: 1,
  types: ["Grass", "Poison"],
  category: "Seed Pokemon",
  baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
  abilities: { main: ["Overgrow"], hidden: null },
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
        onClose={() => {
          /* noop */
        }}
        onSelectPokemon={() => {
          /* noop */
        }}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders overview initially", async () => {
    render(
      <PokemonSummary
        pokemon={mockPokemon}
        allPokemon={[]}
        onClose={() => {
          /* noop */
        }}
        onSelectPokemon={() => {
          /* noop */
        }}
      />
    );
    // Pokedex ID and name - use findBy to wait for potential async updates
    expect(await screen.findByText("#001")).toBeInTheDocument();
    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();

    // Check if category is rendered
    expect(screen.getByText("Seed Pokemon")).toBeInTheDocument();

    // Wait for async description to confirm fetch finished
    expect(
      await screen.findByText("A strange seed was planted on its back at birth.")
    ).toBeInTheDocument();

    // Overview tab should be active
    const overviewTab = screen.getByText("OVERVIEW");
    expect(overviewTab).toHaveClass("text-blue-400"); // active class from Tabs molecule
  });

  it("changes tabs when clicked", async () => {
    const user = userEvent.setup();
    render(
      <PokemonSummary
        pokemon={mockPokemon}
        allPokemon={[]}
        onClose={() => {
          /* noop */
        }}
        onSelectPokemon={() => {
          /* noop */
        }}
      />
    );

    // Wait for initial load to avoid act warnings
    await screen.findByText("A strange seed was planted on its back at birth.");

    const statsTab = screen.getByText("STATS");
    await user.click(statsTab);

    expect(statsTab).toHaveClass("text-blue-400");
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <PokemonSummary
        pokemon={mockPokemon}
        allPokemon={[]}
        onClose={handleClose}
        onSelectPokemon={() => {
          /* noop */
        }}
      />
    );

    // Wait for initial load
    await screen.findByText("A strange seed was planted on its back at birth.");

    await user.click(screen.getByText("×"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
