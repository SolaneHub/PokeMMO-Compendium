import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as PokedexContext from "@/context/PokedexContext";
import * as BossFightsHooks from "@/pages/boss-fights/hooks/useBossFightsData";
import {
  createMockBossFight,
  createMockPokedexContext,
  createMockPokemon,
} from "@/test/factories";
import { BossFight } from "@/types/bossFights";

import BossFightsPage from "./BossFightsPage";

// Mocking dependencies
vi.mock("@/context/PokedexContext");
vi.mock("@/pages/boss-fights/hooks/useBossFightsData");

const mockInitializeStrategy = vi.fn();
vi.mock("@/hooks/useStrategyNavigation", () => ({
  useStrategyNavigation: () => ({
    currentStrategyView: [],
    strategyHistory: [],
    initializeStrategy: mockInitializeStrategy,
    navigateToStep: vi.fn(),
    navigateBack: vi.fn(),
  }),
}));

vi.mock("@/components/TrainerStrategySection", () => ({
  default: ({
    name,
    region,
    onPokemonCardClick,
  }: {
    name: string;
    region: string;
    onPokemonCardClick: (p: string, b: string, r: string, t: string) => void;
  }) => (
    <div data-testid="boss-section">
      <button
        onClick={() =>
          onPokemonCardClick("Nidoking", name, region, "Hard Team")
        }
      >
        Click Nidoking
      </button>
    </div>
  ),
}));

vi.mock("@/components/StrategyModal", () => ({
  default: () => <div data-testid="strategy-modal" />,
}));

describe("BossFightsPage", () => {
  const mockPokedex = createMockPokedexContext({
    pokemonMap: new Map([
      ["Nidoking", createMockPokemon({ name: "Nidoking", types: ["Ground"] })],
    ]),
  });

  const mockBossData: BossFight[] = [createMockBossFight()];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(PokedexContext.usePokedexContext).mockReturnValue(mockPokedex);
    vi.mocked(BossFightsHooks.useBossFightsData).mockReturnValue({
      bossFightsData: mockBossData,
      isLoading: false,
      error: null,
    });
  });

  it("renders and opens strategy modal on card click", () => {
    render(
      <MemoryRouter>
        <BossFightsPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Click Nidoking"));

    expect(screen.getByTestId("strategy-modal")).toBeInTheDocument();
    expect(mockInitializeStrategy).toHaveBeenCalledWith([
      { id: "Nidoking-step-0", type: "text", description: "Use Earthquake" },
    ]);
  });
});
