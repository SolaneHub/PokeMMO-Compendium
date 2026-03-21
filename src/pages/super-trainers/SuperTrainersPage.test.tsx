import { render, screen } from "@testing-library/react";
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
vi.mock("@/hooks/useStrategyNavigation", () => ({
  useStrategyNavigation: () => ({
    currentStrategyView: [],
    strategyHistory: [],
    initializeStrategy: vi.fn(),
    navigateToStep: vi.fn(),
    navigateBack: vi.fn(),
  }),
}));

// Mocking complex organisms
vi.mock("@/components/organisms/SuperTrainerSection", () => ({
  default: ({ trainer }: { trainer: SuperTrainer }) => (
    <div data-testid="trainer-section">{trainer.name}</div>
  ),
}));

describe("SuperTrainersPage", () => {
  const mockPokedex = {
    pokemonMap: new Map<string, Pokemon>(),
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(PokedexHooks.usePokedexData).mockReturnValue(
      mockPokedex as unknown as PokedexHooks.UsePokedexDataReturn
    );
  });

  it("renders super trainers data", () => {
    vi.mocked(SuperTrainersHooks.useSuperTrainersData).mockReturnValue({
      superTrainersData: [
        { name: "Trainer 1", region: "Kanto", teams: {} } as SuperTrainer,
      ],
      isLoading: false,
    } as unknown as SuperTrainersHooks.UseSuperTrainersDataReturn);

    render(
      <MemoryRouter>
        <SuperTrainersPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Super Trainers Strategies")).toBeInTheDocument();
    expect(screen.getByTestId("trainer-section")).toBeInTheDocument();
  });
});
