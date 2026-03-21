import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as PokedexHooks from "@/hooks/usePokedexData";
import * as SuperTrainersHooks from "@/hooks/useSuperTrainersData";
import { Pokemon } from "@/types/pokemon";
import { SuperTrainer } from "@/types/superTrainers";

import SuperTrainersPage from "./SuperTrainersPage";

// Mocking dependencies
vi.mock("@/hooks/usePokedexData");
vi.mock("@/hooks/useSuperTrainersData");

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
vi.mock("@/components/organisms/SuperTrainerSection", () => ({
  default: ({
    trainer,
    onPokemonCardClick,
  }: {
    trainer: SuperTrainer;
    onPokemonCardClick: (
      pokemonName: string,
      trainerName: string,
      trainerRegion: string,
      teamName: string
    ) => void;
  }) => (
    <div data-testid="trainer-section">
      <span>{trainer.name}</span>
      <button
        onClick={() =>
          onPokemonCardClick("Pikachu", trainer.name, trainer.region, "Hard")
        }
      >
        Click Pikachu
      </button>
    </div>
  ),
}));

vi.mock("@/components/organisms/StrategyModal", () => ({
  default: () => <div data-testid="strategy-modal" />,
}));

describe("SuperTrainersPage", () => {
  const mockPokedex = {
    pokemonMap: new Map<string, Pokemon>([
      [
        "Pikachu",
        { id: "25", name: "Pikachu", types: ["Electric"] } as Pokemon,
      ],
    ]),
    isLoading: false,
  };

  const mockTrainersData: SuperTrainer[] = [
    {
      name: "Trainer 1",
      region: "Kanto",
      type: "Various",
      image: "img.png",
      teams: {
        Hard: {
          pokemonNames: ["Pikachu"],
          pokemonStrategies: {
            Pikachu: [{ id: "1", type: "text", description: "Step 1" }],
          },
        },
      },
    } as unknown as SuperTrainer,
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(PokedexHooks.usePokedexData).mockReturnValue(
      mockPokedex as unknown as PokedexHooks.UsePokedexDataReturn
    );
    vi.mocked(SuperTrainersHooks.useSuperTrainersData).mockReturnValue({
      superTrainersData: mockTrainersData,
      isLoading: false,
    } as unknown as SuperTrainersHooks.UseSuperTrainersDataReturn);
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
