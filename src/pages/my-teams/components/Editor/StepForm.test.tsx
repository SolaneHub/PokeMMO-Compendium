import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import StepForm from "./StepForm";

// Mock child component to focus test on StepForm logic
vi.mock("./VariationForm", () => ({
  default: ({
    variation,
    onChange,
    onRemove,
  }: {
    variation: { name: string };
    onChange: (v: unknown) => void;
    onRemove: () => void;
  }) => (
    <div data-testid="variation-form">
      <span>{variation.name}</span>
      <button onClick={() => onChange({ ...variation, name: "Updated" })}>
        Change Var
      </button>
      <button onClick={onRemove}>Remove Var</button>
    </div>
  ),
}));

// Mock hook
vi.mock("@/hooks/usePokedexData", () => ({
  usePokedexData: vi.fn(),
}));

describe("StepForm component", () => {
  const mockStep = {
    id: "1",
    type: "main" as const,
    player: "Initial move",
    warning: "",
    variations: [],
  };

  it("renders textarea and allows editing", () => {
    const handleChange = vi.fn();
    render(<StepForm step={mockStep} onChange={handleChange} />);

    const textarea = screen.getByPlaceholderText(/Describe your move/i);
    expect(textarea).toHaveValue("Initial move");

    fireEvent.change(textarea, { target: { value: "New move" } });
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ player: "New move" })
    );
  });

  it("handles tag insertion", () => {
    const handleChange = vi.fn();
    render(<StepForm step={mockStep} onChange={handleChange} />);

    const switchTag = screen.getByText("[SWITCH]");
    fireEvent.click(switchTag);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ player: "Initial move [SWITCH]" })
    );
  });

  it("toggles and handles warning note", () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <StepForm step={mockStep} onChange={handleChange} />
    );

    // Add Warning
    fireEvent.click(screen.getByText(/Add Warning/i));
    const warningInput = screen.getByPlaceholderText(/Warning note/i);
    expect(warningInput).toBeInTheDocument();

    fireEvent.change(warningInput, { target: { value: "Careful!" } });
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ warning: "Careful!" })
    );

    // Test removing warning via the X button
    rerender(
      <StepForm
        step={{ ...mockStep, warning: "Careful!" }}
        onChange={handleChange}
      />
    );
    const removeBtn = screen.getByRole("button", { name: "" }); // lucide-X button
    fireEvent.click(removeBtn);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ warning: undefined })
    );
  });

  it("toggles advanced scenarios and handles variations", () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <StepForm step={mockStep} onChange={handleChange} />
    );

    // Toggle Branching
    fireEvent.click(screen.getByText(/Branching/i));
    expect(screen.getByText(/No branches added yet/i)).toBeInTheDocument();

    // Add Branch
    fireEvent.click(screen.getByText("+ Add Branch"));
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        variations: [expect.objectContaining({ type: "step" })],
      })
    );

    // Mock step with a variation to test update/remove callbacks
    const stepWithVar = {
      ...mockStep,
      variations: [
        { id: "v1", type: "step" as const, name: "If Crit", steps: [] },
      ],
    };
    rerender(<StepForm step={stepWithVar} onChange={handleChange} />);

    // Test Variation onChange
    fireEvent.click(screen.getByText("Change Var"));
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        variations: [expect.objectContaining({ name: "Updated" })],
      })
    );

    // Test Variation onRemove
    fireEvent.click(screen.getByText("Remove Var"));
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        variations: [],
      })
    );
  });
});
