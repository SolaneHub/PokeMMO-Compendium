import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { Team } from "@/types/teams";

import TeamList from "./TeamList";

const mockTeams: Team[] = [
  {
    id: "team1",
    name: "Alpha Team",
    members: [],
    status: "approved",
    region: null,
  },
  {
    id: "team2",
    name: "Bravo Team",
    members: [],
    status: "pending",
    region: null,
  },
];

describe("TeamList component", () => {
  it("renders all teams as cards", () => {
    render(
      <MemoryRouter>
        <TeamList
          teams={mockTeams}
          onTeamClick={() => {
            /* noop */
          }}
          onDeleteTeam={() => {
            /* noop */
          }}
          onSubmitTeam={() => {
            /* noop */
          }}
          onCancelSubmission={() => {
            /* noop */
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Alpha Team")).toBeInTheDocument();
    expect(screen.getByText("Bravo Team")).toBeInTheDocument();
  });

  it("renders nothing if teams array is empty", () => {
    const { container } = render(
      <MemoryRouter>
        <TeamList
          teams={[]}
          onTeamClick={() => {
            /* noop */
          }}
          onDeleteTeam={() => {
            /* noop */
          }}
          onSubmitTeam={() => {
            /* noop */
          }}
          onCancelSubmission={() => {
            /* noop */
          }}
        />
      </MemoryRouter>
    );
    // The container will have the grid div but no children
    const gridDiv = container.querySelector(".grid");
    expect(gridDiv).toBeEmptyDOMElement();
  });
});
