import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "@/context/AuthContext";
import { ConfirmationProvider } from "@/context/ConfirmationContext";
import { MovesProvider } from "@/context/MovesContext";
import { PokedexProvider } from "@/context/PokedexContext";
import { ToastProvider } from "@/context/ToastContext";
import * as PokedexService from "@/firebase/services/pokedexService";
import * as TeamsService from "@/firebase/services/teamsService";
import EliteFourPage from "@/pages/elite-four/EliteFourPage";
import {
  mockApprovedTeams,
  mockPokemonList,
  resetMockDatabase,
  setupMockDatabase,
} from "@/test/harness/offlineMockHarness";

// Mock services to return data from the harness without mocking child components
vi.mock("@/firebase/services/teamsService", async () => {
  const actual = await vi.importActual("@/firebase/services/teamsService");
  return {
    ...actual,
    getAllApprovedTeams: vi.fn(),
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

const renderEliteFourFlow = () => {
  return render(
    <MemoryRouter initialEntries={["/elite-four"]}>
      <AuthProvider>
        <ConfirmationProvider>
          <ToastProvider>
            <MovesProvider>
              <PokedexProvider>
                <EliteFourPage />
              </PokedexProvider>
            </MovesProvider>
          </ToastProvider>
        </ConfirmationProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe("EliteFourPage Integration Flow", () => {
  beforeEach(() => {
    resetMockDatabase();
    setupMockDatabase();

    vi.mocked(TeamsService.getAllApprovedTeams).mockResolvedValue(
      mockApprovedTeams
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

  it("mounts with real providers and executes full user flow: Select Team -> Select Region -> Select Member -> Click Dewgong -> Asserts StrategyModal displays steps", async () => {
    renderEliteFourFlow();

    // 1. Wait for Pokedex and Teams data to load
    await waitFor(() => {
      expect(
        screen.queryByText(/loading pokedex data/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/loading community teams/i)
      ).not.toBeInTheDocument();
    });

    // Verify title is rendered
    expect(
      screen.getByRole("heading", { name: /elite four strategy/i })
    ).toBeInTheDocument();

    // 2. Select Team: "Kanto E4 Speed Clear"
    const teamButton = await screen.findByRole("button", {
      name: /kanto e4 speed clear/i,
    });
    expect(teamButton).toBeInTheDocument();
    fireEvent.click(teamButton);

    // 3. Region Selection appears: Click "Kanto" (exact name match to distinguish from team buttons)
    const kantoButton = await screen.findByRole("button", {
      name: /^kanto$/i,
    });
    expect(kantoButton).toBeInTheDocument();
    fireEvent.click(kantoButton);

    // 4. Member Selection appears: Click "Lorelei"
    const loreleiText = await screen.findByText("Lorelei");
    const loreleiButton = loreleiText.closest("button");
    expect(loreleiButton).not.toBeNull();
    if (loreleiButton) {
      fireEvent.click(loreleiButton);
    }

    // 5. Pokemon Selection appears: Click "Dewgong"
    const dewgongText = await screen.findByText("Dewgong");
    const dewgongCardButton = dewgongText.closest("button");
    expect(dewgongCardButton).not.toBeNull();
    if (dewgongCardButton) {
      fireEvent.click(dewgongCardButton);
    }

    // 6. StrategyModal opens and displays correct strategy steps
    // Dewgong modal header should be visible
    const modalHeader = await screen.findByRole("heading", {
      name: "Dewgong",
      level: 2,
    });
    expect(modalHeader).toBeInTheDocument();

    // Strategy step text from mockApprovedTeams for Dewgong:
    // "Lead with Cloyster. Use Shell Smash on turn 1." (Cloyster and Shell Smash are rendered with MoveColoredText spans)
    expect(
      await screen.findByText((_content, element) => {
        return (
          element?.tagName.toLowerCase() === "p" &&
          (element.textContent?.includes("Lead with Cloyster") ?? false) &&
          (element.textContent?.includes("Shell Smash") ?? false)
        );
      })
    ).toBeInTheDocument();

    // Step variation button: "Opponent uses Surf"
    const surfVariationButton = await screen.findByRole("button", {
      name: /surf/i,
    });
    expect(surfVariationButton).toBeInTheDocument();

    // Click variation and assert nested steps
    fireEvent.click(surfVariationButton);
    expect(
      await screen.findByText((_content, element) => {
        return (
          element?.tagName.toLowerCase() === "p" &&
          (element.textContent?.includes("Rock Blast") ?? false) &&
          (element.textContent?.includes("knock out Dewgong") ?? false)
        );
      })
    ).toBeInTheDocument();

    // Test Back button in modal (exact name match to distinguish from "Close backdrop")
    const backButton = screen.getByRole("button", { name: /^back$/i });
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);

    // Should return to main step
    expect(
      await screen.findByText((_content, element) => {
        return (
          element?.tagName.toLowerCase() === "p" &&
          (element.textContent?.includes("Lead with Cloyster") ?? false)
        );
      })
    ).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByRole("button", { name: /close modal/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Dewgong", level: 2 })
      ).not.toBeInTheDocument();
    });
  });
});
