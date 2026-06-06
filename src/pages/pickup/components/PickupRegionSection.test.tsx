import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PickupRegionSection from "./PickupRegionSection";

const mockRegion = {
  name: "Hoenn",
  note: "Only accessible after defeating E4",
  locations: [
    {
      name: "Route 111",
      items: {
        pokeballs: ["Ultra Ball"],
        healing: ["Max Potion", "Full Restore"],
      },
    },
  ],
};

describe("PickupRegionSection component", () => {
  it("renders region name and note", () => {
    render(<PickupRegionSection region={mockRegion} />);
    expect(screen.getByText("Hoenn")).toBeInTheDocument();
    expect(
      screen.getByText("Only accessible after defeating E4")
    ).toBeInTheDocument();
  });

  it("renders locations and categorized items", () => {
    render(<PickupRegionSection region={mockRegion} />);

    expect(screen.getByText("Route 111")).toBeInTheDocument();
    expect(screen.getByText(/pokeballs:/i)).toBeInTheDocument(); // capitalized via CSS, lowercase in DOM
    expect(screen.getByText(/healing:/i)).toBeInTheDocument();

    expect(screen.getByText("Ultra Ball")).toBeInTheDocument();
    expect(screen.getByText("Full Restore")).toBeInTheDocument();
  });

  it("renders a fallback message if no locations are present", () => {
    render(<PickupRegionSection region={{ name: "Sinnoh", locations: [] }} />);
    expect(
      screen.getByText("No specific pickup data available for this region.")
    ).toBeInTheDocument();
  });
});
