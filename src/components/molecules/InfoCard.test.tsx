import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import InfoCard from "./InfoCard";

describe("InfoCard component", () => {
  it("renders label and value", () => {
    render(<InfoCard label="Ability" value="Overgrow" />);
    expect(screen.getByText("Ability")).toBeInTheDocument();
    expect(screen.getByText("Overgrow")).toBeInTheDocument();
  });

  it("renders 'None' if value is missing or falsy", () => {
    render(<InfoCard label="Hidden Ability" value={null} />);
    expect(screen.getByText("Hidden Ability")).toBeInTheDocument();
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("applies custom classes to label and value", () => {
    render(
      <InfoCard
        label="Type"
        value="Grass"
        labelClass="text-green-500"
        valueClass="font-black"
      />
    );
    expect(screen.getByText("Type")).toHaveClass("text-green-500");
    expect(screen.getByText("Grass")).toHaveClass("font-black");
  });
});
