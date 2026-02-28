import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TeamBuildModal from "./TeamBuildModal";
import { Pokemon } from "@/types/pokemon";

const mockPokemonMap = new Map<string, Pokemon>();

const mockBuilds = [
  { name: "Pikachu", item: "Light Ball", evs: "252 Atk / 252 Spe" },
];

describe("TeamBuildModal component", () => {
  it("renders null if builds are empty", () => {
    const { container } = render(
      <TeamBuildModal
        teamName="Red Team"
        builds={[]}
        onClose={() => {}}
        pokemonMap={mockPokemonMap}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders team name and builds", () => {
    render(
      <TeamBuildModal
        teamName="Red Team"
        builds={mockBuilds}
        onClose={() => {}}
        pokemonMap={mockPokemonMap}
      />
    );
    expect(screen.getByText("Red Team Setup")).toBeInTheDocument();
    expect(screen.getAllByText("Pikachu").length).toBeGreaterThan(0);
    expect(screen.getByText("Light Ball")).toBeInTheDocument();
    expect(screen.getByText("252 Atk / 252 Spe")).toBeInTheDocument();
  });
});
