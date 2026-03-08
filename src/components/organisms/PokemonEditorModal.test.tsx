import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PokemonEditorModal from "./PokemonEditorModal";

vi.mock("@/hooks/usePokedexData", () => ({
  usePokedexData: () => ({
    allPokemonData: [
      { id: "1", dexId: 25, name: "Pikachu" },
      { id: "2", dexId: 6, name: "Charizard" },
    ],
  }),
}));

vi.mock("@/context/MovesContext", () => ({
  useMoves: () => ({
    allMoves: [
      { id: "1", name: "Thunderbolt" },
      { id: "2", name: "Quick Attack" },
    ],
  }),
}));

describe("PokemonEditorModal component", () => {
  const initialData = {
    name: "Pikachu",
    item: "Light Ball",
    ability: "Static",
    nature: "Timid",
    evs: "252 SpA / 252 Spe",
    ivs: "6x31",
    moves: ["Thunderbolt", "Quick Attack", "", ""],
  };

  it("renders null if not open", () => {
    const { container } = render(
      <PokemonEditorModal
        isOpen={false}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={null}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders Add Pokémon header and handles empty initial data", () => {
    render(
      <PokemonEditorModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={null}
      />
    );
    expect(screen.getByText("Add Pokémon")).toBeInTheDocument();
  });

  it("renders Edit Pokémon header and populates fields when initialData is provided", () => {
    render(
      <PokemonEditorModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={initialData}
      />
    );
    expect(screen.getByText("Edit Pokémon")).toBeInTheDocument();
    const nameInput = screen.getByPlaceholderText(
      "Search Pokémon..."
    ) as HTMLInputElement;
    expect(nameInput.value).toBe("Pikachu");
  });

  it("calls onClose when Close button (X) is clicked", () => {
    const handleClose = vi.fn();
    render(
      <PokemonEditorModal
        isOpen={true}
        onClose={handleClose}
        onSave={vi.fn()}
        initialData={null}
      />
    );

    const closeBtn = screen.getByLabelText("Close modal");
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalled();
  });

  it("handles form field changes", () => {
    render(
      <PokemonEditorModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={initialData}
      />
    );

    // Name
    const nameInput = screen.getByLabelText("Pokémon Name") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "Charizard" } });
    expect(nameInput.value).toBe("Charizard");

    // Item
    const itemInput = screen.getByLabelText("Held Item") as HTMLInputElement;
    fireEvent.change(itemInput, { target: { value: "Charcoal" } });
    expect(itemInput.value).toBe("Charcoal");

    // Ability
    const abilityInput = screen.getByLabelText("Ability") as HTMLInputElement;
    fireEvent.change(abilityInput, { target: { value: "Blaze" } });
    expect(abilityInput.value).toBe("Blaze");

    // Nature
    const natureInput = screen.getByLabelText("Nature") as HTMLInputElement;
    fireEvent.change(natureInput, { target: { value: "Jolly" } });
    expect(natureInput.value).toBe("Jolly");
  });

  it("handles form submission with valid data", () => {
    const handleSave = vi.fn();
    render(
      <PokemonEditorModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={handleSave}
        initialData={initialData}
      />
    );

    const saveBtn = screen.getByText("Save Pokémon");
    fireEvent.click(saveBtn);

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Pikachu",
        item: "Light Ball",
      })
    );
  });

  it("updates local state when initialData prop changes", () => {
    const { rerender } = render(
      <PokemonEditorModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={null}
      />
    );

    const nameInput = screen.getByPlaceholderText(
      "Search Pokémon..."
    ) as HTMLInputElement;
    expect(nameInput.value).toBe("");

    // Rerender with new data
    rerender(
      <PokemonEditorModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={initialData}
      />
    );

    // State should have updated based on prop change
    expect(nameInput.value).toBe("Pikachu");
  });
});
