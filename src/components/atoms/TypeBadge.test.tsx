import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TypeBadge from "./TypeBadge";
import { typeBackgrounds } from "@/utils/pokemonColors";

describe("TypeBadge component", () => {
  it("renders the correct text", () => {
    render(<TypeBadge type="Fire" />);
    expect(screen.getByText("Fire")).toBeInTheDocument();
  });

  it("applies the correct background from typeBackgrounds", () => {
    render(<TypeBadge type="Water" />);
    const badge = screen.getByText("Water");
    expect(badge).toHaveStyle({ background: typeBackgrounds["Water"] });
  });

  it("applies the default background when type is unknown", () => {
    // Cast to any to simulate an invalid type coming from API
    render(<TypeBadge type={"UnknownType" as any} />);
    const badge = screen.getByText("UnknownType");
    expect(badge).toHaveStyle({ background: typeBackgrounds[""] });
  });

  it("applies size classes correctly", () => {
    render(<TypeBadge type="Grass" size="lg" />);
    const badge = screen.getByText("Grass");
    // Checks that one of the lg classes is present
    expect(badge).toHaveClass("px-6");
  });
});
