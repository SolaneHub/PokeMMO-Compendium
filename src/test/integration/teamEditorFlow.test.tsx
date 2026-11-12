import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "@/context/AuthContext";
import { ConfirmationProvider } from "@/context/ConfirmationContext";
import { MovesProvider } from "@/context/MovesContext";
import { PokedexProvider } from "@/context/PokedexContext";
import { ToastProvider } from "@/context/ToastContext";
import * as PokedexService from "@/firebase/services/pokedexService";
import * as TeamsService from "@/firebase/services/teamsService";
import UserTeamEditorPage from "@/pages/my-teams/UserTeamEditorPage";
import {
  mockApprovedTeams,
  mockPokemonList,
  resetMockDatabase,
  setupMockDatabase,
} from "@/test/harness/offlineMockHarness";
import { Team } from "@/types/teams";

vi.mock("@/firebase/services/teamsService", async () => {
  const actual = await vi.importActual("@/firebase/services/teamsService");
  return {
    ...actual,
    getUserTeam: vi.fn(),
    updateUserTeam: vi.fn(),
  };
});

vi.mock("@/firebase/services/pokedexService", async () => {
  const actual = await vi.importActual("@/firebase/services/pokedexService");
  return {
    ...actual,
    getPokedexSummary: vi.fn(),
    getPokedexData: vi.fn(),
    getPokemonById: vi.fn(),
  };
});

vi.mock("@/context/AuthContext", async () => {
  const actual = await vi.importActual("@/context/AuthContext");
  return {
    ...actual,
    useAuth: () => ({
      currentUser: { uid: "trainer-pro-1", email: "pro@example.com" },
      loading: false,
    }),
  };
});

const renderTeamEditorFlow = (teamId: string) => {
  return render(
    <MemoryRouter initialEntries={[`/my-teams/${teamId}`]}>
      <AuthProvider>
        <ConfirmationProvider>
          <ToastProvider>
            <MovesProvider>
              <PokedexProvider>
                <Routes>
                  <Route
                    path="/my-teams/:id"
                    element={<UserTeamEditorPage />}
                  />
                </Routes>
              </PokedexProvider>
            </MovesProvider>
          </ToastProvider>
        </ConfirmationProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe("UserTeamEditorPage Integration Flow", () => {
  let currentTeamState: Team;

  beforeEach(() => {
    resetMockDatabase();
    setupMockDatabase();

    const initialTeam = mockApprovedTeams[0];
    if (!initialTeam) throw new Error("mockApprovedTeams[0] is undefined");
    currentTeamState = structuredClone(initialTeam);

    vi.mocked(TeamsService.getUserTeam).mockImplementation(
      async (_userId: string, _teamId: string) => {
        return structuredClone(currentTeamState);
      }
    );

    vi.mocked(TeamsService.updateUserTeam).mockImplementation(
      async (_userId: string, _teamId: string, updates: Partial<Team>) => {
        currentTeamState = { ...currentTeamState, ...updates };
        return Promise.resolve();
      }
    );

    vi.mocked(PokedexService.getPokedexSummary).mockResolvedValue(
      mockPokemonList
    );
    vi.mocked(PokedexService.getPokedexData).mockResolvedValue(mockPokemonList);
    vi.mocked(PokedexService.getPokemonById).mockImplementation(
      async (id: string | number) => {
        const found = mockPokemonList.find(
          (p) =>
            p.id === id ||
            p.dexId === id ||
            p.name.toLowerCase() === id.toString().toLowerCase()
        );
        return found || null;
      }
    );
  });

  it("loads team from offline harness, allows editing team name, and saves changes", async () => {
    renderTeamEditorFlow("team-kanto-elite4-lorelei");

    // 1. Wait for team data to load
    await waitFor(() => {
      expect(
        screen.queryByText(/loading team editor\.\.\./i)
      ).not.toBeInTheDocument();
    });

    // Verify team name input exists and has current value
    const nameInput = screen.getByLabelText(/team name/i) as HTMLInputElement;
    expect(nameInput).toBeInTheDocument();
    expect(nameInput.value).toBe("Kanto E4 Speed Clear (Lorelei Counter)");

    // Verify Active Roster slots are rendered (Starmie, Cloyster, Charizard)
    expect(screen.getAllByText("Starmie").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Cloyster").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Charizard").length).toBeGreaterThan(0);

    // 2. Edit team name
    fireEvent.change(nameInput, {
      target: { value: "Updated Speed Clear Team" },
    });
    expect(nameInput.value).toBe("Updated Speed Clear Team");

    // 3. Click Save button
    const saveButton = screen.getByRole("button", { name: /^save$/i });
    fireEvent.click(saveButton);

    // 4. Verify save API call occurred and success notification
    await waitFor(() => {
      expect(TeamsService.updateUserTeam).toHaveBeenCalledWith(
        "trainer-pro-1",
        "team-kanto-elite4-lorelei",
        expect.objectContaining({
          name: "Updated Speed Clear Team",
        })
      );
    });

    expect(
      await screen.findByText(/team saved successfully!/i)
    ).toBeInTheDocument();
  });

  it("navigates into strategy editor for Dewgong under Lorelei and displays strategy steps", async () => {
    renderTeamEditorFlow("team-kanto-elite4-lorelei");

    await waitFor(() => {
      expect(
        screen.queryByText(/loading team editor\.\.\./i)
      ).not.toBeInTheDocument();
    });

    // In Battle Plans sidebar: expand Kanto -> Lorelei -> Dewgong
    const kantoRegionBtn = screen.getByRole("button", { name: /kanto/i });
    fireEvent.click(kantoRegionBtn);

    const loreleiMemberBtn = await screen.findByRole("button", {
      name: /lorelei/i,
    });
    fireEvent.click(loreleiMemberBtn);

    const dewgongItemBtn = await screen.findByRole("button", {
      name: /dewgong/i,
    });
    fireEvent.click(dewgongItemBtn);

    // Should switch to strategy view with StrategyEditor
    await waitFor(() => {
      expect(screen.getByText(/vs\./i)).toBeInTheDocument();
      expect(
        screen.getByText(/define your turn-by-turn strategy\./i)
      ).toBeInTheDocument();
    });

    // Strategy step textarea / input should contain step text
    expect(
      screen.getByDisplayValue(
        /lead with cloyster\. use shell smash on turn 1\./i
      )
    ).toBeInTheDocument();
  });
});
