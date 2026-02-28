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
      dexId: 25,
    },
    {
      name: "MissingNo", // No dexId
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
    render(<TeamCard team={mockTeam} onDelete={vi.fn()} />);
    expect(screen.getByText("My Best Team")).toBeInTheDocument();
    expect(screen.getByAltText("Pikachu")).toBeInTheDocument();
  });

  it("handles image load errors and falls back to pokeapi", () => {
    render(<TeamCard team={mockTeam} onDelete={vi.fn()} />);
    const pikaImg = screen.getByAltText("Pikachu");
    const missingNoImg = screen.getByAltText("MissingNo");

    // Simulate image loading error
    fireEvent.error(pikaImg);
    fireEvent.error(missingNoImg);

    expect(pikaImg).toHaveAttribute(
      "src",
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
    );
    expect(missingNoImg).toHaveAttribute(
      "src",
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"
    );
  });

  it("calls onDelete when trash icon is clicked", () => {
    const handleDelete = vi.fn();
    render(<TeamCard team={mockTeam} onDelete={handleDelete} />);

    // SVG or button representing trash
    const deleteBtn = screen.getByRole("button", { name: "" }); // Button component has empty child if only icon
    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledWith("team1");
  });

  it("renders Submit button if status is draft and onSubmit is provided and handles click", () => {
    const handleSubmit = vi.fn();
    render(
      <TeamCard team={mockTeam} onDelete={vi.fn()} onSubmit={handleSubmit} />
    );
    const submitBtn = screen.getByText("Submit");
    expect(submitBtn).toBeInTheDocument();

    fireEvent.click(submitBtn);
    expect(handleSubmit).toHaveBeenCalledWith("team1");
  });

  it("renders Cancel Submission button if status is pending and onCancel is provided and handles click", () => {
    const handleCancel = vi.fn();
    const pendingTeam: Team = { ...mockTeam, status: "pending" };

    render(
      <TeamCard
        team={pendingTeam}
        onDelete={vi.fn()}
        onCancelSubmission={handleCancel}
      />
    );
    const cancelBtn = screen.getByText("Cancel Submission");
    expect(cancelBtn).toBeInTheDocument();

    fireEvent.click(cancelBtn);
    expect(handleCancel).toHaveBeenCalledWith("team1");
  });

  it("disables click interactions if status is pending", () => {
    const handleClick = vi.fn();
    const pendingTeam: Team = { ...mockTeam, status: "pending" };

    render(
      <TeamCard team={pendingTeam} onClick={handleClick} onDelete={vi.fn()} />
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
