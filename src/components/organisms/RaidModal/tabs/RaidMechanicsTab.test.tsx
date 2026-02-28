import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import RaidMechanicsTab from "./RaidMechanicsTab";

const mockRaid = {
  name: "Mewtwo",
  stars: 5,
  moves: ["Psychic", "Aura Sphere"],
  teamStrategies: [],
  mechanics: {
    ability: "Pressure",
    heldItem: "Twisted Spoon",
    notes: "Very dangerous",
    thresholds: {
      "50": "Raises Shields",
      "25": { effect: "Wipes Stats" },
    },
  },
};

describe("RaidMechanicsTab component", () => {
  it("renders nothing if no mechanics are provided", () => {
    const { container } = render(
      <RaidMechanicsTab currentRaid={{ ...mockRaid, mechanics: undefined }} />
    );
    expect(container.innerHTML).toBe("<div></div>");
  });

  it("renders boss info correctly", () => {
    render(<RaidMechanicsTab currentRaid={mockRaid} />);

    expect(screen.getByText("Boss Info")).toBeInTheDocument();
    expect(screen.getByText("Pressure")).toBeInTheDocument();
    expect(screen.getByText("Twisted Spoon")).toBeInTheDocument();
    expect(screen.getByText("Very dangerous")).toBeInTheDocument();
  });

  it("renders hp thresholds correctly", () => {
    render(<RaidMechanicsTab currentRaid={mockRaid} />);

    expect(screen.getByText("HP Thresholds")).toBeInTheDocument();
    expect(screen.getByText("50% HP")).toBeInTheDocument();
    expect(screen.getByText("Raises Shields")).toBeInTheDocument();

    expect(screen.getByText("25% HP")).toBeInTheDocument();
    expect(screen.getByText("Wipes Stats")).toBeInTheDocument();
  });

  it("renders known moves correctly", () => {
    render(<RaidMechanicsTab currentRaid={mockRaid} />);

    expect(screen.getByText("Known Moves")).toBeInTheDocument();
    expect(screen.getByText("Psychic")).toBeInTheDocument();
    expect(screen.getByText("Aura Sphere")).toBeInTheDocument();
  });
});
