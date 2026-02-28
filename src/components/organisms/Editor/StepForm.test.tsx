import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import StepForm from "./StepForm";

vi.mock("@/hooks/usePokedexData", () => ({
  usePokedexData: () => ({}),
}));

const mockStep = {
  id: "1",
  type: "main",
  player: "Use Move",
};

describe("StepForm component", () => {
  it("renders textarea and allows editing", () => {
    const handleChange = vi.fn();
    render(<StepForm step={mockStep} onChange={handleChange} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("Use Move");

    fireEvent.change(textarea, { target: { value: "Use Move!" } });
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ player: "Use Move!" })
    );
  });

  it("appends instruction tags to text", () => {
    const handleChange = vi.fn();
    render(<StepForm step={mockStep} onChange={handleChange} />);

    fireEvent.click(screen.getByText("[SWITCH]"));

    // It should add a space and the tag if text exists
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ player: "Use Move [SWITCH]" })
    );
  });

  it("toggles and edits warning field", () => {
    const handleChange = vi.fn();
    render(<StepForm step={mockStep} onChange={handleChange} />);

    // Enable warning
    fireEvent.click(screen.getByText("Add Warning"));

    const warningInput = screen.getByPlaceholderText(/Warning note/i);
    expect(warningInput).toBeInTheDocument();

    fireEvent.change(warningInput, { target: { value: "Careful" } });
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ warning: "Careful" })
    );
  });

  it("toggles branching scenarios", () => {
    render(
      <StepForm
        step={mockStep}
        onChange={() => {
          /* noop */
        }}
      />
    );

    // Enable branching
    fireEvent.click(screen.getByText("Branching"));

    expect(screen.getByText("Branching Scenarios")).toBeInTheDocument();
    expect(screen.getByText("+ Add Branch")).toBeInTheDocument();
  });
});
