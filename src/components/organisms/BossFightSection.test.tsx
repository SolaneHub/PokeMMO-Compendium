import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BossFight } from "@/types/bossFights";
import { Pokemon } from "@/types/pokemon";

import BossFightSection from "./BossFightSection";

const mockBossFight: BossFight = {
  name: "Giovanni",
  region: "Kanto",
  type: "Ground",
  image: "Giovanni.png",
  teams: {
    "First Battle": {
      pokemonNames: ["Rhydon", "Nidoqueen"],
      pokemonStrategies: {},
    },
    Rematch: {
      pokemonNames: ["Garchomp", "Hippowdon"],
      pokemonStrategies: {},
    },
  },
};

const mockPokemonMap = new Map<string, Pokemon>();

describe("BossFightSection component", () => {
  it("renders boss details", () => {
    render(
      <BossFightSection
        bossFight={mockBossFight}
        onPokemonCardClick={vi.fn()}
        selectedPokemon={null}
        pokemonMap={mockPokemonMap}
      />
    );
    expect(screen.getByText("Giovanni")).toBeInTheDocument();
    expect(screen.getByText("Kanto")).toBeInTheDocument();
    expect(screen.getByText("Ground")).toBeInTheDocument();
  });

  it("renders teams and defaults to the first one alphabetically", () => {
    render(
      <BossFightSection
        bossFight={mockBossFight}
        onPokemonCardClick={vi.fn()}
        selectedPokemon={null}
        pokemonMap={mockPokemonMap}
      />
    );
    // Teams buttons
    expect(screen.getByText("First Battle")).toBeInTheDocument();
    expect(screen.getByText("Rematch")).toBeInTheDocument();

    // Default selected team pokemon
    expect(screen.getByText("Rhydon")).toBeInTheDocument();
    expect(screen.queryByText("Garchomp")).not.toBeInTheDocument();
  });

  it("switches teams when team button is clicked", () => {
    render(
      <BossFightSection
        bossFight={mockBossFight}
        onPokemonCardClick={vi.fn()}
        selectedPokemon={null}
        pokemonMap={mockPokemonMap}
      />
    );

    fireEvent.click(screen.getByText("Rematch"));

    expect(screen.getByText("Garchomp")).toBeInTheDocument();
    expect(screen.queryByText("Rhydon")).not.toBeInTheDocument();
  });

  it("calls onPokemonCardClick with correct parameters", () => {
    const handleClick = vi.fn();
    render(
      <BossFightSection
        bossFight={mockBossFight}
        onPokemonCardClick={handleClick}
        selectedPokemon={null}
        pokemonMap={mockPokemonMap}
      />
    );

    // Click on Rhydon card
    const rhydonBtn = screen.getByText("Rhydon").closest("div[role='button']");
    if (rhydonBtn) {
      fireEvent.click(rhydonBtn);
    }

    // pokemonName, bossName, region, teamName
    expect(handleClick).toHaveBeenCalledWith(
      "Rhydon",
      "Giovanni",
      "Kanto",
      "First Battle"
    );
  });
});
