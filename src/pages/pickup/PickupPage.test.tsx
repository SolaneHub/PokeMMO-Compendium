import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as PokedexContext from "@/context/PokedexContext";
import * as PickupHooks from "@/pages/pickup/hooks/usePickupData";
import {
  createMockPickupRegion,
  createMockPokedexContext,
} from "@/test/factories";
import { PickupRegion } from "@/types/pickup";

import PickupPage from "./PickupPage";

// Mocking hooks
vi.mock("@/context/PokedexContext");
vi.mock("@/pages/pickup/hooks/usePickupData");

// Mocking components
vi.mock("@/pages/pickup/components/PickupRegionSection", () => ({
  default: ({ region }: { region: PickupRegion }) => (
    <div data-testid="region-section">{region.id}</div>
  ),
}));

vi.mock("@/components/TeamBuildModal", () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="build-modal">
      <button onClick={onClose}>Close Modal</button>
    </div>
  ),
}));

describe("PickupPage", () => {
  const mockPokedex = createMockPokedexContext({
    pokemonMap: new Map(),
    isLoading: false,
  });

  const mockPickup = {
    regions: [
      createMockPickupRegion({ id: "kanto", name: "Kanto" }),
      createMockPickupRegion({ id: "johto", name: "Johto" }),
    ],
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(PokedexContext.usePokedexContext).mockReturnValue(mockPokedex);
    vi.mocked(PickupHooks.usePickupData).mockReturnValue(mockPickup);
  });

  it("shows loading state", () => {
    vi.mocked(PickupHooks.usePickupData).mockReturnValue({
      isLoading: true,
      regions: [],
      error: null,
    });
    render(<PickupPage />);
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("renders regions and handles modal", () => {
    render(<PickupPage />);

    expect(screen.getByText("Pickup Guide")).toBeInTheDocument();
    expect(screen.getAllByTestId("region-section")).toHaveLength(2);

    const openBtn = screen.getByText("Show Pickup Pokémon");
    fireEvent.click(openBtn);

    expect(screen.getByTestId("build-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close Modal"));
    expect(screen.queryByTestId("build-modal")).not.toBeInTheDocument();
  });
});
