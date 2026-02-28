import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PokemonOverview from "./PokemonOverview";
import { Pokemon } from "@/types/pokemon";

const mockPokemon: Pokemon = {
  name: "Snorlax",
  description: "It sleeps constantly.",
  types: ["Normal"],
  baseStats: { hp: 160, atk: 110, def: 65, spa: 65, spd: 110, spe: 30 },
  abilities: { main: ["Immunity", "Thick Fat"], hidden: "Gluttony" },
  height: "2.1m",
  weight: "460.0kg",
  catchRate: 25,
  eggGroups: ["Monster"],
  heldItems: ["Leftovers"],
  moves: [],
  locations: [],
  evolutions: [],
};

describe("PokemonOverview component", () => {
  it("renders description and basic info", () => {
    render(<PokemonOverview pokemon={mockPokemon} />);

    expect(screen.getByText("It sleeps constantly.")).toBeInTheDocument();
    expect(screen.getByText("Immunity")).toBeInTheDocument();
    expect(screen.getByText("Thick Fat")).toBeInTheDocument();

    // Hidden ability has a small tag
    expect(screen.getByText("Gluttony")).toBeInTheDocument();
    expect(screen.getByText("Hidden")).toBeInTheDocument();
  });

  it("renders InfoCards with properties", () => {
    render(<PokemonOverview pokemon={mockPokemon} />);

    expect(screen.getByText("Height")).toBeInTheDocument();
    expect(screen.getByText("2.1m")).toBeInTheDocument();
    expect(screen.getByText("Monster")).toBeInTheDocument(); // Egg group
    expect(screen.getByText("Leftovers")).toBeInTheDocument(); // Held items
  });
});
