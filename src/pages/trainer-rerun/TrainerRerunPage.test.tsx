import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as PokedexHooks from "@/hooks/usePokedexData";
import * as TrainerRerunHooks from "@/hooks/useTrainerRerunData";
import { Pokemon } from "@/types/pokemon";
import { TrainerRerunData } from "@/types/trainerRerun";

import TrainerRerunPage from "./TrainerRerunPage";

// Mocking dependencies
vi.mock("@/hooks/usePokedexData");
vi.mock("@/hooks/useTrainerRerunData");

vi.mock("@/components/organisms/RegionRoutes", () => ({
  default: () => <div data-testid="region-routes" />,
}));

describe("TrainerRerunPage", () => {
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

  it("renders rerun data", () => {
    vi.mocked(TrainerRerunHooks.useTrainerRerunData).mockReturnValue({
      trainerRerunData: {
        intro: { title: "Rerun Guide", description: ["Desc 1"] },
        requirements: { title: "Reqs", items: [] },
        tips_tricks: { title: "Tips", items: [] },
        regions: [],
      } as TrainerRerunData,
      isLoading: false,
    } as unknown as TrainerRerunHooks.UseTrainerRerunDataReturn);

    render(
      <MemoryRouter>
        <TrainerRerunPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Rerun Guide")).toBeInTheDocument();
    expect(screen.getByTestId("region-routes")).toBeInTheDocument();
  });
});
