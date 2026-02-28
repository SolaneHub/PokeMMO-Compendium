import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import StrategyEditor from "./StrategyEditor";

describe("StrategyEditor component", () => {
  it("renders placeholder if no enemy is selected", () => {
    render(
      <StrategyEditor
        selectedEnemyPokemon={null}
        steps={[]}
        onUpdateSteps={() => {
          /* noop */
        }}
      />
    );
    expect(
      screen.getByText(/Select an Enemy Pokémon from the sidebar/)
    ).toBeInTheDocument();
  });

  it("renders empty state if no steps defined for enemy", () => {
    render(
      <StrategyEditor
        selectedEnemyPokemon="Charizard"
        steps={[]}
        onUpdateSteps={() => {
          /* noop */
        }}
      />
    );
    expect(screen.getByText(/No plan defined for/)).toBeInTheDocument();
    expect(screen.getAllByText("Charizard").length).toBeGreaterThan(0);
  });

  it("calls onUpdateSteps when creating the first step", () => {
    const handleUpdate = vi.fn();
    render(
      <StrategyEditor
        selectedEnemyPokemon="Charizard"
        steps={[]}
        onUpdateSteps={handleUpdate}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Create First Step" }));
    expect(handleUpdate).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ type: "main" })])
    );
  });
});
