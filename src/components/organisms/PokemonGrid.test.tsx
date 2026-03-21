import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Pokemon } from "@/types/pokemon";

import PokemonGrid from "./PokemonGrid";

// Mocking IntersectionObserver as a class
beforeEach(() => {
  global.IntersectionObserver = class {
    observe() {
      return vi.fn();
    }
    unobserve() {
      return vi.fn();
    }
    disconnect() {
      return vi.fn();
    }
  } as unknown as typeof IntersectionObserver;
});

// Mocking PokemonCard
vi.mock("@/components/molecules/PokemonCard", () => ({
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
    { id: "1", name: "Bulbasaur", types: ["Grass"] } as unknown as Pokemon,
    { id: "2", name: "Ivysaur", types: ["Grass"] } as unknown as Pokemon,
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
});
