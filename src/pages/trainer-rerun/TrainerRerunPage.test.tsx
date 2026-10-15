import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as TrainerRerunHooks from "@/pages/trainer-rerun/hooks/useTrainerRerunData";
import { TrainerRerunData } from "@/pages/trainer-rerun/types/trainerRerun";

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
});
