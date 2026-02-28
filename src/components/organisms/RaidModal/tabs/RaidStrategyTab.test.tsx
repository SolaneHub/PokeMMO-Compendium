import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import RaidStrategyTab from "./RaidStrategyTab";

const mockRaid = {
  name: "Test Raid",
  stars: 5,
  moves: [],
  teamStrategies: [
    { id: "1", label: "Strategy A", roles: {}, recommended: [] },
    { id: "2", label: "Strategy B", roles: {}, recommended: [] },
  ],
};

describe("RaidStrategyTab component", () => {
  it("renders strategy selection buttons when multiple strategies exist", () => {
    render(
      <RaidStrategyTab
        currentRaid={mockRaid as any}
        selectedStrategyIndex={0}
        setSelectedStrategyIndex={() => {}}
        setSelectedRole={() => {}}
        setSelectedTurnIndex={() => {}}
        setSelectedBuildGroup={() => {}}
        rolesSource={{}}
        roleOptions={[]}
        effectiveSelectedRole=""
        handleRoleChange={() => {}}
        movesForSelectedRole={[]}
        selectedTurnIndex={0}
      />
    );

    expect(screen.getByText("Select Strategy")).toBeInTheDocument();
    expect(screen.getByText("Strategy A")).toBeInTheDocument();
    expect(screen.getByText("Strategy B")).toBeInTheDocument();
  });

  it("renders role buttons", () => {
    render(
      <RaidStrategyTab
        currentRaid={mockRaid as any}
        selectedStrategyIndex={0}
        setSelectedStrategyIndex={() => {}}
        setSelectedRole={() => {}}
        setSelectedTurnIndex={() => {}}
        setSelectedBuildGroup={() => {}}
        rolesSource={{ "Player 1": [], "Player 2": [] }}
        roleOptions={["Player 1", "Player 2"]}
        effectiveSelectedRole="Player 1"
        handleRoleChange={() => {}}
        movesForSelectedRole={[]}
        selectedTurnIndex={0}
      />
    );

    expect(screen.getByText("Player Roles")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Player 1" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Player 2" })
    ).toBeInTheDocument();
  });

  it("renders turns and handles pagination", () => {
    const setTurnIndex = vi.fn();
    render(
      <RaidStrategyTab
        currentRaid={mockRaid as any}
        selectedStrategyIndex={0}
        setSelectedStrategyIndex={() => {}}
        setSelectedRole={() => {}}
        setSelectedTurnIndex={setTurnIndex}
        setSelectedBuildGroup={() => {}}
        rolesSource={{ "Player 1": ["Move A", "Move B", "Move C"] }}
        roleOptions={["Player 1"]}
        effectiveSelectedRole="Player 1"
        handleRoleChange={() => {}}
        movesForSelectedRole={["Move A", "Move B", "Move C"]}
        selectedTurnIndex={0}
      />
    );

    expect(screen.getByText("Move A")).toBeInTheDocument();
    expect(screen.getByText("Move B")).toBeInTheDocument();
    expect(screen.getByText("Move C")).toBeInTheDocument();

    // Pagination arrows (left is disabled since index is 0)
    const prevBtn = screen.getByText("❮");
    const nextBtn = screen.getByText("❯");
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    fireEvent.click(nextBtn);
    expect(setTurnIndex).toHaveBeenCalled();
  });

  it("handles fallback message when no roles are available", () => {
    render(
      <RaidStrategyTab
        currentRaid={{ teamStrategies: [] } as any}
        selectedStrategyIndex={0}
        setSelectedStrategyIndex={() => {}}
        setSelectedRole={() => {}}
        setSelectedTurnIndex={() => {}}
        setSelectedBuildGroup={() => {}}
        rolesSource={null}
        roleOptions={[]}
        effectiveSelectedRole=""
        handleRoleChange={() => {}}
        movesForSelectedRole={[]}
        selectedTurnIndex={0}
      />
    );
    expect(screen.getByText("No strategy data available.")).toBeInTheDocument();
  });
});
