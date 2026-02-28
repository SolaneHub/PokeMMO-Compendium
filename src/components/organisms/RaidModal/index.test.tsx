import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Pokemon } from "@/types/pokemon";

import RaidModal from "./index";

const mockRaid = {
  name: "Rayquaza",
  stars: 5,
  moves: [],
  teamStrategies: [],
  mechanics: {
    ability: "Air Lock",
  },
};

const mockRaidWithStrategy = {
  name: "Rayquaza",
  stars: 5,
  moves: [],
  teamStrategies: [
    {
      name: "Main Strat",
      roles: {
        player2: ["Helping Hand"],
        player1: ["Dragon Claw"],
      },
      recommended: [
        { name: "Charizard", player: "player1", order: 2 },
        { name: "Charizard Alt", player: "player1", order: 1 },
        { name: "Zubat" }, // No player, no order
        { name: "Pikachu" }, // No player, no order, triggers localeCompare with Zubat
        "This is a string note and should be filtered out",
      ],
    },
  ],
  mechanics: {},
};

const mockPokemonMap = new Map<string, Pokemon>();

// Mocking children components to simplify and isolate the test on the parent's logic
vi.mock("./tabs/RaidStrategyTab", () => ({
  default: ({
    handleRoleChange,
    roleOptions,
    effectiveSelectedRole,
    setSelectedRole,
  }: {
    handleRoleChange: (r: string) => void;
    roleOptions: string[];
    effectiveSelectedRole: string;
    setSelectedRole: (r: string) => void;
  }) => (
    <div data-testid="strategy-tab">
      <span data-testid="selected-role">{effectiveSelectedRole}</span>
      {roleOptions.map((role: string) => (
        <button
          key={role}
          onClick={() => handleRoleChange(role)}
        >{`Select ${role}`}</button>
      ))}
      <button onClick={() => setSelectedRole("player2")}>
        Direct Set Role
      </button>
    </div>
  ),
}));

vi.mock("./tabs/RaidBuildsTab", () => ({
  default: ({
    effectiveBuildGroupKey,
    buildGroups,
    setSelectedBuildGroup,
  }: {
    effectiveBuildGroupKey: string;
    buildGroups: Record<string, unknown>;
    setSelectedBuildGroup: (g: string) => void;
  }) => (
    <div data-testid="builds-tab">
      <span data-testid="active-group">{effectiveBuildGroupKey}</span>
      {buildGroups &&
        Object.keys(buildGroups).map((g) => (
          <div key={g} data-testid={`group-${g}`}>
            {g}
          </div>
        ))}
      <button onClick={() => setSelectedBuildGroup("player1")}>
        Select player1 group
      </button>
    </div>
  ),
}));

vi.mock("./tabs/RaidMechanicsTab", () => ({
  default: () => <div data-testid="mechanics-tab">Mechanics</div>,
}));
vi.mock("./tabs/RaidLocationsTab", () => ({
  default: () => <div data-testid="locations-tab">Locations</div>,
}));

describe("RaidModal component", () => {
  it("renders null if currentRaid is not provided", () => {
    const { container } = render(
      <RaidModal
        raidName="Rayquaza"
        onClose={vi.fn()}
        pokemonMap={mockPokemonMap}
        currentRaid={null}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders modal header with boss name and stars", () => {
    render(
      <RaidModal
        raidName="Rayquaza"
        onClose={vi.fn()}
        pokemonMap={mockPokemonMap}
        currentRaid={mockRaid}
      />
    );
    expect(screen.getByText("Rayquaza")).toBeInTheDocument();
    expect(screen.getByText("5★ Raid")).toBeInTheDocument();
  });

  it("switches tabs correctly", () => {
    render(
      <RaidModal
        raidName="Rayquaza"
        onClose={vi.fn()}
        pokemonMap={mockPokemonMap}
        currentRaid={mockRaid}
      />
    );

    // Initially on STRATEGY tab
    expect(screen.getByTestId("strategy-tab")).toBeInTheDocument();

    // Switch to MECHANICS tab
    fireEvent.click(screen.getByText("MECHANICS"));
    expect(screen.getByTestId("mechanics-tab")).toBeInTheDocument();

    // Switch to LOCATIONS tab
    fireEvent.click(screen.getByText("LOCATIONS"));
    expect(screen.getByTestId("locations-tab")).toBeInTheDocument();
  });

  it("calls onClose when the background overlay is clicked", () => {
    const handleClose = vi.fn();
    const { container } = render(
      <RaidModal
        raidName="Rayquaza"
        onClose={handleClose}
        pokemonMap={mockPokemonMap}
        currentRaid={mockRaid}
      />
    );

    // The outermost div is the background overlay
    const overlay = container.firstElementChild as HTMLElement;

    // Clicking child stops propagation, so it shouldn't close
    fireEvent.click(overlay.firstElementChild as HTMLElement);
    expect(handleClose).not.toHaveBeenCalled();

    // Clicking overlay should close
    fireEvent.click(overlay);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  describe("Complex Strategy Logic", () => {
    it("handles role selection correctly and defaults to player1", () => {
      render(
        <RaidModal
          raidName="Rayquaza"
          onClose={vi.fn()}
          pokemonMap={mockPokemonMap}
          currentRaid={mockRaidWithStrategy as unknown as typeof mockRaid}
        />
      );

      // Defaults to player1
      expect(screen.getByTestId("selected-role").textContent).toBe("player1");

      // Buttons are sorted so player1 is before player2
      const selectP2 = screen.getByText("Select player2");
      fireEvent.click(selectP2);

      // Role should update
      expect(screen.getByTestId("selected-role").textContent).toBe("player2");
    });

    it("handles build groups logic and filters out strings", () => {
      render(
        <RaidModal
          raidName="Rayquaza"
          onClose={vi.fn()}
          pokemonMap={mockPokemonMap}
          currentRaid={mockRaidWithStrategy as unknown as typeof mockRaid}
        />
      );

      fireEvent.click(screen.getByText("BUILDS"));

      // It should default to the first group alphabetically -> "General"
      expect(screen.getByTestId("active-group").textContent).toBe("General");

      // Should contain groups 'General' and 'player1'
      expect(screen.getByTestId("group-General")).toBeInTheDocument();
      expect(screen.getByTestId("group-player1")).toBeInTheDocument();

      // Select another group to cover explicit state setter (effectiveBuildGroupKey)
      fireEvent.click(screen.getByText("Select player1 group"));
      expect(screen.getByTestId("active-group").textContent).toBe("player1");
    });

    it("handles direct state setter for roles to hit fallback logic", () => {
      render(
        <RaidModal
          raidName="Rayquaza"
          onClose={vi.fn()}
          pokemonMap={mockPokemonMap}
          currentRaid={mockRaidWithStrategy as unknown as typeof mockRaid}
        />
      );

      // Click internal direct setter
      fireEvent.click(screen.getByText("Direct Set Role"));
      expect(screen.getByTestId("selected-role").textContent).toBe("player2");
    });
  });
});
