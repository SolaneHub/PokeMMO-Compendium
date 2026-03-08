import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { StrategyStep, StrategyVariation } from "@/types/teams";

import StrategyModal from "./StrategyModal";

vi.mock("@/hooks/usePokedexData", () => ({
  usePokedexData: () => ({
    pokemonColorMap: {},
    pokemonNames: [],
  }),
}));

vi.mock("@/context/PokedexContext", () => ({
  usePokedexContext: () => ({}),
}));

const mockHistory: StrategyStep[][] = [];
const mockView: StrategyStep[] = [
  {
    type: "main",
    player: "Use Thunderbolt",
    warning: "Watch out for Ground switch",
    variations: [
      { type: "switch", name: "Switch to Gyarados" } as StrategyVariation,
    ],
  },
];

describe("StrategyModal component", () => {
  it("renders pokemon name and title background", () => {
    render(
      <StrategyModal
        currentPokemonObject={{ name: "Pikachu" }}
        detailsTitleBackground="red"
        strategyHistory={mockHistory}
        currentStrategyView={mockView}
        onClose={vi.fn()}
        onBack={vi.fn()}
        onStepClick={vi.fn()}
      />
    );
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
  });

  it("renders the current strategy view", () => {
    render(
      <StrategyModal
        currentPokemonObject={{ name: "Pikachu" }}
        detailsTitleBackground="red"
        strategyHistory={mockHistory}
        currentStrategyView={mockView}
        onClose={vi.fn()}
        onBack={vi.fn()}
        onStepClick={vi.fn()}
      />
    );
    expect(screen.getByText("Use")).toBeInTheDocument();
    expect(screen.getByText("Thunderbolt")).toBeInTheDocument();
    expect(
      screen.getByText("⚠️ Watch out for Ground switch")
    ).toBeInTheDocument();
    expect(screen.getByText("Switch to Gyarados")).toBeInTheDocument();
  });

  it("renders empty state if no strategy", () => {
    render(
      <StrategyModal
        currentPokemonObject={{ name: "Pikachu" }}
        detailsTitleBackground="red"
        strategyHistory={[]}
        currentStrategyView={[]}
        onClose={vi.fn()}
        onBack={vi.fn()}
        onStepClick={vi.fn()}
      />
    );
    expect(
      screen.getByText("No strategy available for this Pokémon.")
    ).toBeInTheDocument();
  });
});
