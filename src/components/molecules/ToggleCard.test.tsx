import { fireEvent, render, screen } from "@testing-library/react";
import { Zap } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import ToggleCard from "./ToggleCard";

describe("ToggleCard component", () => {
  it("renders title, subtitle and icon", () => {
    render(
      <ToggleCard
        title="Night Mode"
        subtitle="Dark theme"
        isActive={false}
        onClick={() => {
          /* noop */
        }}
        icon={Zap}
      />
    );
    expect(screen.getByText("Night Mode")).toBeInTheDocument();
    expect(screen.getByText("Dark theme")).toBeInTheDocument();
    expect(document.querySelector("svg")).toBeInTheDocument(); // Lucide icon
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    const { container } = render(
      <ToggleCard
        title="Night"
        subtitle="Mode"
        isActive={false}
        onClick={handleClick}
      />
    );

    const div = container.firstElementChild as HTMLElement;
    fireEvent.click(div);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies active classes when isActive is true", () => {
    const { container } = render(
      <ToggleCard
        title="Night"
        subtitle="Mode"
        isActive={true}
        onClick={() => {
          /* noop */
        }}
        activeBgClass="custom-bg-active"
        activeTextClass="custom-text-active"
      />
    );

    const div = container.firstElementChild as HTMLElement;
    expect(div).toHaveClass("custom-bg-active");

    const titleSpan = screen.getByText("Night");
    expect(titleSpan).toHaveClass("custom-text-active");
  });
});
