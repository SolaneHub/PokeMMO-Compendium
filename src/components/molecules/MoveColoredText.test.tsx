import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import MoveColoredText from "./MoveColoredText";

// Mock the hook to avoid fetching data and to return controlled loading state
vi.mock("@/hooks/usePokedexData", () => ({
  usePokedexData: () => ({
    pokemonColorMap: {},
    isLoading: false,
  }),
}));

describe("MoveColoredText component", () => {
  it("returns null if text is empty", () => {
    const { container } = render(<MoveColoredText text="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders normal text without tokens", () => {
    render(<MoveColoredText text="Just a normal sentence." />);
    expect(screen.getByText("Just a normal sentence.")).toBeInTheDocument();
  });

  it("renders SVG icons for tokens", () => {
    // The component replaces "[SWITCH]" with a lucide icon
    const { container } = render(
      <MoveColoredText text="Then [SWITCH] to another." />
    );

    // We expect the normal text parts to be present
    expect(screen.getByText("Then")).toBeInTheDocument();
    expect(screen.getByText("to another.")).toBeInTheDocument();

    // The icon SVG should be rendered
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    // RefreshCw icon for SWITCH usually has this class/structure
    expect(svg).toHaveClass("text-blue-400");
  });
});
