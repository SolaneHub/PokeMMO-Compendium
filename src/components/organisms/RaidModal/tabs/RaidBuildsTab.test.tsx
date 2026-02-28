import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import RaidBuildsTab from "./RaidBuildsTab";
import { Pokemon } from "@/types/pokemon";

const mockPokemonMap = new Map<string, Pokemon>();

describe("RaidBuildsTab component", () => {
  it("renders a message if no builds are available", () => {
    render(
      <RaidBuildsTab
        recommendedList={[]}
        buildGroups={null}
        effectiveBuildGroupKey={null}
        setSelectedBuildGroup={() => {}}
        pokemonMap={mockPokemonMap}
      />
    );
    expect(
      screen.getByText("No recommended builds available.")
    ).toBeInTheDocument();
  });

  it("renders recommended list as raw strings if no groups are provided", () => {
    render(
      <RaidBuildsTab
        recommendedList={[{ name: "Test Build" } as any]}
        buildGroups={null}
        effectiveBuildGroupKey={null}
        setSelectedBuildGroup={() => {}}
        pokemonMap={mockPokemonMap}
      />
    );
    expect(screen.getByText("Recommended Setup")).toBeInTheDocument();
    expect(screen.getByText(/Test Build/)).toBeInTheDocument();
  });

  it("renders group buttons and active group builds", () => {
    const buildGroups = {
      "Player 1": [{ name: "Pikachu", item: "Light Ball" }],
      "Player 2": [{ name: "Raichu", item: "Choice Specs" }],
    } as any;

    const handleSelect = vi.fn();

    render(
      <RaidBuildsTab
        recommendedList={[{ name: "Pikachu" } as any]}
        buildGroups={buildGroups}
        effectiveBuildGroupKey="Player 1"
        setSelectedBuildGroup={handleSelect}
        pokemonMap={mockPokemonMap}
      />
    );

    // Group buttons
    expect(
      screen.getByRole("button", { name: "Player 1" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Player 2" })
    ).toBeInTheDocument();

    // Active build group
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    expect(screen.getByText("Light Ball")).toBeInTheDocument();
    expect(screen.queryByText("Raichu")).not.toBeInTheDocument();

    // Click another group
    fireEvent.click(screen.getByRole("button", { name: "Player 2" }));
    expect(handleSelect).toHaveBeenCalledWith("Player 2");
  });
});
