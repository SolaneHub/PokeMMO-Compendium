import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomeFooter from "./HomeFooter";

describe("HomeFooter component", () => {
  it("renders the about section and github link", () => {
    render(<HomeFooter />);
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(
      screen.getByText(/This compendium is a community-driven/i)
    ).toBeInTheDocument();

    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/SolaneHub/PokeMMO-Compendium"
    );
  });

  it("renders the credits section and external links", () => {
    render(<HomeFooter />);
    expect(screen.getByText("Credits")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Caav.PokéMMO" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "PokeMMO Raid Den Discord" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Money Guide/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Optimal PvE Pickup/i })
    ).toBeInTheDocument();
  });
});
