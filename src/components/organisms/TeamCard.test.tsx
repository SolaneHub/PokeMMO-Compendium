import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Team } from "@/types/teams";

import TeamCard from "./TeamCard";

const mockTeam: Team = {
  id: "team1",
  name: "My Best Team",
  members: [
    {
      name: "Pikachu",
      item: "",
      ability: "",
      nature: "",
      evs: "",
      ivs: "",
      moves: [],
    },
  ],
  status: "draft",
  region: null,
};

describe("TeamCard component", () => {
  it("renders team name and members", () => {
    render(
      <TeamCard
        team={mockTeam}
        onDelete={() => {
          /* noop */
        }}
      />
    );
    expect(screen.getByText("My Best Team")).toBeInTheDocument();
    expect(screen.getByAltText("Pikachu")).toBeInTheDocument();
  });

  it("calls onDelete when trash icon is clicked", () => {
    const handleDelete = vi.fn();
    render(<TeamCard team={mockTeam} onDelete={handleDelete} />);

    // SVG or button representing trash
    const deleteBtn = screen.getByRole("button", { name: "" }); // Button component has empty child if only icon
    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledWith("team1");
  });

  it("renders Submit button if status is draft and onSubmit is provided", () => {
    render(
      <TeamCard
        team={mockTeam}
        onDelete={() => {
          /* noop */
        }}
        onSubmit={() => {
          /* noop */
        }}
      />
    );
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("disables click interactions if status is pending", () => {
    const handleClick = vi.fn();
    const pendingTeam: Team = { ...mockTeam, status: "pending" };

    render(
      <TeamCard
        team={pendingTeam}
        onClick={handleClick}
        onDelete={() => {
          /* noop */
        }}
      />
    );

    // The main card div does not receive onClick if pending
    const cardTitle = screen.getByText("My Best Team");
    const container = cardTitle.closest("div.group");
    if (container) {
      fireEvent.click(container);
    }

    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });
});
