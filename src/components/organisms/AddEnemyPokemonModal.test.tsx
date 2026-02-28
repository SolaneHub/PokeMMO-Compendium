import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AddEnemyPokemonModal from "./AddEnemyPokemonModal";

vi.mock("@/hooks/usePokedexData", () => ({
  usePokedexData: () => ({
    pokemonNames: ["Pikachu", "Bulbasaur", "Charizard", "Sawsbuck (Spring)"],
  }),
}));

describe("AddEnemyPokemonModal component", () => {
  it("renders null if not open", () => {
    const { container } = render(
      <AddEnemyPokemonModal
        isOpen={false}
        onClose={() => {}}
        onAdd={() => {}}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the modal when open", () => {
    render(
      <AddEnemyPokemonModal isOpen={true} onClose={() => {}} onAdd={() => {}} />
    );
    expect(screen.getByText("Add Enemy Pokémon")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search Pokémon...")
    ).toBeInTheDocument();
  });

  it("renders the list of pokemon", () => {
    render(
      <AddEnemyPokemonModal isOpen={true} onClose={() => {}} onAdd={() => {}} />
    );
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
  });

  it("filters pokemon based on search input", () => {
    render(
      <AddEnemyPokemonModal isOpen={true} onClose={() => {}} onAdd={() => {}} />
    );
    const searchInput = screen.getByPlaceholderText("Search Pokémon...");

    fireEvent.change(searchInput, { target: { value: "Char" } });

    expect(screen.getByText("Charizard")).toBeInTheDocument();
    expect(screen.queryByText("Pikachu")).not.toBeInTheDocument();
  });

  it("calls onAdd and onClose when a pokemon is selected", () => {
    const handleAdd = vi.fn();
    const handleClose = vi.fn();

    render(
      <AddEnemyPokemonModal
        isOpen={true}
        onClose={handleClose}
        onAdd={handleAdd}
      />
    );

    fireEvent.click(screen.getByText("Pikachu").closest("button")!);

    expect(handleAdd).toHaveBeenCalledWith("Pikachu");
    expect(handleClose).toHaveBeenCalled();
  });
});
