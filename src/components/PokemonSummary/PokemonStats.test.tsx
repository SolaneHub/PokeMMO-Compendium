import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PokemonStats from "./PokemonStats";

const mockStats = { hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 };
const mockDefenses = {
  Fighting: 2, // 2x Weakness
  Ghost: 0, // Immunity
  Bug: 0.5, // Resistance
};

describe("PokemonStats component", () => {
  it("renders the stats correctly", () => {
    render(<PokemonStats stats={mockStats} defenses={mockDefenses} />);

    expect(screen.getByText("Base Stats")).toBeInTheDocument();
    expect(screen.getByText("hp")).toBeInTheDocument();
    expect(screen.getByText("spe")).toBeInTheDocument();

    // There are 6 stats with value 100
    const values = screen.getAllByText("100");
    expect(values.length).toBe(6);
  });

  it("renders weakness and resistance correctly based on defense object", () => {
    render(<PokemonStats stats={mockStats} defenses={mockDefenses} />);

    expect(screen.getByText("Weakness & Resistance")).toBeInTheDocument();

    // Fighting is 2x
    expect(screen.getByText("2x")).toBeInTheDocument();
    expect(screen.getByText("Fighting")).toBeInTheDocument();

    // Ghost is 0x
    expect(screen.getByText("0x")).toBeInTheDocument();
    expect(screen.getByText("Ghost")).toBeInTheDocument();

    // Bug is 0.5x
    expect(screen.getByText("0.5x")).toBeInTheDocument();
    expect(screen.getByText("Bug")).toBeInTheDocument();
  });

  it("renders fallback if defenses are null", () => {
    render(<PokemonStats stats={mockStats} defenses={null} />);
    expect(screen.getByText("Type data not available.")).toBeInTheDocument();
  });
});
