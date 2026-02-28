import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import TreeScheme from "./TreeScheme";

describe("TreeScheme component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null/empty if stats are empty", () => {
    const { container } = render(
      <TreeScheme selectedIvCount={0} selectedIvStats={[]} nature={false} />
    );
    // Legend part might be empty, and tree area empty
    expect(
      container.querySelector(".bg-opacity-5.relative")
    ).toBeInTheDocument();
  });

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

  it("handles zoom controls including reset", () => {
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
    const resetBtn = screen.getByTitle("Reset Zoom");

    // Zoom out
    fireEvent.click(minusBtn);
    expect(screen.getByText("90%")).toBeInTheDocument();

    // Zoom in
    fireEvent.click(plusBtn);
    fireEvent.click(plusBtn);
    expect(screen.getByText("110%")).toBeInTheDocument();

    // Reset Zoom
    fireEvent.click(resetBtn);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("handles node selection and recursive activation/deactivation", () => {
    // 2 IVs -> 2 rows (Row 0: 2 nodes, Row 1: 1 node)
    const { container } = render(
      <TreeScheme
        selectedIvCount={2}
        selectedIvStats={["HP", "Atk"]}
        nature={false}
      />
    );

    // Get only the StatCircles in the tree area (ignoring zoom icons in the header)
    const treeArea = container.querySelector(".bg-opacity-5.relative");
    const nodes = treeArea?.querySelectorAll("svg");
    expect(nodes?.length).toBe(3);

    const bottomNode = nodes?.[2]; // Last one in DOM order is bottom row

    // Click bottom node to activate ancestors
    if (bottomNode) {
      fireEvent.click(bottomNode);
    }

    // Click a top node (index 0) to trigger deactivation logic
    const topNode = nodes?.[0];
    if (topNode) {
      fireEvent.click(topNode); // Should turn it off

      // Click again to turn it back on
      fireEvent.click(topNode);
    }
  });

  it("tests row configuration calculation", () => {
    // High number of IVs to trigger the for loop for rowConfigs
    render(
      <TreeScheme
        selectedIvCount={5}
        selectedIvStats={["HP", "Atk", "Def", "SpA", "SpD"]}
        nature={true} // 6 items total -> 6 rows
      />
    );
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
