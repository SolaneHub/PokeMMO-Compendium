import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as TrainerRerunHooks from "@/pages/trainer-rerun/hooks/useTrainerRerunData";
import { TrainerRerunData } from "@/types/trainerRerun";

import TrainerRerunPage from "./TrainerRerunPage";

// Mocking dependencies
vi.mock("@/pages/trainer-rerun/hooks/useTrainerRerunData");

vi.mock("@/pages/trainer-rerun/components/RegionRoutes", () => ({
  default: () => <div data-testid="region-routes" />,
}));

describe("TrainerRerunPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it("renders loading state when isLoading is true", () => {
    vi.mocked(TrainerRerunHooks.useTrainerRerunData).mockReturnValue({
      trainerRerunData: null,
      isLoading: true,
      error: null,
    } as unknown as TrainerRerunHooks.UseTrainerRerunDataReturn);

    render(
      <MemoryRouter>
        <TrainerRerunPage />
      </MemoryRouter>
    );
    expect(
      screen.getByText("Loading Trainer Rerun data...")
    ).toBeInTheDocument();
  });

  it("renders error state when error is present", () => {
    vi.mocked(TrainerRerunHooks.useTrainerRerunData).mockReturnValue({
      trainerRerunData: null,
      isLoading: false,
      error: new Error("Network timeout"),
    } as unknown as TrainerRerunHooks.UseTrainerRerunDataReturn);

    render(
      <MemoryRouter>
        <TrainerRerunPage />
      </MemoryRouter>
    );
    expect(
      screen.getByText("Failed to load Trainer Rerun data: Network timeout")
    ).toBeInTheDocument();
  });

  it("renders error state when not loading but data is null", () => {
    vi.mocked(TrainerRerunHooks.useTrainerRerunData).mockReturnValue({
      trainerRerunData: null,
      isLoading: false,
      error: null,
    } as unknown as TrainerRerunHooks.UseTrainerRerunDataReturn);

    render(
      <MemoryRouter>
        <TrainerRerunPage />
      </MemoryRouter>
    );
    expect(
      screen.getByText("Failed to load Trainer Rerun data: Unknown error")
    ).toBeInTheDocument();
  });
});
