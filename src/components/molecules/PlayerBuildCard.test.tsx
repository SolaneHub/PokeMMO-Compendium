import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Pokemon } from "@/types/pokemon";

import PlayerBuildCard from "./PlayerBuildCard";

// Create a mock pokemon map
const mockPokemonMap = new Map<string, Pokemon>();

const mockBuild = {
  name: "Gengar",
  nature: "Timid",
  evs: "252 SpA / 252 Spe",
  ivs: "31/x/31/31/31/31",
  ability: "Levitate",
  item: "Life Orb",
  moves: ["Shadow Ball", "Sludge Bomb"],
  variants: [
    {
      name: "Choice Specs Variant",
      nature: "Modest",
      evs: "252 SpA",
      item: "Choice Specs",
      moves: ["Thunderbolt"],
    },
  ],
};

describe("PlayerBuildCard component", () => {
  it("renders build details", () => {
    render(<PlayerBuildCard build={mockBuild} pokemonMap={mockPokemonMap} />);

    expect(screen.getAllByText("Gengar").length).toBeGreaterThan(0);
    expect(screen.getByText("Timid")).toBeInTheDocument();
    expect(screen.getByText("Life Orb")).toBeInTheDocument();
    expect(screen.getByText("Shadow Ball")).toBeInTheDocument();
  });

  it("renders variants and switches between them", () => {
    render(<PlayerBuildCard build={mockBuild} pokemonMap={mockPokemonMap} />);

    // Both variant buttons should be rendered
    const defaultBtn = screen.getByRole("button", { name: "Gengar" });
    const variantBtn = screen.getByRole("button", {
      name: "Choice Specs Variant",
    });

    expect(defaultBtn).toBeInTheDocument();
    expect(variantBtn).toBeInTheDocument();

    // Click on the second variant
    fireEvent.click(variantBtn);

    // It should now show the item and nature from the second variant
    expect(screen.getByText("Choice Specs")).toBeInTheDocument();
    expect(screen.getByText("Modest")).toBeInTheDocument();
    expect(screen.getByText("Thunderbolt")).toBeInTheDocument();

    // Previous variant data shouldn't be matched as primary value anymore
    expect(screen.queryByText("Life Orb")).not.toBeInTheDocument();
  });

  it("returns null if build is not provided", () => {
    // Cast to unknown first to satisfy ESLint any rule
    const { container } = render(
      <PlayerBuildCard
        build={undefined as unknown as typeof mockBuild}
        pokemonMap={mockPokemonMap}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
