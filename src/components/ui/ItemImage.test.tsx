import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ItemImage from "./ItemImage";

describe("ItemImage component", () => {
  it("renders an image with correct alt text", () => {
    render(<ItemImage item="Leftovers" />);
    const img = screen.getByAltText("Leftovers");
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe("IMG");
  });

  it("hides the image on error", () => {
    render(<ItemImage item="UnknownItem123" />);
    const img = screen.getByAltText("UnknownItem123");

    // Trigger error event
    fireEvent.error(img);

    expect(img).toHaveStyle({ display: "none" });
  });

  it("applies custom className", () => {
    render(<ItemImage item="Choice Band" className="custom-class-123" />);
    const img = screen.getByAltText("Choice Band");
    expect(img).toHaveClass("custom-class-123");
  });
});
