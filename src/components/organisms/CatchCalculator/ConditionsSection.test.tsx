import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ConditionsSection from "./ConditionsSection";

// Mocking Slider
vi.mock("@/components/atoms/Slider", () => ({
  default: ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div data-testid="slider">
      <label>{label}</label>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  ),
}));

describe("ConditionsSection", () => {
  const defaultProps = {
    targetHpPercentage: 100,
    setTargetHpPercentage: vi.fn(),
    statusCondition: "None",
    setStatusCondition: vi.fn(),
  };

  it("renders correctly", () => {
    render(<ConditionsSection {...defaultProps} />);
    expect(screen.getByText("Conditions")).toBeInTheDocument();
    expect(screen.getByText("Remaining HP: 100%")).toBeInTheDocument();
  });

  it("calls setStatusCondition when a button is clicked", () => {
    render(<ConditionsSection {...defaultProps} />);

    const sleepBtn = screen.getByText("Asleep");
    fireEvent.click(sleepBtn);

    expect(defaultProps.setStatusCondition).toHaveBeenCalledWith("Asleep");
  });

  it("applies different color classes based on HP", () => {
    const { rerender } = render(
      <ConditionsSection {...defaultProps} targetHpPercentage={100} />
    );

    rerender(<ConditionsSection {...defaultProps} targetHpPercentage={40} />);
    expect(screen.getByText("Remaining HP: 40%")).toBeInTheDocument();

    rerender(<ConditionsSection {...defaultProps} targetHpPercentage={10} />);
    expect(screen.getByText("Remaining HP: 10%")).toBeInTheDocument();
  });
});
