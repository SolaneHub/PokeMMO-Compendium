import { render, screen } from "@testing-library/react";
import { Map } from "lucide-react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import FeatureCard from "./FeatureCard";

describe("FeatureCard component", () => {
  it("renders title, description and link correctly", () => {
    render(
      <MemoryRouter>
        <FeatureCard
          title="Interactive Map"
          description="Find all items in regions."
          link="/map"
          icon={Map}
          color="#3b82f6"
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Interactive Map")).toBeInTheDocument();
    expect(screen.getByText("Find all items in regions.")).toBeInTheDocument();

    // Check Link
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/map");
  });

  it("renders the hover gradient element", () => {
    const { container } = render(
      <MemoryRouter>
        <FeatureCard
          title="Map"
          description="Desc"
          link="/map"
          icon={Map}
          color="#123456"
        />
      </MemoryRouter>
    );

    const gradientOverlay = container.querySelector(".absolute.inset-0");
    const styleAttr = gradientOverlay?.getAttribute("style");
    expect(styleAttr).toContain("background");
    expect(styleAttr).toContain("linear-gradient");
  });
});
