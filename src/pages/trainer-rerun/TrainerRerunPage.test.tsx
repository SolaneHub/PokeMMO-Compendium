import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as TrainerRerunHooks from "@/pages/trainer-rerun/hooks/useTrainerRerunData";
import { createMockTrainerRerunData } from "@/test/factories";

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
      trainerRerunData: createMockTrainerRerunData(),
      isLoading: false,
      error: null,
    });

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
    });

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
    });

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
    });

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
