import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import RaidLocationsTab from "./RaidLocationsTab";

const mockRaidWithLocations = {
  name: "Mewtwo",
  stars: 5,
  moves: [],
  teamStrategies: [],
  locations: {
    Kanto: "Cerulean Cave",
    Johto: {
      area: "Mt. Silver",
      requirements: ["Defeat Red", "All 16 Badges"],
    },
  },
};

const mockRaidWithoutLocations = {
  name: "Mewtwo",
  stars: 5,
  moves: [],
  teamStrategies: [],
};

describe("RaidLocationsTab component", () => {
  it("renders location string properly", () => {
    render(<RaidLocationsTab currentRaid={mockRaidWithLocations} />);
    expect(screen.getByText("Kanto")).toBeInTheDocument();
    expect(screen.getByText("Cerulean Cave")).toBeInTheDocument();
  });

  it("renders location objects with requirements properly", () => {
    render(<RaidLocationsTab currentRaid={mockRaidWithLocations} />);
    expect(screen.getByText("Johto")).toBeInTheDocument();
    expect(screen.getByText("Mt. Silver")).toBeInTheDocument();

    // Requirements
    expect(screen.getByText("Defeat Red")).toBeInTheDocument();
    expect(screen.getByText("All 16 Badges")).toBeInTheDocument();
  });

  it("renders a fallback message when no location data is available", () => {
    render(<RaidLocationsTab currentRaid={mockRaidWithoutLocations} />);
    expect(screen.getByText("No location data available.")).toBeInTheDocument();
  });
});
