import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as MovesContext from "@/context/MovesContext";
import * as PokedexContext from "@/context/PokedexContext";
import {
  createMockMoveMaster,
  createMockMovesContext,
  createMockPokedexContext,
  createMockTeamMember,
} from "@/test/factories";

import PokemonEditorView from "./PokemonEditorView";

// Mocking hooks and context
vi.mock("@/context/PokedexContext");
vi.mock("@/context/MovesContext");

describe("PokemonEditorView", () => {
  beforeEach(() => {
    vi.mocked(PokedexContext.usePokedexContext).mockReturnValue(
      createMockPokedexContext({
        pokemonNames: ["Pikachu", "Charizard"],
        itemNames: ["Light Ball", "Charizardite X"],
        abilityNames: ["Static", "Blaze"],
      })
    );
    vi.mocked(MovesContext.useMoves).mockReturnValue(
      createMockMovesContext({
        moves: [
          createMockMoveMaster({ name: "Thunderbolt" }),
          createMockMoveMaster({ name: "Flamethrower" }),
        ],
      })
    );
  });

  const defaultProps = {
    data: createMockTeamMember({
      name: "Pikachu",
      item: "Light Ball",
      ability: "Static",
      nature: "Jolly",
      evs: "252 Atk / 4 SpD / 252 Spe",
      ivs: "6x31",
      moves: ["Thunderbolt", "", "", ""],
    }),
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
