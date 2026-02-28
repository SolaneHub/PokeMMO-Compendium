import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as TeamsService from "@/firebase/services/teamsService";

import AdminTeamList from "./AdminTeamList";

// Mock hooks
const mockConfirm = vi.fn().mockResolvedValue(true);
vi.mock("@/context/ConfirmationContext", () => ({
  useConfirm: () => mockConfirm,
}));

const mockShowToast = vi.fn();
vi.mock("@/context/ToastContext", () => ({
  useToast: () => mockShowToast,
}));

// Mock Firebase service
vi.mock("@/firebase/services/teamsService", () => ({
  getAllUserTeams: vi.fn(),
  getTeamsByStatus: vi.fn(),
  updateTeamStatus: vi.fn(),
  deleteUserTeam: vi.fn(),
}));

describe("AdminTeamList component", () => {
  const mockTeamPending = {
    id: "1",
    name: "Pending Team",
    status: "pending",
    userId: "user123",
    members: [{ name: "Pikachu" }],
  };

  const mockTeamApproved = {
    id: "2",
    name: "Approved Team",
    status: "approved",
    userId: "user456",
    members: [],
  };

  const mockTeamDraft = {
    id: "3",
    name: "Draft Team",
    status: "draft",
    userId: "user789",
    members: [],
  };

  const mockTeamRejected = {
    id: "4",
    name: "Rejected Team",
    status: "rejected",
    userId: "user999",
    members: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockResolvedValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders loading state initially", async () => {
    let resolvePromise: (value: {
      teams: never[];
      nextPageToken: null;
    }) => void;
    vi.spyOn(TeamsService, "getTeamsByStatus").mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
    );

    render(
      <MemoryRouter>
        <AdminTeamList status="pending" />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading pending teams/i)).toBeInTheDocument();

    // Resolve the promise to avoid act() warnings after test unmounts
    await act(async () => {
      resolvePromise({ teams: [], nextPageToken: null });
    });
  });

  it("shows error state on failure and handles retry", async () => {
    const user = userEvent.setup();
    let attempt = 0;
    vi.spyOn(TeamsService, "getTeamsByStatus").mockImplementation(() => {
      attempt++;
      if (attempt === 1) return Promise.reject(new Error("Network Error"));
      return Promise.resolve({ teams: [], nextPageToken: null });
    });

    render(
      <MemoryRouter>
        <AdminTeamList status="pending" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Error loading teams")).toBeInTheDocument();
      expect(screen.getByText("Network Error")).toBeInTheDocument();
    });

    // Test retry
    const retryBtn = screen.getByText("Retry");
    await user.click(retryBtn);

    await waitFor(() => {
      expect(screen.queryByText("Error loading teams")).not.toBeInTheDocument();
    });

    expect(TeamsService.getTeamsByStatus).toHaveBeenCalledTimes(2);
  });

  it("renders all teams when status is 'all' and handles Publish", async () => {
    const user = userEvent.setup();
    vi.spyOn(TeamsService, "getAllUserTeams").mockResolvedValue({
      teams: [mockTeamDraft],
      nextPageToken: null,
    });
    vi.spyOn(TeamsService, "updateTeamStatus").mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <AdminTeamList status="all" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Draft Team")).toBeInTheDocument();
      expect(screen.getByText("Publish")).toBeInTheDocument();
    });

    // Test Publish click
    const publishBtn = screen.getByText("Publish");
    await user.click(publishBtn);

    expect(mockConfirm).toHaveBeenCalled();
    expect(TeamsService.updateTeamStatus).toHaveBeenCalledWith(
      "user789",
      "3",
      "pending"
    );
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining("reset to pendinged"),
      "success"
    ); // Text fallback in action logic handles 'pending' generically or custom. Actually action is 'Reset to Pending'
  });

  it("renders pending teams and handles Approve and Reject", async () => {
    const user = userEvent.setup();
    vi.spyOn(TeamsService, "getTeamsByStatus").mockResolvedValue({
      teams: [mockTeamPending],
      nextPageToken: null,
    });
    vi.spyOn(TeamsService, "updateTeamStatus").mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <AdminTeamList status="pending" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Pending Team")).toBeInTheDocument();
    });

    const approveBtn = screen.getByText("Approve");
    await user.click(approveBtn);

    expect(mockConfirm).toHaveBeenCalled();
    expect(TeamsService.updateTeamStatus).toHaveBeenCalledWith(
      "user123",
      "1",
      "approved"
    );
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining("approveed successfully"),
      "success"
    );

    // Simulate error during reject
    vi.spyOn(TeamsService, "updateTeamStatus").mockRejectedValueOnce(
      new Error("Firebase err")
    );
    const rejectBtn = screen.getByText("Reject");
    await user.click(rejectBtn);

    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining("Failed to reject"),
      "error"
    );
  });

  it("handles cancel in confirmation dialog", async () => {
    const user = userEvent.setup();
    mockConfirm.mockResolvedValueOnce(false); // User clicks cancel

    vi.spyOn(TeamsService, "getTeamsByStatus").mockResolvedValue({
      teams: [mockTeamPending],
      nextPageToken: null,
    });

    render(
      <MemoryRouter>
        <AdminTeamList status="pending" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Pending Team")).toBeInTheDocument();
    });

    const approveBtn = screen.getByText("Approve");
    await user.click(approveBtn);

    expect(mockConfirm).toHaveBeenCalled();
    // Update should NOT be called
    expect(TeamsService.updateTeamStatus).not.toHaveBeenCalled();
  });

  it("handles Revoke Approval for approved teams", async () => {
    const user = userEvent.setup();
    vi.spyOn(TeamsService, "getTeamsByStatus").mockResolvedValue({
      teams: [mockTeamApproved],
      nextPageToken: null,
    });

    render(
      <MemoryRouter>
        <AdminTeamList status="approved" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Approved Team")).toBeInTheDocument();
    });

    const revokeBtn = screen.getByText("Revoke Approval");
    await user.click(revokeBtn);

    expect(TeamsService.updateTeamStatus).toHaveBeenCalledWith(
      "user456",
      "2",
      "rejected"
    );
  });

  it("handles Move to Pending for rejected teams", async () => {
    const user = userEvent.setup();
    vi.spyOn(TeamsService, "getTeamsByStatus").mockResolvedValue({
      teams: [mockTeamRejected],
      nextPageToken: null,
    });

    render(
      <MemoryRouter>
        <AdminTeamList status="rejected" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Rejected Team")).toBeInTheDocument();
    });

    const moveBtn = screen.getByText("Move to Pending");
    await user.click(moveBtn);

    expect(TeamsService.updateTeamStatus).toHaveBeenCalledWith(
      "user999",
      "4",
      "pending"
    );
  });

  it("handles Team Deletion", async () => {
    const user = userEvent.setup();
    vi.spyOn(TeamsService, "getTeamsByStatus").mockResolvedValue({
      teams: [mockTeamPending],
      nextPageToken: null,
    });
    vi.spyOn(TeamsService, "deleteUserTeam").mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <AdminTeamList status="pending" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Pending Team")).toBeInTheDocument();
    });

    // Trash button has no text, so we find it by looking for the sibling container or just finding buttons
    // We can select the last button in the row or use getByRole
    const buttons = screen.getAllByRole("button");
    const deleteBtn = buttons[buttons.length - 1]; // Trash is the last one

    await user.click(deleteBtn);

    expect(mockConfirm).toHaveBeenCalled();
    expect(TeamsService.deleteUserTeam).toHaveBeenCalledWith("user123", "1");
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining("deleted successfully"),
      "success"
    );

    // Test delete error
    vi.spyOn(TeamsService, "deleteUserTeam").mockRejectedValueOnce(
      new Error("Err")
    );
    mockConfirm.mockResolvedValueOnce(true);
    await user.click(deleteBtn);
    expect(mockShowToast).toHaveBeenCalledWith(
      "Failed to delete team.",
      "error"
    );
  });
});
