import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import StrategyEditor from "./StrategyEditor";

// Mock child component to easily trigger callbacks
vi.mock("./SortableStepItem", () => ({
  SortableStepItem: ({
    id,
    step,
    onChange,
    onRemove,
  }: {
    id: string;
    step: { player: string };
    onChange: (s: unknown) => void;
    onRemove: () => void;
  }) => (
    <div data-testid={`step-${id}`}>
      <button
        data-testid={`change-${id}`}
        onClick={(e) => {
          e.stopPropagation();
          onChange({ ...step, player: "UpdatedPlayer" });
        }}
      >
        Change
      </button>
      <button
        data-testid={`remove-${id}`}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        Remove
      </button>
    </div>
  ),
}));

// Mock DnD Context to expose its onDragEnd handler for testing
vi.mock("@dnd-kit/core", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    DndContext: ({
      children,
      onDragEnd,
    }: {
      children: React.ReactNode;
      onDragEnd: (event: unknown) => void;
    }) => (
      <div
        data-testid="dnd-context"
        onClick={() => {
          // Simulate drag end event
          onDragEnd({
            active: { id: "step1" },
            over: { id: "step2" },
          });
        }}
      >
        {children}
      </div>
    ),
    useSensor: vi.fn(),
    useSensors: vi.fn(),
  };
});

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

    expect(screen.getByTestId("step-step1")).toBeInTheDocument();
    expect(screen.getByTestId("step-step2")).toBeInTheDocument();

    const addButtons = screen.getAllByText(/Add.*Step/i);
    expect(addButtons.length).toBeGreaterThan(0);

    // Click top add button
    fireEvent.click(addButtons[0]);
    expect(handleUpdate).toHaveBeenCalledTimes(1);
    expect(handleUpdate.mock.calls[0][0].length).toBe(3); // 2 existing + 1 new
  });

  it("handles onChange from SortableStepItem", () => {
    const handleUpdate = vi.fn();
    render(
      <StrategyEditor
        selectedEnemyPokemon="Charizard"
        steps={mockSteps}
        onUpdateSteps={handleUpdate}
      />
    );

    fireEvent.click(screen.getByTestId("change-step1"));
    expect(handleUpdate).toHaveBeenCalledTimes(1);

    // Verify first step was updated
    const newSteps = handleUpdate.mock.calls[0][0];
    expect(newSteps[0].player).toBe("UpdatedPlayer");
    expect(newSteps[1]).toEqual(mockSteps[1]); // second untouched
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

    fireEvent.click(screen.getByTestId("remove-step1"));
    expect(handleUpdate).toHaveBeenCalledTimes(1);

    // Verify first step was removed
    const newSteps = handleUpdate.mock.calls[0][0];
    expect(newSteps.length).toBe(1);
    expect(newSteps[0].id).toBe("step2");
  });

  it("handles handleDragEnd array move logic", () => {
    const handleUpdate = vi.fn();
    render(
      <StrategyEditor
        selectedEnemyPokemon="Charizard"
        steps={mockSteps}
        onUpdateSteps={handleUpdate}
      />
    );

    // Clicking the mocked DndContext container triggers the onDragEnd with simulated payload
    fireEvent.click(screen.getByTestId("dnd-context"));

    expect(handleUpdate).toHaveBeenCalledTimes(1);
    const newSteps = handleUpdate.mock.calls[0][0];
    // Due to active id step1 and over id step2, arrayMove should swap them
    expect(newSteps[0].id).toBe("step2");
    expect(newSteps[1].id).toBe("step1");
  });
});
