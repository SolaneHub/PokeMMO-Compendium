import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createMockPokemon } from "@/test/factories";
import { Pokemon } from "@/types/pokemon";

import PokemonGrid from "./PokemonGrid";

// Mocking PokemonCard
vi.mock("@/components/PokemonCard", () => ({
  default: ({
    pokemonName,
    onClick,
  }: {
    pokemonName: string;
    onClick: () => void;
  }) => <button onClick={onClick}>{pokemonName}</button>,
}));

describe("PokemonGrid", () => {
  const mockPokemon: Pokemon[] = [
    createMockPokemon({ id: "1", name: "Bulbasaur", types: ["Grass"] }),
    createMockPokemon({ id: "2", name: "Ivysaur", types: ["Grass"] }),
  ];

  const defaultProps = {
    pokemonList: mockPokemon,
    selectedPokemon: null,
    onSelectPokemon: vi.fn(),
    isPending: false,
  };

  it("renders the list of pokemon", () => {
    render(<PokemonGrid {...defaultProps} />);
    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("Ivysaur")).toBeInTheDocument();
  });

  it("calls onSelectPokemon when a card is clicked", () => {
    render(<PokemonGrid {...defaultProps} />);
    fireEvent.click(screen.getByText("Bulbasaur"));
    expect(defaultProps.onSelectPokemon).toHaveBeenCalledWith(mockPokemon[0]);
  });

  it("shows pending state", () => {
    const { container } = render(
      <PokemonGrid {...defaultProps} isPending={true} />
    );
    const gridDiv = container.querySelector(".opacity-50");
    expect(gridDiv).toBeInTheDocument();
  });

  it("renders empty state when list is empty", () => {
    render(<PokemonGrid {...defaultProps} pokemonList={[]} />);
    expect(screen.getByText(/No Pokémon found/i)).toBeInTheDocument();
  });

  it("resets visibleCount and scrolls to top when pokemonList changes", () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    const manyPokemon: Pokemon[] = Array.from({ length: 60 }, (_, i) =>
      createMockPokemon({
        id: `${i + 1}`,
        name: `Pokemon ${i + 1}`,
        types: ["Normal"],
      })
    );

    const { rerender } = render(
      <PokemonGrid {...defaultProps} pokemonList={manyPokemon} />
    );
    expect(screen.getAllByRole("button")).toHaveLength(40);
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });

    // Update list to 10 pokemon
    const fewPokemon = manyPokemon.slice(0, 10);
    rerender(<PokemonGrid {...defaultProps} pokemonList={fewPokemon} />);
    expect(screen.getAllByRole("button")).toHaveLength(10);
    expect(scrollToMock).toHaveBeenCalledTimes(2);
  });
});
