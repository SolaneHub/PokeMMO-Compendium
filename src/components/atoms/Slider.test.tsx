import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Slider from "./Slider";

describe("Slider component", () => {
  it("renders with label and value", () => {
    render(
      <Slider
        label="Volume"
        value={50}
        onChange={() => {
          /* noop */
        }}
      />
    );
    expect(screen.getByText("Volume")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("renders with a custom display value", () => {
    render(
      <Slider
        label="Volume"
        value={50}
        displayValue="50%"
        onChange={() => {
          /* noop */
        }}
      />
    );
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("calls onChange when the range input changes", () => {
    const handleChange = vi.fn();
    render(<Slider label="Volume" value={50} onChange={handleChange} />);

    const input = screen.getByRole("slider");
    fireEvent.change(input, { target: { value: "75" } });

    expect(handleChange).toHaveBeenCalledWith(75);
  });

  it("sets correct width percentage based on min and max", () => {
    // 50 out of 200 should be 25% width
    render(
      <Slider
        label="Speed"
        value={50}
        min={0}
        max={200}
        onChange={() => {
          /* noop */
        }}
      />
    );

    // We check the style of the inner div (which provides the colored bar)
    // There are a few divs, so we can check if the percentage width is applied
    const sliderContainer =
      screen.getByText("Speed").parentElement?.nextElementSibling;
    const innerBar = sliderContainer?.querySelector(".absolute.top-0");

    expect(innerBar).toHaveStyle({ width: "25%" });
  });
});
