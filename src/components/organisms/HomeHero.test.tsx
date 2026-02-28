import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomeHero from "./HomeHero";

describe("HomeHero component", () => {
  it("renders the welcome title", () => {
    render(<HomeHero />);
    expect(screen.getByText("Welcome, Trainer.")).toBeInTheDocument();
  });

  it("renders the description paragraph", () => {
    render(<HomeHero />);
    expect(
      screen.getByText(/The ultimate companion for your PokéMMO journey/i)
    ).toBeInTheDocument();
  });
});
