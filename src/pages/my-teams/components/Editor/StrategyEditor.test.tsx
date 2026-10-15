import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import StrategyEditor from "./StrategyEditor";

// Mock PokedexContext so child StepForm renders safely without PokedexProvider
vi.mock("@/context/PokedexContext", () => ({
  usePokedexContext: () => ({}),
}));

describe("StrategyEditor component", () => {
  const mockSteps = [
    {
      id: "step1",
      type: "main" as const,
      player: "Pikachu",
      warning: "",
      variations: [],
    },
    {
      id: "step2",
      type: "main" as const,
      player: "Charizard",
      warning: "",
      variations: [],
    },
  ];

  it("renders placeholder if no enemy is selected", () => {
    render(
      <StrategyEditor
        selectedEnemyPokemon={null}
        steps={[]}
        onUpdateSteps={vi.fn()}
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
        onUpdateSteps={vi.fn()}
      />
    );
    expect(screen.getByText(/No plan defined for/)).toBeInTheDocument();
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

  it("renders list of steps and handles add step from top/bottom buttons", () => {
    const handleUpdate = vi.fn();
    render(
      <StrategyEditor
        selectedEnemyPokemon="Charizard"
        steps={mockSteps}
        onUpdateSteps={handleUpdate}
      />
    );

    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 2")).toBeInTheDocument();

    const addButtons = screen.getAllByText(/Add.*Step/i);
    expect(addButtons.length).toBeGreaterThan(0);

    // Click top add button
    const firstAddBtn = addButtons[0];
    if (firstAddBtn) fireEvent.click(firstAddBtn);
    expect(handleUpdate).toHaveBeenCalledTimes(1);
    const firstCall = handleUpdate.mock.calls[0];
    if (firstCall?.[0]) {
      expect(firstCall[0].length).toBe(3); // 2 existing + 1 new
    }
  });

  it("handles onRemove from SortableStepItem", () => {
    const handleUpdate = vi.fn();
    render(
      <StrategyEditor
        selectedEnemyPokemon="Charizard"
        steps={mockSteps}
        onUpdateSteps={handleUpdate}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Remove step 1" }));
    expect(handleUpdate).toHaveBeenCalledTimes(1);

    // Verify first step was removed
    const firstCall = handleUpdate.mock.calls[0];
    const newSteps = firstCall?.[0];
    if (newSteps) {
      expect(newSteps.length).toBe(1);
      expect(newSteps[0].id).toBe("step2");
    }
  });

  it("reorders items when clicking Move step down button on the first step", () => {
    const handleUpdate = vi.fn();
    render(
      <StrategyEditor
        selectedEnemyPokemon="Charizard"
        steps={mockSteps}
        onUpdateSteps={handleUpdate}
      />
    );

    const moveDownButtons = screen.getAllByRole("button", {
      name: "Move step down",
    });
    const firstButton = moveDownButtons[0];
    expect(firstButton).toBeDefined();
    if (!firstButton) throw new Error("Button not found");

    // First step's move down button should be active
    expect(firstButton).toBeEnabled();
    // Last step's move down button should be disabled
    expect(moveDownButtons[1]).toBeDisabled();

    fireEvent.click(firstButton);

    expect(handleUpdate).toHaveBeenCalledTimes(1);
    const firstCall = handleUpdate.mock.calls[0];
    const newSteps = firstCall?.[0];
    if (newSteps) {
      expect(newSteps[0].id).toBe("step2");
      expect(newSteps[1].id).toBe("step1");
    }
  });

  it("reorders items when clicking Move step up button on the second step", () => {
    const handleUpdate = vi.fn();
    render(
      <StrategyEditor
        selectedEnemyPokemon="Charizard"
        steps={mockSteps}
        onUpdateSteps={handleUpdate}
      />
    );

    const moveUpButtons = screen.getAllByRole("button", {
      name: "Move step up",
    });
    const secondButton = moveUpButtons[1];
    expect(secondButton).toBeDefined();
    if (!secondButton) throw new Error("Button not found");

    // First step's move up button should be disabled
    expect(moveUpButtons[0]).toBeDisabled();
    // Second step's move up button should be active
    expect(secondButton).toBeEnabled();

    fireEvent.click(secondButton);

    expect(handleUpdate).toHaveBeenCalledTimes(1);
    const firstCall = handleUpdate.mock.calls[0];
    const newSteps = firstCall?.[0];
    if (newSteps) {
      expect(newSteps[0].id).toBe("step2");
      expect(newSteps[1].id).toBe("step1");
    }
  });
});
