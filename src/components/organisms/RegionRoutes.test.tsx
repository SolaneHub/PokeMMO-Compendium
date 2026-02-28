import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import RegionRoutes from "./RegionRoutes";

const mockRegions = [
  {
    name: "Kanto",
    routes: [
      { name: "Route 1", pp_cost: 0 },
      { name: "Route 2", pp_cost: 5 },
    ],
  },
  {
    name: "Johto",
    routes: [{ name: "Route 29", type: "action" }],
  },
];

describe("RegionRoutes component", () => {
  it("renders the main title", () => {
    render(<RegionRoutes regions={[]} />);
    expect(screen.getByText("Trainer Routes")).toBeInTheDocument();
  });

  it("renders all regions provided", () => {
    render(<RegionRoutes regions={mockRegions} />);
    expect(screen.getByText("Kanto")).toBeInTheDocument();
    expect(screen.getByText("Johto")).toBeInTheDocument();
  });

  it("renders routes for each region", () => {
    render(<RegionRoutes regions={mockRegions} />);
    expect(screen.getByText("Route 1")).toBeInTheDocument();
    expect(screen.getByText("Route 2")).toBeInTheDocument();
    expect(screen.getByText("Route 29")).toBeInTheDocument();
  });
});
