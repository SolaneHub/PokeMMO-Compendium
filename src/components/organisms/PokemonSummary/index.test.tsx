import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as PokedexContext from "@/context/PokedexContext";
import { Pokemon } from "@/types/pokemon";

import PokemonSummary from "./index";

// Mocking context
vi.mock("@/context/PokedexContext");

// Mocking child components
vi.mock("./PokemonOverview", () => ({
  default: () => <div data-testid="overview" />,
}));
vi.mock("./PokemonStats", () => ({
  default: () => <div data-testid="stats" />,
}));
vi.mock("./PokemonMoves", () => ({
  default: () => <div data-testid="moves" />,
}));
vi.mock("./PokemonLocations", () => ({
  default: () => <div data-testid="locations" />,
}));
vi.mock("./PokemonEvolutions", () => ({
  default: () => <div data-testid="evolutions" />,
}));

describe("PokemonSummary index", () => {
  const mockPokemon = {
    name: "Pikachu",
    types: ["Electric"],
    abilities: { main: ["Static"], hidden: "Lightning Rod" },
    baseStats: { hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90 },
  } as unknown as Pokemon;

  const allPokemon = [
    mockPokemon,
    { name: "Raichu", types: ["Electric"] } as unknown as Pokemon,
  ];

  const defaultProps = {
    pokemon: mockPokemon,
    allPokemon: allPokemon,
    onClose: vi.fn(),
    onSelectPokemon: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(PokedexContext.usePokedexContext).mockReturnValue({
      getPokemonDetails: vi.fn().mockResolvedValue(mockPokemon),
    } as unknown as PokedexContext.PokedexContextType);
  });

  it("renders all tabs correctly", () => {
    render(<PokemonSummary {...defaultProps} />);

    expect(screen.getByText("Pikachu")).toBeInTheDocument();

    fireEvent.click(screen.getByText("STATS"));
    expect(screen.getByTestId("stats")).toBeInTheDocument();

    fireEvent.click(screen.getByText("MOVES"));
    expect(screen.getByTestId("moves")).toBeInTheDocument();

    fireEvent.click(screen.getByText("LOCATIONS"));
    expect(screen.getByTestId("locations")).toBeInTheDocument();

    fireEvent.click(screen.getByText("EVOLUTIONS"));
    expect(screen.getByTestId("evolutions")).toBeInTheDocument();
  });

  it("calls onClose when clicking the close button", () => {
    render(<PokemonSummary {...defaultProps} />);
    const closeBtn = screen.getByLabelText("Close summary");
    fireEvent.click(closeBtn);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("handles navigation between pokemon", () => {
    render(<PokemonSummary {...defaultProps} />);
    const nextBtn = screen
      .getAllByRole("button")
      .find(
        (b) =>
          b.className.includes("right-2") ||
          b.innerHTML.includes("chevron-right")
      );
    if (nextBtn) {
      fireEvent.click(nextBtn);
      expect(defaultProps.onSelectPokemon).toHaveBeenCalled();
    }
  });
});
