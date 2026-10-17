import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as PokedexContext from "@/context/PokedexContext";
import * as SuperTrainersHooks from "@/pages/super-trainers/hooks/useSuperTrainersData";
import {
  createMockPokedexContext,
  createMockPokemon,
  createMockSuperTrainer,
} from "@/test/factories";
import { SuperTrainer } from "@/types/superTrainers";

import SuperTrainersPage from "./SuperTrainersPage";

// Mocking dependencies
vi.mock("@/context/PokedexContext");
vi.mock("@/pages/super-trainers/hooks/useSuperTrainersData");

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

// Mocking complex organisms
vi.mock("@/components/TrainerStrategySection", () => ({
  default: ({
    name,
    region,
    onPokemonCardClick,
  }: {
    name: string;
    region: string;
    onPokemonCardClick: (
      pokemonName: string,
      trainerName: string,
      trainerRegion: string,
      teamName: string
    ) => void;
  }) => (
    <div data-testid="trainer-section">
      <button
        onClick={() => onPokemonCardClick("Pikachu", name, region, "Hard")}
      >
        Click Pikachu
      </button>
    </div>
  ),
}));

vi.mock("@/components/StrategyModal", () => ({
  default: () => <div data-testid="strategy-modal" />,
}));

describe("SuperTrainersPage", () => {
  const mockPokedex = createMockPokedexContext({
    pokemonMap: new Map([
      ["Pikachu", createMockPokemon({ name: "Pikachu", types: ["Electric"] })],
    ]),
    isLoading: false,
  });

  const mockTrainersData: SuperTrainer[] = [
    createMockSuperTrainer({ name: "Trainer 1", region: "Kanto" }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(PokedexContext.usePokedexContext).mockReturnValue(mockPokedex);
    vi.mocked(SuperTrainersHooks.useSuperTrainersData).mockReturnValue({
      superTrainersData: mockTrainersData,
      isLoading: false,
      error: null,
    });
  });

  it("renders and opens strategy modal on card click", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <SuperTrainersPage />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Super Trainers Strategies")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Click Pikachu"));

    expect(screen.getByTestId("strategy-modal")).toBeInTheDocument();
    expect(mockInitializeStrategy).toHaveBeenCalled();
  });
});
