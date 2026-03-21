import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as PickupHooks from "@/hooks/usePickupData";
import * as PokedexHooks from "@/hooks/usePokedexData";
import { PickupRegion } from "@/types/pickup";
import { Pokemon } from "@/types/pokemon";

import PickupPage from "./PickupPage";

// Mocking hooks
vi.mock("@/hooks/usePokedexData");
vi.mock("@/hooks/usePickupData");

// Mocking components
vi.mock("@/components/organisms/PickupRegionSection", () => ({
  default: ({ region }: { region: PickupRegion }) => (
    <div data-testid="region-section">{region.id}</div>
  ),
}));

vi.mock("@/components/organisms/TeamBuildModal", () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="build-modal">
      <button onClick={onClose}>Close Modal</button>
    </div>
  ),
}));

describe("PickupPage", () => {
  const mockPokedex = {
    pokemonMap: new Map<string, Pokemon>(),
    isLoading: false,
  };

  const mockPickup = {
    regions: [
      { id: "kanto", name: "Kanto", locations: [] } as PickupRegion,
      { id: "johto", name: "Johto", locations: [] } as PickupRegion,
    ],
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(PokedexHooks.usePokedexData).mockReturnValue(
      mockPokedex as unknown as PokedexHooks.UsePokedexDataReturn
    );
    vi.mocked(PickupHooks.usePickupData).mockReturnValue(
      mockPickup as unknown as PickupHooks.UsePickupDataReturn
    );
  });

  it("shows loading state", () => {
    vi.mocked(PickupHooks.usePickupData).mockReturnValue({
      isLoading: true,
      regions: [],
    } as unknown as PickupHooks.UsePickupDataReturn);
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
