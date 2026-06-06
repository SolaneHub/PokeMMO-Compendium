import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Pokemon } from "@/types/pokemon";

import TargetSection from "./TargetSection";

describe("TargetSection", () => {
  const mockPokemon: Pokemon[] = [
    { name: "Pikachu", catchRate: 190 } as Pokemon,
    { name: "Bulbasaur", catchRate: 45 } as Pokemon,
  ];

  const mockProps = {
    searchTerm: "",
    setSearchTerm: vi.fn(),
    isSearchOpen: false,
    setIsSearchOpen: vi.fn(),
    isPending: false,
    filteredPokemon: mockPokemon,
    selectedPokemonName: "",
    setSelectedPokemonName: vi.fn(),
    setDeferredSearchTerm: vi.fn(),
    startTransition: (cb: () => void) => cb(),
    searchRef: { current: null } as React.RefObject<HTMLDivElement | null>,
    selectedPokemon: null as Pokemon | null,
    sprite: null,
    background: "transparent",
    baseCatchRate: 0,
  };

  it("renders search input", () => {
    render(<TargetSection {...mockProps} />);
    expect(
      screen.getByPlaceholderText("Search Pokémon...")
    ).toBeInTheDocument();
  });

  it("calls setIsSearchOpen on focus", () => {
    render(<TargetSection {...mockProps} />);
    const input = screen.getByPlaceholderText("Search Pokémon...");
    fireEvent.focus(input);
    expect(mockProps.setIsSearchOpen).toHaveBeenCalledWith(true);
  });

  it("calls setSearchTerm and setDeferredSearchTerm on change", () => {
    render(<TargetSection {...mockProps} />);
    const input = screen.getByPlaceholderText("Search Pokémon...");
    fireEvent.change(input, { target: { value: "Pika" } });
    expect(mockProps.setSearchTerm).toHaveBeenCalledWith("Pika");
    expect(mockProps.setDeferredSearchTerm).toHaveBeenCalledWith("Pika");
  });

  it("renders filtered pokemon list when search is open", () => {
    render(<TargetSection {...mockProps} isSearchOpen={true} />);
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
  });

  it("calls setSelectedPokemonName and closes search when a pokemon is clicked", () => {
    render(<TargetSection {...mockProps} isSearchOpen={true} />);
    const pikachuBtn = screen.getByText("Pikachu");
    fireEvent.click(pikachuBtn);
    expect(mockProps.setSelectedPokemonName).toHaveBeenCalledWith("Pikachu");
    expect(mockProps.setIsSearchOpen).toHaveBeenCalledWith(false);
  });

  it("renders selected pokemon preview when selectedPokemon is provided", () => {
    const selectedPokemon = { name: "Pikachu", catchRate: 190 } as Pokemon;
    render(
      <TargetSection
        {...mockProps}
        selectedPokemon={selectedPokemon}
        selectedPokemonName="Pikachu"
        baseCatchRate={190}
        sprite="pikachu.png"
      />
    );
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    expect(screen.getByText("190")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "pikachu.png");
  });
});
