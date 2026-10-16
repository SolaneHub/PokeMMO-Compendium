import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import TrainerStrategySection from "@/components/TrainerStrategySection";
import { createMockPokemon } from "@/test/factories";
import { Pokemon } from "@/types/pokemon";

const mockPokemonMap = new Map<string, Pokemon>([
  [
    "Pikachu",
    createMockPokemon({
      id: "025",
      name: "Pikachu",
      types: ["Electric"],
      moves: [],
    }),
  ],
  [
    "Charizard",
    createMockPokemon({
      id: "006",
      name: "Charizard",
      types: ["Fire", "Flying"],
      moves: [],
    }),
  ],
]);

describe("TrainerStrategySection", () => {
  it("renders name, subtitle, type badge and avatar", () => {
    render(
      <TrainerStrategySection
        name="Red"
        subtitle="Kanto Champion"
        type="Fire"
        image="red.png"
        region="Kanto"
        selectedPokemon={null}
        pokemonMap={mockPokemonMap}
        onPokemonCardClick={vi.fn()}
      />
    );

    expect(screen.getByText("Red")).toBeInTheDocument();
    expect(screen.getByText("Kanto Champion")).toBeInTheDocument();
    expect(screen.getByText("Fire")).toBeInTheDocument();

    const image = screen.getByRole("img", { name: "Red" });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("trainers/red.png")
    );
  });

  it("handles image onError by replacing src with placehold.co fallback", () => {
    render(
      <TrainerStrategySection
        name="Blue"
        subtitle="Kanto"
        image="blue.png"
        region="Kanto"
        selectedPokemon={null}
        pokemonMap={mockPokemonMap}
        onPokemonCardClick={vi.fn()}
      />
    );

    const image = screen.getByRole("img", { name: "Blue" });
    fireEvent.error(image);
    expect(image).toHaveAttribute(
      "src",
      "https://placehold.co/128x128/cccccc/333333?text=Blue"
    );
  });

  it("deterministically selects the first team alphabetically and switches team on click", () => {
    const teams = {
      "Team Beta": { pokemonNames: ["Charizard"] },
      "Team Alpha": { pokemonNames: ["Pikachu"] },
    };

    render(
      <TrainerStrategySection
        name="Steven"
        subtitle="Hoenn"
        teams={teams}
        region="Hoenn"
        selectedPokemon={null}
        pokemonMap={mockPokemonMap}
        onPokemonCardClick={vi.fn()}
      />
    );

    // Initial deterministic team should be "Team Alpha"
    expect(screen.getByText("Pokémon for Team Alpha")).toBeInTheDocument();
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    expect(screen.queryByText("Charizard")).not.toBeInTheDocument();

    // Click on "Team Beta"
    const betaBtn = screen.getByRole("button", { name: "Team Beta" });
    fireEvent.click(betaBtn);

    expect(screen.getByText("Pokémon for Team Beta")).toBeInTheDocument();
    expect(screen.getByText("Charizard")).toBeInTheDocument();
  });

  it("calls onPokemonCardClick with (pokemonName, name, region, activeTeam) when pokemon card is clicked", () => {
    const onPokemonCardClick = vi.fn();
    const teams = {
      "Main Team": { pokemonNames: ["Pikachu"] },
    };

    render(
      <TrainerStrategySection
        name="Ash"
        subtitle="Pallet Town"
        teams={teams}
        region="Kanto"
        selectedPokemon={null}
        pokemonMap={mockPokemonMap}
        onPokemonCardClick={onPokemonCardClick}
      />
    );

    const pikachuCard = screen.getByText("Pikachu");
    fireEvent.click(pikachuCard);

    expect(onPokemonCardClick).toHaveBeenCalledWith(
      "Pikachu",
      "Ash",
      "Kanto",
      "Main Team"
    );
  });

  it("handles undefined or empty teams safely without crash", () => {
    const { rerender } = render(
      <TrainerStrategySection
        name="Cynthia"
        subtitle="Sinnoh"
        region="Sinnoh"
        selectedPokemon={null}
        pokemonMap={mockPokemonMap}
        onPokemonCardClick={vi.fn()}
      />
    );

    expect(screen.getByText("Cynthia")).toBeInTheDocument();
    expect(screen.queryByText("Teams")).not.toBeInTheDocument();

    rerender(
      <TrainerStrategySection
        name="Cynthia"
        subtitle="Sinnoh"
        teams={{}}
        region="Sinnoh"
        selectedPokemon={null}
        pokemonMap={mockPokemonMap}
        onPokemonCardClick={vi.fn()}
      />
    );

    expect(screen.queryByText("Teams")).not.toBeInTheDocument();
  });
});
