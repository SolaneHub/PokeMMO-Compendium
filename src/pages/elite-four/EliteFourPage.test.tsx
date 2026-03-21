import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as TeamsService from "@/firebase/services/teamsService";
import * as PokedexHooks from "@/hooks/usePokedexData";
import { Pokemon } from "@/types/pokemon";
import { Team, TeamMember } from "@/types/teams";

import EliteFourPage from "./EliteFourPage";

// Mocking dependencies
vi.mock("@/hooks/usePokedexData");
vi.mock("@/firebase/services/teamsService");
vi.mock("@/hooks/useStrategyNavigation", () => ({
  useStrategyNavigation: () => ({
    currentStrategyView: [],
    strategyHistory: [],
    initializeStrategy: vi.fn(),
    navigateToStep: vi.fn(),
    navigateBack: vi.fn(),
    resetStrategy: vi.fn(),
  }),
}));

describe("EliteFourPage", () => {
  const mockPokedex = {
    pokemonMap: new Map([
      ["Pikachu", { name: "Pikachu", types: ["Electric"] } as Pokemon],
    ]),
    isLoading: false,
  };

  const mockTeams: Team[] = [
    {
      id: "t1",
      name: "Community Team 1",
      members: [
        {
          name: "Pikachu",
          item: "Light Ball",
          moves: ["Thunderbolt"],
        } as unknown as TeamMember,
      ],
      regions: ["Kanto"],
      enemyPools: { Lorelei: ["Dewgong"] },
      strategies: { Lorelei: { Dewgong: [] } },
    } as unknown as Team,
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(PokedexHooks.usePokedexData).mockReturnValue(
      mockPokedex as unknown as PokedexHooks.UsePokedexDataReturn
    );
    vi.mocked(TeamsService.getAllApprovedTeams).mockResolvedValue(mockTeams);
  });

  it("shows loading state for pokedex", async () => {
    vi.mocked(PokedexHooks.usePokedexData).mockReturnValue({
      isLoading: true,
    } as unknown as PokedexHooks.UsePokedexDataReturn);
    await act(async () => {
      render(<EliteFourPage />);
    });
    expect(screen.getByText("Loading Pokedex data...")).toBeInTheDocument();
  });

  it("renders teams and handles selection flow", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <EliteFourPage />
        </MemoryRouter>
      );
    });

    // Check if team appears (it will replace the loading state automatically)
    await waitFor(() => {
      expect(screen.getByText("Community Team 1")).toBeInTheDocument();
    });

    // Select Team
    await act(async () => {
      fireEvent.click(screen.getByText("Community Team 1"));
    });

    // Should show region selection
    expect(screen.getByText("Select Region")).toBeInTheDocument();

    // Select Region (Kanto)
    await act(async () => {
      fireEvent.click(screen.getByText("Kanto"));
    });

    // Select Member (Lorelei)
    await waitFor(() => {
      expect(screen.getByText("Lorelei")).toBeInTheDocument();
    });
    await act(async () => {
      fireEvent.click(screen.getByText("Lorelei"));
    });

    // Select Pokemon (Dewgong)
    await waitFor(() => {
      expect(screen.getByText("Dewgong")).toBeInTheDocument();
    });
  });

  it("shows error if teams fail to load", async () => {
    vi.mocked(TeamsService.getAllApprovedTeams).mockRejectedValue(
      new Error("Fail")
    );
    await act(async () => {
      render(
        <MemoryRouter>
          <EliteFourPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load community strategies/i)
      ).toBeInTheDocument();
    });
  });
});
