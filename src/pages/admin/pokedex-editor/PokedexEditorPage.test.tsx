import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as MovesContext from "@/context/MovesContext";
import * as PokedexContext from "@/context/PokedexContext";
import * as ToastContext from "@/context/ToastContext";
import * as PokedexHooks from "@/hooks/usePokedexData";
import { Pokemon } from "@/types/pokemon";

import PokedexEditorPage from "./PokedexEditorPage";

// Mocking dependencies
vi.mock("@/hooks/usePokedexData");
vi.mock("@/context/MovesContext");
vi.mock("@/context/PokedexContext");
vi.mock("@/context/ToastContext");
vi.mock("@/firebase/services/pokedexService");

describe("PokedexEditorPage", () => {
  const mockPokemon: Pokemon = {
    id: "bulbasaur",
    name: "Bulbasaur",
    dexId: "1",
    types: ["Grass"],
    moves: [],
    evolutions: [],
    locations: [],
    variants: [],
    abilities: { main: [], hidden: "" },
    baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
  } as Pokemon;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ToastContext.useToast).mockReturnValue(vi.fn());
    vi.mocked(PokedexHooks.usePokedexData).mockReturnValue({
      fullList: [mockPokemon],
      isLoading: false,
      refetch: vi.fn(),
    } as unknown as PokedexHooks.UsePokedexDataReturn);
    vi.mocked(MovesContext.useMoves).mockReturnValue({
      moves: [],
      isLoading: false,
    } as unknown as MovesContext.MovesContextType);
    vi.mocked(PokedexContext.usePokedexContext).mockReturnValue({
      pokedexData: [mockPokemon],
      loading: false,
      getPokemonDetails: vi.fn().mockResolvedValue(mockPokemon),
    } as unknown as PokedexContext.PokedexContextType);
  });

  it("renders correctly and searches for pokemon", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <PokedexEditorPage />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Pokedex Editor")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("Search...");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "Bulba" } });
    });

    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();

    // Select pokemon
    await act(async () => {
      fireEvent.click(screen.getByText("Bulbasaur"));
    });

    // Check if form fields appear
    expect(screen.getByLabelText(/Name/i)).toHaveValue("Bulbasaur");
  });
});
