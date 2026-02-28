import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PokemonSearchSelect from "./PokemonSearchSelect";

const mockPokemonList = [
  { name: "Pikachu", types: [] },
  { name: "Pidgey", types: [] },
  { name: "Bulbasaur", types: [] },
] as any[];

describe("PokemonSearchSelect component", () => {
  it("renders search input", () => {
    render(
      <PokemonSearchSelect allPokemon={mockPokemonList} onSelect={() => {}} />
    );
    expect(
      screen.getByPlaceholderText("Search Pokemon to add...")
    ).toBeInTheDocument();
  });

  it("filters and displays pokemon based on query", () => {
    render(
      <PokemonSearchSelect allPokemon={mockPokemonList} onSelect={() => {}} />
    );

    const input = screen.getByPlaceholderText("Search Pokemon to add...");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Pi" } });

    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    expect(screen.getByText("Pidgey")).toBeInTheDocument();
    expect(screen.queryByText("Bulbasaur")).not.toBeInTheDocument();
  });

  it("excludes pokemon based on excludeNames prop", () => {
    render(
      <PokemonSearchSelect
        allPokemon={mockPokemonList}
        onSelect={() => {}}
        excludeNames={["Pikachu"]}
      />
    );

    const input = screen.getByPlaceholderText("Search Pokemon to add...");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Pi" } });

    expect(screen.getByText("Pidgey")).toBeInTheDocument();
    expect(screen.queryByText("Pikachu")).not.toBeInTheDocument();
  });

  it("calls onSelect when an option is clicked", () => {
    const handleSelect = vi.fn();
    render(
      <PokemonSearchSelect
        allPokemon={mockPokemonList}
        onSelect={handleSelect}
      />
    );

    const input = screen.getByPlaceholderText("Search Pokemon to add...");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Pikachu" } });

    fireEvent.click(screen.getByText("Pikachu"));
    expect(handleSelect).toHaveBeenCalledWith("Pikachu");
  });
});
