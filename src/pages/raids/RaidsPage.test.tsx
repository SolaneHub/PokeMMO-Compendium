import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as PokedexHooks from "@/hooks/usePokedexData";
import * as RaidsHooks from "@/hooks/useRaidsData";
import { Pokemon } from "@/types/pokemon";
import { Raid } from "@/types/raids";

import RaidsPage from "./RaidsPage";

// Mocking hooks
vi.mock("@/hooks/usePokedexData");
vi.mock("@/hooks/useRaidsData");

// Mocking components
vi.mock("@/components/organisms/RaidModal", () => ({
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
  const mockPokedex = {
    pokemonMap: new Map<string, Pokemon>([
      ["Pikachu", { name: "Pikachu", types: ["Electric"] } as Pokemon],
    ]),
    isLoading: false,
  };

  const mockRaids = {
    raidsData: [{ name: "Pikachu", stars: 5 } as Raid],
    raidsMap: new Map<string, Raid>([
      ["Pikachu", { name: "Pikachu", stars: 5 } as Raid],
    ]),
    starLevels: [1, 2, 3, 4, 5],
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(PokedexHooks.usePokedexData).mockReturnValue(
      mockPokedex as unknown as PokedexHooks.UsePokedexDataReturn
    );
    vi.mocked(RaidsHooks.useRaidsData).mockReturnValue(
      mockRaids as unknown as RaidsHooks.UseRaidsDataReturn
    );
  });

  it("shows loading state", () => {
    vi.mocked(RaidsHooks.useRaidsData).mockReturnValue({
      isLoading: true,
      raidsData: [],
      raidsMap: new Map(),
      starLevels: [],
    } as unknown as RaidsHooks.UseRaidsDataReturn);
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
