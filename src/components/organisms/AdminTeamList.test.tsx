import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import * as TeamsService from "@/firebase/services/teamsService";

import AdminTeamList from "./AdminTeamList";

vi.mock("@/context/ConfirmationContext", () => ({
  useConfirm: () => vi.fn().mockResolvedValue(true),
}));

vi.mock("@/context/ToastContext", () => ({
  useToast: () => vi.fn(),
}));

// Mock Firebase service
vi.mock("@/firebase/services/teamsService", () => ({
  getAllUserTeams: vi
    .fn()
    .mockResolvedValue({ teams: [], nextPageToken: null }),
  getTeamsByStatus: vi.fn().mockResolvedValue({
    teams: [
      {
        id: "1",
        name: "Admin Test Team",
        status: "pending",
        userId: "user123",
        members: [],
      },
    ],
    nextPageToken: null,
  }),
  updateTeamStatus: vi.fn(),
  deleteUserTeam: vi.fn(),
}));

describe("AdminTeamList component", () => {
  it("renders loading state initially", () => {
    render(
      <MemoryRouter>
        <AdminTeamList status="pending" />
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading pending teams/i)).toBeInTheDocument();
  });

  it("renders teams after fetching", async () => {
    render(
      <MemoryRouter>
        <AdminTeamList status="pending" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Admin Test Team")).toBeInTheDocument();
    });

    // Status buttons
    expect(screen.getByText("Approve")).toBeInTheDocument();
    expect(screen.getByText("Reject")).toBeInTheDocument();
  });

  it("shows error state on failure", async () => {
    vi.spyOn(TeamsService, "getTeamsByStatus").mockRejectedValueOnce(
      new Error("Network Error")
    );

    render(
      <MemoryRouter>
        <AdminTeamList status="pending" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Error loading teams")).toBeInTheDocument();
      expect(screen.getByText("Network Error")).toBeInTheDocument();
    });
  });
});
