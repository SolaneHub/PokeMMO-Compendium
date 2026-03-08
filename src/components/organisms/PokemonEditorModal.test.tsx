import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TeamMember } from "@/types/teams";

import PokemonEditorModal from "./PokemonEditorModal";

// Mock providers
vi.mock("@/context/MovesContext", () => ({
  useMoves: () => ({ allMoves: [] }),
}));

vi.mock("@/hooks/usePokedexData", () => ({
  usePokedexData: () => ({ allPokemonData: [] }),
}));

const mockMember: TeamMember = {
  name: "Charizard",
  item: "Life Orb",
  ability: "Solar Power",
  nature: "Timid",
  evs: "252 SpA / 252 Spe",
  ivs: "31/x/31/31/31/31",
  moves: ["Fire Blast", "Air Slash", "Solar Beam", "Roost"],
};

describe("PokemonEditorModal component", () => {
  it("renders correctly when open", () => {
    render(
      <PokemonEditorModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={null}
      />
    );
    expect(screen.getByText("Add Pokémon")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search Pokémon...")
    ).toBeInTheDocument();
  });

  it("renders initial data when provided", () => {
    render(
      <PokemonEditorModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={mockMember}
      />
    );
    expect(screen.getByText("Edit Pokémon")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Charizard")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Life Orb")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <PokemonEditorModal
        isOpen={true}
        onClose={handleClose}
        onSave={vi.fn()}
        initialData={null}
      />
    );
    fireEvent.click(screen.getByLabelText("Close modal"));
    expect(handleClose).toHaveBeenCalled();
  });

  it("calls onSave with form data when Save is clicked", () => {
    const handleSave = vi.fn();
    render(
      <PokemonEditorModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={handleSave}
        initialData={mockMember}
      />
    );

    fireEvent.click(screen.getByText("Save Pokémon"));
    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Charizard",
        item: "Life Orb",
      })
    );
  });

  it("handles input changes correctly", () => {
    render(
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
    fireEvent.change(nameInput, {
      target: { value: "Garchomp", name: "name" },
    });
    expect(nameInput.value).toBe("Garchomp");
  });

  it("handles move changes correctly", () => {
    render(
      <PokemonEditorModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={null}
      />
    );

    const moveInputs = screen.getAllByPlaceholderText(/Move \d/);
    const firstMoveInput = moveInputs[0];
    if (firstMoveInput) {
      fireEvent.change(firstMoveInput, { target: { value: "Earthquake" } });
      expect((firstMoveInput as HTMLInputElement).value).toBe("Earthquake");
    }
  });

  it("updates local state when initialData prop changes via key reset", () => {
    const { rerender } = render(
      <PokemonEditorModal
        key="initial"
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

    const newMember: TeamMember = { ...mockMember, name: "Pikachu" };

    // React Best Practice: To reset/update state based on props, change the component key
    rerender(
      <PokemonEditorModal
        key="updated"
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={newMember}
      />
    );

    // Re-query nameInput because the component was remounted
    const updatedNameInput = screen.getByPlaceholderText(
      "Search Pokémon..."
    ) as HTMLInputElement;
    expect(updatedNameInput.value).toBe("Pikachu");
  });
});
