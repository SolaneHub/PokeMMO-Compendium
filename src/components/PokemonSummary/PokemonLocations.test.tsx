import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PokemonLocations from "./PokemonLocations";

describe("PokemonLocations component", () => {
  it("renders a list of locations", () => {
    const locations = [
      {
        region: "Kanto",
        area: "Route 1",
        rarity: "Common",
        method: "Grass",
        levels: "2-4",
      },
    ];
    render(<PokemonLocations locations={locations} />);

    expect(screen.getByText("Wild Locations")).toBeInTheDocument();
    expect(screen.getByText("Kanto")).toBeInTheDocument();
    expect(screen.getByText("Route 1")).toBeInTheDocument();
    expect(screen.getByText("Common")).toBeInTheDocument();
    expect(screen.getByText("Grass")).toBeInTheDocument();
    expect(screen.getByText("2-4")).toBeInTheDocument();
  });

  it("renders a fallback message when locations array is empty", () => {
    render(<PokemonLocations locations={[]} />);
    expect(screen.getByText("No wild locations found.")).toBeInTheDocument();
  });
});
