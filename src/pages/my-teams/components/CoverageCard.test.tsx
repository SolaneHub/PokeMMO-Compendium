import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CoverageCard from "./CoverageCard";

describe("CoverageCard component", () => {
  it("renders region and percentage", () => {
    render(<CoverageCard region="Kanto" percent={45} />);
    expect(screen.getByText("Kanto")).toBeInTheDocument();
    expect(screen.getByText("45%")).toBeInTheDocument();
  });

  it("renders the large background initial letter", () => {
    render(<CoverageCard region="Hoenn" percent={100} />);
    // Large background letter
    const bgLetter = screen.getByText("H");
    expect(bgLetter).toBeInTheDocument();
    expect(bgLetter).toHaveClass("text-6xl");
  });

  it("sets the progress bar width according to percentage", () => {
    const { container } = render(<CoverageCard region="Sinnoh" percent={82} />);
    // Select the div with the background gradient
    const progressBar = container.querySelector(".bg-gradient-to-r");
    expect(progressBar).toHaveStyle({ width: "82%" });
  });
});
