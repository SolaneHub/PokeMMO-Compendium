import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { StrategyVariation } from "@/types/teams";

import VariationForm from "./VariationForm";

vi.mock("@/hooks/usePokedexData", () => ({
  usePokedexData: () => ({}),
}));

const mockVariation: StrategyVariation = {
  type: "step",
  name: "If Opponent uses Earthquake",
  steps: [],
};

describe("VariationForm component", () => {
  it("renders variation inputs properly", () => {
    render(
      <VariationForm
        variation={mockVariation}
        onChange={() => {
          /* noop */
        }}
        onRemove={() => {
          /* noop */
        }}
      />
    );
    expect(screen.getByText("Variation Logic")).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText(/e.g. If Leftovers active/i);
    expect(nameInput).toHaveValue("If Opponent uses Earthquake");
  });

  it("handles field changes", () => {
    const handleChange = vi.fn();
    render(
      <VariationForm
        variation={mockVariation}
        onChange={handleChange}
        onRemove={() => {
          /* noop */
        }}
      />
    );

    const nameInput = screen.getByPlaceholderText(/e.g. If Leftovers active/i);
    fireEvent.change(nameInput, { target: { value: "If Rain is active" } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: "If Rain is active" })
    );
  });

  it("calls onRemove when remove button is clicked", () => {
    const handleRemove = vi.fn();
    render(
      <VariationForm
        variation={mockVariation}
        onChange={() => {
          /* noop */
        }}
        onRemove={handleRemove}
      />
    );

    fireEvent.click(screen.getByText("Remove Variation"));
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it("adds a sub-step", () => {
    const handleChange = vi.fn();
    render(
      <VariationForm
        variation={mockVariation}
        onChange={handleChange}
        onRemove={() => {
          /* noop */
        }}
      />
    );

    fireEvent.click(screen.getByText("+ Add Sub-Step"));

    // Check if onChange was called with a new step added
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        steps: expect.arrayContaining([
          expect.objectContaining({ type: "main" }),
        ]),
      })
    );
  });
});
