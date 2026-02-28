import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Raid } from "@/types/raids";

import RaidStrategyTab from "./RaidStrategyTab";

const mockRaid = {
  name: "Test Raid",
  stars: 5,
  moves: [],
  teamStrategies: [
    { id: "1", label: "Strategy A", roles: {}, recommended: [] },
    { id: "2", label: "Strategy B", roles: {}, recommended: [] },
  ],
} as unknown as Raid;

describe("RaidStrategyTab component", () => {
  it("renders strategy selection buttons when multiple strategies exist", () => {
    render(
      <RaidStrategyTab
        currentRaid={mockRaid}
        selectedStrategyIndex={0}
        setSelectedStrategyIndex={vi.fn()}
        setSelectedRole={vi.fn()}
        setSelectedTurnIndex={vi.fn()}
        setSelectedBuildGroup={vi.fn()}
        rolesSource={{}}
        roleOptions={[]}
        effectiveSelectedRole=""
        handleRoleChange={vi.fn()}
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
        currentRaid={mockRaid}
        selectedStrategyIndex={0}
        setSelectedStrategyIndex={vi.fn()}
        setSelectedRole={vi.fn()}
        setSelectedTurnIndex={vi.fn()}
        setSelectedBuildGroup={vi.fn()}
        rolesSource={{ "Player 1": [], "Player 2": [] }}
        roleOptions={["Player 1", "Player 2"]}
        effectiveSelectedRole="Player 1"
        handleRoleChange={vi.fn()}
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
        currentRaid={mockRaid}
        selectedStrategyIndex={0}
        setSelectedStrategyIndex={vi.fn()}
        setSelectedRole={vi.fn()}
        setSelectedTurnIndex={setTurnIndex}
        setSelectedBuildGroup={vi.fn()}
        rolesSource={{ "Player 1": ["Move A", "Move B", "Move C"] }}
        roleOptions={["Player 1"]}
        effectiveSelectedRole="Player 1"
        handleRoleChange={vi.fn()}
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
    const emptyRaid = { teamStrategies: [] } as unknown as Raid;
    render(
      <RaidStrategyTab
        currentRaid={emptyRaid}
        selectedStrategyIndex={0}
        setSelectedStrategyIndex={vi.fn()}
        setSelectedRole={vi.fn()}
        setSelectedTurnIndex={vi.fn()}
        setSelectedBuildGroup={vi.fn()}
        rolesSource={null}
        roleOptions={[]}
        effectiveSelectedRole=""
        handleRoleChange={vi.fn()}
        movesForSelectedRole={[]}
        selectedTurnIndex={0}
      />
    );
    expect(screen.getByText("No strategy data available.")).toBeInTheDocument();
  });
});
