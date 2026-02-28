import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { StrategyVariation } from "@/types/teams";

import VariationForm from "./VariationForm";

// Mock the hook so it doesn't try to fetch data during test
vi.mock("@/hooks/usePokedexData", () => ({
  usePokedexData: () => ({}),
}));

// Mock the nested step component to trigger its callbacks easily
vi.mock("./SortableNestedStepItem", () => ({
  SortableNestedStepItem: ({
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
    <div data-testid={`nested-step-${id}`}>
      <button
        data-testid={`change-nested-${id}`}
        onClick={(e) => {
          e.stopPropagation();
          onChange({ ...step, player: "UpdatedNested" });
        }}
      >
        Change
      </button>
      <button
        data-testid={`remove-nested-${id}`}
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

// Mock DnD Context to test dragging
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
          onDragEnd({
            active: { id: "nstep1" },
            over: { id: "nstep2" },
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

describe("VariationForm component", () => {
  const mockVariation: StrategyVariation = {
    type: "step",
    name: "If Opponent uses Earthquake",
    steps: [
      {
        id: "nstep1",
        type: "main",
        player: "Pikachu",
        warning: "",
        variations: [],
      },
      {
        id: "nstep2",
        type: "main",
        player: "Charizard",
        warning: "",
        variations: [],
      },
    ],
  };

  it("renders variation inputs properly", () => {
    render(
      <VariationForm
        variation={mockVariation}
        onChange={vi.fn()}
        onRemove={vi.fn()}
      />
    );
    expect(screen.getByText("Variation Logic")).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText(/e.g. If Leftovers active/i);
    expect(nameInput).toHaveValue("If Opponent uses Earthquake");
  });

  it("handles field changes including select logic type", () => {
    const handleChange = vi.fn();
    render(
      <VariationForm
        variation={mockVariation}
        onChange={handleChange}
        onRemove={vi.fn()}
      />
    );

    // Change Name
    const nameInput = screen.getByPlaceholderText(/e.g. If Leftovers active/i);
    fireEvent.change(nameInput, { target: { value: "If Rain is active" } });
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: "If Rain is active" })
    );

    // Change Type (Select dropdown)
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "" } });
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ type: "" })
    );
  });

  it("calls onRemove when remove button is clicked", () => {
    const handleRemove = vi.fn();
    render(
      <VariationForm
        variation={mockVariation}
        onChange={vi.fn()}
        onRemove={handleRemove}
      />
    );

    fireEvent.click(screen.getByText("Remove Variation"));
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it("adds a sub-step correctly", () => {
    const handleChange = vi.fn();
    render(
      <VariationForm
        variation={{ ...mockVariation, steps: undefined }} // Test fallback to empty array
        onChange={handleChange}
        onRemove={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText("+ Add Sub-Step"));

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        steps: expect.arrayContaining([
          expect.objectContaining({ type: "main" }),
        ]),
      })
    );
  });

  it("handles onChange from SortableNestedStepItem", () => {
    const handleChange = vi.fn();
    render(
      <VariationForm
        variation={mockVariation}
        onChange={handleChange}
        onRemove={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId("change-nested-nstep1"));
    expect(handleChange).toHaveBeenCalledTimes(1);

    const updatedSteps = handleChange.mock.calls[0][0].steps;
    expect(updatedSteps[0].player).toBe("UpdatedNested");
    expect(updatedSteps[1].id).toBe("nstep2"); // Unchanged
  });

  it("handles onRemove from SortableNestedStepItem", () => {
    const handleChange = vi.fn();
    render(
      <VariationForm
        variation={mockVariation}
        onChange={handleChange}
        onRemove={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId("remove-nested-nstep1"));
    expect(handleChange).toHaveBeenCalledTimes(1);

    const updatedSteps = handleChange.mock.calls[0][0].steps;
    expect(updatedSteps.length).toBe(1);
    expect(updatedSteps[0].id).toBe("nstep2");
  });

  it("handles drag end array move logic", () => {
    const handleChange = vi.fn();
    render(
      <VariationForm
        variation={mockVariation}
        onChange={handleChange}
        onRemove={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId("dnd-context"));

    expect(handleChange).toHaveBeenCalledTimes(1);
    const updatedSteps = handleChange.mock.calls[0][0].steps;
    // nstep1 moved after nstep2
    expect(updatedSteps[0].id).toBe("nstep2");
    expect(updatedSteps[1].id).toBe("nstep1");
  });
});
