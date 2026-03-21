import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as PokedexHooks from "@/hooks/usePokedexData";
import { Pokemon } from "@/types/pokemon";

import CatchCalculatorPage from "./CatchCalculatorPage";

// Mocking hooks
vi.mock("@/hooks/usePokedexData");
vi.mock("@/hooks/useCatchProbability", () => ({
  useCatchProbability: vi.fn(() => 50.5),
}));
vi.mock("@/hooks/usePokemonUI", () => ({
  usePokemonUI: vi.fn(() => ({ sprite: "mock.png", background: "#fff" })),
}));
vi.mock("@/utils/usePersistentState", () => ({
  usePersistentState: vi.fn((_key, initial) => [initial, vi.fn()]),
}));

// Mocking child components to simplify
vi.mock("@/components/organisms/CatchCalculator/TargetSection", () => ({
  default: ({ selectedPokemonName }: { selectedPokemonName: string }) => (
    <div data-testid="target-section">{selectedPokemonName}</div>
  ),
}));
vi.mock("@/components/organisms/CatchCalculator/ConditionsSection", () => ({
  default: () => <div data-testid="conditions-section" />,
}));
vi.mock("@/components/organisms/CatchCalculator/CaptureSection", () => ({
  default: ({ catchProbability }: { catchProbability: number }) => (
    <div data-testid="capture-section">{catchProbability}%</div>
  ),
}));

describe("CatchCalculatorPage", () => {
  const mockPokedex = {
    allPokemonData: [{ name: "Bulbasaur", catchRate: 45 } as Pokemon],
    pokemonMap: new Map([
      ["Bulbasaur", { name: "Bulbasaur", catchRate: 45 } as Pokemon],
    ]),
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(PokedexHooks.usePokedexData).mockReturnValue(
      mockPokedex as unknown as PokedexHooks.UsePokedexDataReturn
    );
  });

  it("shows loading state", () => {
    vi.mocked(PokedexHooks.usePokedexData).mockReturnValue({
      isLoading: true,
      allPokemonData: [],
      pokemonMap: new Map(),
    } as unknown as PokedexHooks.UsePokedexDataReturn);
    render(<CatchCalculatorPage />);
    expect(screen.getByText("Loading Pokémon data...")).toBeInTheDocument();
  });

  it("renders correctly with mocked sub-sections", () => {
    render(
      <MemoryRouter>
        <CatchCalculatorPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Catch Calculator")).toBeInTheDocument();
    expect(screen.getByTestId("target-section")).toBeInTheDocument();
    expect(screen.getByTestId("conditions-section")).toBeInTheDocument();
    expect(screen.getByTestId("capture-section")).toBeInTheDocument();
    expect(screen.getByText("50.5%")).toBeInTheDocument();
  });
});
