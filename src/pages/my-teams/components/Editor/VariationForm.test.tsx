import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { StrategyVariation } from "@/types/strategy";

import VariationForm from "./VariationForm";

// Mock the hook so it doesn't try to fetch data during test
vi.mock("@/context/PokedexContext", () => ({
  usePokedexContext: () => ({}),
}));

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
        variation={{ ...mockVariation, steps: [] }}
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

  it("handles onRemove for nested step", () => {
    const handleChange = vi.fn();
    render(
      <VariationForm
        variation={mockVariation}
        onChange={handleChange}
        onRemove={vi.fn()}
      />
    );

    const removeButtons = screen.getAllByRole("button", {
      name: "Remove Nested",
    });
    const firstRemoveButton = removeButtons[0];
    expect(firstRemoveButton).toBeDefined();
    if (!firstRemoveButton) throw new Error("Button not found");

    fireEvent.click(firstRemoveButton);
    expect(handleChange).toHaveBeenCalledTimes(1);

    const firstCall = handleChange.mock.calls[0];
    const updatedSteps = firstCall?.[0]?.steps;
    if (updatedSteps) {
      expect(updatedSteps.length).toBe(1);
      expect(updatedSteps[0].id).toBe("nstep2");
    }
  });

  it("reorders nested steps when clicking Move step down button on first step", () => {
    const handleChange = vi.fn();
    render(
      <VariationForm
        variation={mockVariation}
        onChange={handleChange}
        onRemove={vi.fn()}
      />
    );

    const moveDownButtons = screen.getAllByRole("button", {
      name: "Move step down",
    });
    const firstMoveDownButton = moveDownButtons[0];
    expect(firstMoveDownButton).toBeDefined();
    if (!firstMoveDownButton) throw new Error("Button not found");

    expect(firstMoveDownButton).toBeEnabled();
    expect(moveDownButtons[1]).toBeDisabled();

    fireEvent.click(firstMoveDownButton);

    expect(handleChange).toHaveBeenCalledTimes(1);
    const firstCall = handleChange.mock.calls[0];
    const updatedSteps = firstCall?.[0]?.steps;
    if (updatedSteps) {
      expect(updatedSteps[0].id).toBe("nstep2");
      expect(updatedSteps[1].id).toBe("nstep1");
    }
  });

  it("reorders nested steps when clicking Move step up button on second step", () => {
    const handleChange = vi.fn();
    render(
      <VariationForm
        variation={mockVariation}
        onChange={handleChange}
        onRemove={vi.fn()}
      />
    );

    const moveUpButtons = screen.getAllByRole("button", {
      name: "Move step up",
    });
    const secondMoveUpButton = moveUpButtons[1];
    expect(secondMoveUpButton).toBeDefined();
    if (!secondMoveUpButton) throw new Error("Button not found");

    expect(moveUpButtons[0]).toBeDisabled();
    expect(secondMoveUpButton).toBeEnabled();

    fireEvent.click(secondMoveUpButton);

    expect(handleChange).toHaveBeenCalledTimes(1);
    const firstCall = handleChange.mock.calls[0];
    const updatedSteps = firstCall?.[0]?.steps;
    if (updatedSteps) {
      expect(updatedSteps[0].id).toBe("nstep2");
      expect(updatedSteps[1].id).toBe("nstep1");
    }
  });
});
