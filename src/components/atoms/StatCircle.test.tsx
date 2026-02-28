import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import StatCircle from "./StatCircle";

describe("StatCircle component", () => {
  it("returns null when no ivColors are provided", () => {
    const { container } = render(<StatCircle ivColors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders an SVG with paths corresponding to ivColors", () => {
    const { container } = render(
      <StatCircle ivColors={["red", "blue", "green"]} />
    );
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(3);

    expect(paths[0]).toHaveAttribute("fill", "red");
    expect(paths[1]).toHaveAttribute("fill", "blue");
    expect(paths[2]).toHaveAttribute("fill", "green");
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    const { container } = render(
      <StatCircle ivColors={["red"]} onClick={handleClick} />
    );

    const div = container.firstElementChild as HTMLElement;
    fireEvent.click(div);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies active styles when isActive is true", () => {
    const { container } = render(<StatCircle ivColors={["red"]} isActive />);
    const div = container.firstElementChild as HTMLElement;
    expect(div).toHaveClass("scale-110");
  });

  it("applies dimmed styles when isDimmed is true", () => {
    const { container } = render(<StatCircle ivColors={["red"]} isDimmed />);
    const div = container.firstElementChild as HTMLElement;
    expect(div).toHaveClass("opacity-20");
  });
});
