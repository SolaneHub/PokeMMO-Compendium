import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SuperTrainerSection from "./SuperTrainerSection";
import { SuperTrainer } from "@/types/superTrainers";
import { Pokemon } from "@/types/pokemon";

const mockTrainer: SuperTrainer = {
  name: "Red",
  region: "Kanto",
  type: "Normal",
  image: "Red.png",
  teams: {
    "Peak Team": {
      pokemonNames: ["Pikachu", "Snorlax"],
      pokemonStrategies: {},
    },
  },
};

const mockPokemonMap = new Map<string, Pokemon>();

describe("SuperTrainerSection component", () => {
  it("renders trainer details", () => {
    render(
      <SuperTrainerSection
        trainer={mockTrainer}
        onPokemonCardClick={() => {}}
        selectedPokemon={null}
        pokemonMap={mockPokemonMap}
      />
    );
    expect(screen.getByText("Red")).toBeInTheDocument();
    expect(screen.getByText("Kanto Trainer")).toBeInTheDocument();
    expect(screen.getByText("Normal")).toBeInTheDocument();
  });

  it("renders the teams and pokemon", () => {
    render(
      <SuperTrainerSection
        trainer={mockTrainer}
        onPokemonCardClick={() => {}}
        selectedPokemon={null}
        pokemonMap={mockPokemonMap}
      />
    );
    expect(screen.getByText("Peak Team")).toBeInTheDocument();
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    expect(screen.getByText("Snorlax")).toBeInTheDocument();
  });

  it("calls onPokemonCardClick when a pokemon is clicked", () => {
    const handleClick = vi.fn();
    render(
      <SuperTrainerSection
        trainer={mockTrainer}
        onPokemonCardClick={handleClick}
        selectedPokemon={null}
        pokemonMap={mockPokemonMap}
      />
    );

    fireEvent.click(screen.getByText("Pikachu").closest("div[role='button']")!);
    expect(handleClick).toHaveBeenCalledWith(
      "Pikachu",
      "Red",
      "Kanto",
      "Peak Team"
    );
  });
});
