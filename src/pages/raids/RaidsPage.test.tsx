import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as PokedexContext from "@/context/PokedexContext";
import * as RaidsHooks from "@/pages/raids/hooks/useRaidsData";
import {
  createMockPokedexContext,
  createMockPokemon,
  createMockRaid,
} from "@/test/factories";

import RaidsPage from "./RaidsPage";

// Mocking hooks
vi.mock("@/context/PokedexContext");
vi.mock("@/pages/raids/hooks/useRaidsData");

// Mocking components
vi.mock("@/pages/raids/components/RaidModal", () => ({
  default: ({
    raidName,
    onClose,
  }: {
    raidName: string;
    onClose: () => void;
  }) => (
    <div data-testid="raid-modal">
      <span>Details for {raidName}</span>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe("RaidsPage", () => {
  const mockRaid = createMockRaid({ name: "Pikachu", stars: 5 });
  const mockPokedex = createMockPokedexContext({
    pokemonMap: new Map([
      ["Pikachu", createMockPokemon({ name: "Pikachu", types: ["Electric"] })],
    ]),
    isLoading: false,
  });

  const mockRaids = {
    raidsData: [mockRaid],
    raidsMap: new Map([["Pikachu", mockRaid]]),
    starLevels: [1, 2, 3, 4, 5],
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(PokedexContext.usePokedexContext).mockReturnValue(mockPokedex);
    vi.mocked(RaidsHooks.useRaidsData).mockReturnValue(mockRaids);
  });

  it("shows loading state", () => {
    vi.mocked(RaidsHooks.useRaidsData).mockReturnValue({
      isLoading: true,
      raidsData: [],
      raidsMap: new Map(),
      starLevels: [],
      error: null,
    });
    render(<RaidsPage />);
    expect(screen.getByText("Loading Raids data...")).toBeInTheDocument();
  });

  it("renders star levels and handles selection", () => {
    render(
      <MemoryRouter>
        <RaidsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Raid Strategies")).toBeInTheDocument();

    const starBtn = screen.getByText("5★");
    fireEvent.click(starBtn);

    expect(screen.getByText("Pikachu")).toBeInTheDocument();
  });

  it("opens modal when pokemon card is clicked", () => {
    render(
      <MemoryRouter>
        <RaidsPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("5★"));
    fireEvent.click(screen.getByText("Pikachu"));

    expect(screen.getByTestId("raid-modal")).toBeInTheDocument();
    expect(screen.getByText("Details for Pikachu")).toBeInTheDocument();
  });
});
