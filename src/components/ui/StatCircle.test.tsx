import { fireEvent, render, screen } from "@testing-library/react";
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

  it("renders active state correctly with button and stroke indicators", () => {
    const handleClick = vi.fn();
    render(<StatCircle ivColors={["red"]} isActive onClick={handleClick} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);

    const circle = button.querySelector("circle");
    expect(circle).toBeInTheDocument();
    expect(circle).toHaveAttribute("stroke", "rgba(255,255,255,0.5)");
  });

  it("renders dimmed state correctly with SVG paths", () => {
    const { container } = render(
      <StatCircle ivColors={["red", "blue"]} isDimmed />
    );
    const button = container.querySelector("button");
    expect(button).toBeInTheDocument();
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(2);
  });
});
