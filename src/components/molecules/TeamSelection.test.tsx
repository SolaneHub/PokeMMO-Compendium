import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import TeamSelection from "./TeamSelection";
import { Team } from "@/types/teams";

const mockTeams: Team[] = [
  { id: "team1", name: "Alpha Team", members: [], region: null },
  { id: "team2", name: "Bravo Team", members: [], region: null },
];

describe("TeamSelection component", () => {
  it("renders all teams", () => {
    render(
      <TeamSelection
        teams={mockTeams}
        selectedTeamId={undefined}
        onTeamClick={() => {}}
      />
    );
    expect(screen.getByText("Alpha Team")).toBeInTheDocument();
    expect(screen.getByText("Bravo Team")).toBeInTheDocument();
  });

  it("calls onTeamClick when a team is clicked", () => {
    const handleClick = vi.fn();
    render(
      <TeamSelection
        teams={mockTeams}
        selectedTeamId={undefined}
        onTeamClick={handleClick}
      />
    );

    fireEvent.click(screen.getByText("Alpha Team"));
    expect(handleClick).toHaveBeenCalledWith("team1");
  });

  it("applies inline styles for the selected team", () => {
    render(
      <TeamSelection
        teams={mockTeams}
        selectedTeamId="team2"
        onTeamClick={() => {}}
      />
    );

    const unselectedBtn = screen.getByText("Alpha Team");
    const selectedBtn = screen.getByText("Bravo Team");

    expect(unselectedBtn).toHaveClass("bg-[#1e2025]"); // Unselected tailwind class

    expect(selectedBtn).toHaveClass("scale-105"); // Selected tailwind class
  });
});
