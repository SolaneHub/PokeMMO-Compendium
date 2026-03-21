import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as BossFightsHooks from "@/hooks/useBossFightsData";
import * as PokedexHooks from "@/hooks/usePokedexData";
import { BossFight } from "@/types/bossFights";
import { Pokemon } from "@/types/pokemon";

import BossFightsPage from "./BossFightsPage";

// Mocking dependencies
vi.mock("@/hooks/usePokedexData");
vi.mock("@/hooks/useBossFightsData");

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

vi.mock("@/components/organisms/BossFightSection", () => ({
  default: ({
    bossFight,
    onPokemonCardClick,
  }: {
    bossFight: BossFight;
    onPokemonCardClick: (p: string, b: string, r: string, t: string) => void;
  }) => (
    <div data-testid="boss-section">
      <button
        onClick={() =>
          onPokemonCardClick(
            "Nidoking",
            bossFight.name,
            bossFight.region,
            "Hard Team"
          )
        }
      >
        Click Nidoking
      </button>
    </div>
  ),
}));

vi.mock("@/components/organisms/StrategyModal", () => ({
  default: () => <div data-testid="strategy-modal" />,
}));

describe("BossFightsPage", () => {
  const mockPokedex = {
    pokemonMap: new Map([
      ["Nidoking", { name: "Nidoking", types: ["Ground"] } as Pokemon],
    ]),
    isLoading: false,
  };

  const mockBossData: BossFight[] = [
    {
      name: "Giovanni",
      region: "Kanto",
      type: "Ground",
      teams: {
        "Hard Team": {
          pokemonNames: ["Nidoking"],
          pokemonStrategies: { Nidoking: ["Use Earthquake"] },
        },
      },
    } as unknown as BossFight,
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(PokedexHooks.usePokedexData).mockReturnValue(
      mockPokedex as unknown as PokedexHooks.UsePokedexDataReturn
    );
    vi.mocked(BossFightsHooks.useBossFightsData).mockReturnValue({
      bossFightsData: mockBossData,
      isLoading: false,
    } as unknown as BossFightsHooks.UseBossFightsDataReturn);
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
