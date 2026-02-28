import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ButtonSelect from "./ButtonSelect";

describe("ButtonSelect component", () => {
  const options = [1, 2, 3, 4, 5];

  it("renders a label if provided", () => {
    render(
      <ButtonSelect
        options={options}
        value={3}
        onChange={() => {}}
        label="Select IV"
      />
    );
    expect(screen.getByText("Select IV")).toBeInTheDocument();
  });

  it("renders all options", () => {
    render(<ButtonSelect options={options} value={3} onChange={() => {}} />);
    options.forEach((opt) => {
      // Use exact text match for the number, ignoring the "IV" span text if needed
      expect(screen.getByText(opt.toString())).toBeInTheDocument();
    });
  });

  it("calls onChange when an option is clicked", () => {
    const handleChange = vi.fn();
    render(
      <ButtonSelect options={options} value={3} onChange={handleChange} />
    );

    fireEvent.click(screen.getByText("4"));
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("highlights the currently selected value", () => {
    render(<ButtonSelect options={options} value={2} onChange={() => {}} />);
    // The button containing "2" should have active class "bg-blue-600"
    const activeBtn = screen.getByText("2").closest("button");
    const inactiveBtn = screen.getByText("5").closest("button");

    expect(activeBtn).toHaveClass("bg-blue-600");
    expect(inactiveBtn).not.toHaveClass("bg-blue-600");
  });
});
