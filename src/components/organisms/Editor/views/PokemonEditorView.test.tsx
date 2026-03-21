import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as MovesContext from "@/context/MovesContext";
import { PokedexContextType } from "@/context/PokedexContext";
import * as PokedexHooks from "@/hooks/usePokedexData";
import { TeamMember } from "@/types/teams";

import PokemonEditorView from "./PokemonEditorView";

// Mocking hooks and context
vi.mock("@/hooks/usePokedexData");
vi.mock("@/context/MovesContext");

describe("PokemonEditorView", () => {
  const mockPokemonData = {
    pokemonNames: ["Pikachu", "Charizard"],
    itemNames: ["Light Ball", "Charizardite X"],
    abilityNames: ["Static", "Blaze"],
    allPokemonData: [],
  };

  const mockMoves = {
    moves: [{ name: "Thunderbolt" }, { name: "Flamethrower" }],
  };

  beforeEach(() => {
    vi.mocked(PokedexHooks.usePokedexData).mockReturnValue(
      mockPokemonData as unknown as PokedexContextType
    );
    vi.mocked(MovesContext.useMoves).mockReturnValue(
      mockMoves as unknown as ReturnType<typeof MovesContext.useMoves>
    );
  });

  const defaultProps = {
    data: {
      name: "Pikachu",
      item: "Light Ball",
      ability: "Static",
      nature: "Jolly",
      evs: "252 Atk / 4 SpD / 252 Spe",
      ivs: "6x31",
      moves: ["Thunderbolt", "", "", ""],
    } as unknown as TeamMember,
    onSave: vi.fn(),
  };

  it("renders with initial data", () => {
    render(<PokemonEditorView {...defaultProps} />);

    expect(screen.getByDisplayValue("Pikachu")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Light Ball")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Static")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Jolly")).toBeInTheDocument();
  });

  it("updates form fields and calls onSave", () => {
    render(<PokemonEditorView {...defaultProps} />);

    const nameInput = screen.getByDisplayValue("Pikachu");
    fireEvent.change(nameInput, {
      target: { value: "Charizard", name: "name" },
    });

    const saveBtn = screen.getByText("Apply");
    fireEvent.click(saveBtn);

    expect(defaultProps.onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Charizard",
      })
    );
  });

  it("handles empty data correctly", () => {
    render(<PokemonEditorView data={null} onSave={vi.fn()} />);
    expect(screen.getByPlaceholderText("e.g. Garchomp")).toBeInTheDocument();
  });
});
