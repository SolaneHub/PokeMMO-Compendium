import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Team } from "@/types/teams";
import { EliteFourMember } from "@/utils/eliteFourMembers";

import EditorSidebar from "./EditorSidebar";

// Mocking getSpriteUrlByName
vi.mock("@/utils/pokemonImageHelper", () => ({
  getSpriteUrlByName: vi.fn(() => "mock-sprite.png"),
}));

describe("EditorSidebar", () => {
  const mockTeam = {
    name: "Test Team",
    members: [
      { id: "m1", name: "Pikachu", region: "Kanto", types: ["Electric"] },
      {
        id: "m2",
        name: "Charizard",
        region: "Kanto",
        types: ["Fire", "Flying"],
      },
    ],
  } as unknown as Team;

  const defaultProps = {
    team: mockTeam,
    activeView: "roster",
    activeId: 0,
    onNavigate: vi.fn(),
    regions: ["Kanto"],
    availableMembers: [
      { name: "Lorelei", region: "Kanto", type: "Ice" },
    ] as unknown as EliteFourMember[],
    enemyPools: {
      Lorelei: ["Dewgong"],
    },
    onAddEnemy: vi.fn(),
    onRemoveEnemy: vi.fn(),
  };

  it("renders team name and members", () => {
    render(<EditorSidebar {...defaultProps} />);

    expect(screen.getByText("Test Team")).toBeInTheDocument();
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    expect(screen.getByText("Charizard")).toBeInTheDocument();
  });

  it("calls onNavigate when a member is clicked", () => {
    render(<EditorSidebar {...defaultProps} />);

    const charizardBtn = screen.getByText("Charizard");
    fireEvent.click(charizardBtn);

    expect(defaultProps.onNavigate).toHaveBeenCalledWith("roster", 1);
  });

  it("calls onNavigate when Team Settings is clicked", () => {
    render(<EditorSidebar {...defaultProps} />);

    const settingsBtn = screen.getByText("Team Settings");
    fireEvent.click(settingsBtn);

    expect(defaultProps.onNavigate).toHaveBeenCalledWith("settings");
  });

  it("renders elite four sections and handles expansion", () => {
    render(<EditorSidebar {...defaultProps} />);

    expect(screen.getByText("Battle Plans")).toBeInTheDocument();
    expect(screen.getByText("Kanto")).toBeInTheDocument();

    // Click Kanto to expand
    fireEvent.click(screen.getByText("Kanto"));
    expect(screen.getByText("Lorelei")).toBeInTheDocument();

    // Click Lorelei to expand
    fireEvent.click(screen.getByText("Lorelei"));
    expect(screen.getByText("Dewgong")).toBeInTheDocument();
  });
});
