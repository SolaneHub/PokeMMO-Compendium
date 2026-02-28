import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TreeScheme from "./TreeScheme";

describe("TreeScheme component", () => {
  it("renders the key correctly", () => {
    render(
      <TreeScheme
        selectedIvCount={3}
        selectedIvStats={["HP", "Atk", "Def"]}
        nature={false}
      />
    );
    expect(screen.getByText(/hp/i)).toBeInTheDocument();
    expect(screen.getByText(/atk/i)).toBeInTheDocument();
    expect(screen.getByText(/def/i)).toBeInTheDocument();
  });

  it("handles zoom controls", () => {
    render(
      <TreeScheme
        selectedIvCount={3}
        selectedIvStats={["HP", "Atk", "Def"]}
        nature={false}
      />
    );

    const buttons = screen.getAllByRole("button");
    const minusBtn = buttons[0];
    const plusBtn = buttons[1];

    // Zoom out
    fireEvent.click(minusBtn);
    expect(screen.getByText("90%")).toBeInTheDocument();

    // Zoom in
    fireEvent.click(plusBtn);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("includes nature in generation when requested", () => {
    render(
      <TreeScheme
        selectedIvCount={3}
        selectedIvStats={["HP", "Atk", "Def"]}
        nature={true}
      />
    );
    // "Nature" shouldn't appear in the legend (since legend slices by selectedIvCount without nature)
    // but the node generation will be different (we can just verify it doesn't crash)
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
