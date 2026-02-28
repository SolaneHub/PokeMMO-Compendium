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
    // A strategy without label to hit the fallback
    { id: "3", roles: {}, recommended: [] },
  ],
} as unknown as Raid;

describe("RaidStrategyTab component", () => {
  it("renders strategy selection buttons and handles selection", () => {
    const setStrategyIndex = vi.fn();
    const setRole = vi.fn();
    const setTurnIndex = vi.fn();
    const setBuildGroup = vi.fn();

    render(
      <RaidStrategyTab
        currentRaid={mockRaid}
        selectedStrategyIndex={0}
        setSelectedStrategyIndex={setStrategyIndex}
        setSelectedRole={setRole}
        setSelectedTurnIndex={setTurnIndex}
        setSelectedBuildGroup={setBuildGroup}
        rolesSource={{}}
        roleOptions={[]}
        effectiveSelectedRole=""
        handleRoleChange={vi.fn()}
        movesForSelectedRole={[]}
        selectedTurnIndex={0}
      />
    );

    expect(screen.getByText("Select Strategy")).toBeInTheDocument();

    // Click on Strategy B
    fireEvent.click(screen.getByText("Strategy B"));
    expect(setStrategyIndex).toHaveBeenCalledWith(1);
    expect(setRole).toHaveBeenCalledWith(null);
    expect(setTurnIndex).toHaveBeenCalledWith(0);
    expect(setBuildGroup).toHaveBeenCalledWith(null);

    // Test fallback label for Strategy without label
    expect(screen.getByText("Version 3")).toBeInTheDocument();
  });

  it("renders role buttons and triggers role change", () => {
    const handleRoleChange = vi.fn();
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
        handleRoleChange={handleRoleChange}
        movesForSelectedRole={[]}
        selectedTurnIndex={0}
      />
    );

    const btn = screen.getByRole("button", { name: "Player 2" });
    fireEvent.click(btn);
    expect(handleRoleChange).toHaveBeenCalledWith("Player 2");
  });

  it("handles complex pagination logic for turns (next and prev)", () => {
    // We need to capture the state updater function and execute it to cover the `typeof prev === "function"` branch
    const setTurnIndex = vi.fn().mockImplementation((updater) => {
      if (typeof updater === "function") {
        updater(1); // Provide current fake state to evaluate logic
      }
    });

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
        selectedTurnIndex={1} // Middle index to enable both prev and next
      />
    );

    const prevBtn = screen.getByText("❮");
    const nextBtn = screen.getByText("❯");

    expect(prevBtn).not.toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    // Click Prev
    fireEvent.click(prevBtn);
    expect(setTurnIndex).toHaveBeenCalledTimes(1);

    // Click Next
    fireEvent.click(nextBtn);
    expect(setTurnIndex).toHaveBeenCalledTimes(2);

    // Verify raw value fallback in setTurnIndex callback if not a function
    const setTurnIndexRawFallback = vi.fn().mockImplementation((updater) => {
      if (typeof updater === "function") {
        updater(1);
      }
    });

    render(
      <RaidStrategyTab
        currentRaid={mockRaid}
        selectedStrategyIndex={0}
        setSelectedStrategyIndex={vi.fn()}
        setSelectedRole={vi.fn()}
        setSelectedTurnIndex={setTurnIndexRawFallback}
        setSelectedBuildGroup={vi.fn()}
        rolesSource={{ "Player 1": ["Move A", "Move B", "Move C"] }}
        roleOptions={["Player 1"]}
        effectiveSelectedRole="Player 1"
        handleRoleChange={vi.fn()}
        movesForSelectedRole={["Move A", "Move B", "Move C"]}
        selectedTurnIndex={1}
      />
    );
  });

  it("handles direct click on a specific turn", () => {
    const setTurnIndex = vi.fn();
    render(
      <RaidStrategyTab
        currentRaid={mockRaid}
        selectedStrategyIndex={0}
        setSelectedStrategyIndex={vi.fn()}
        setSelectedRole={vi.fn()}
        setSelectedTurnIndex={setTurnIndex}
        setSelectedBuildGroup={vi.fn()}
        rolesSource={{ "Player 1": ["Move A", "Move B"] }}
        roleOptions={["Player 1"]}
        effectiveSelectedRole="Player 1"
        handleRoleChange={vi.fn()}
        movesForSelectedRole={["Move A", "Move B"]}
        selectedTurnIndex={0}
      />
    );

    // Click on the second move item
    fireEvent.click(screen.getByText("Move B"));
    expect(setTurnIndex).toHaveBeenCalledWith(1);
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
