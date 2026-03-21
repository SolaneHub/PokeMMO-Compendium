import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { User } from "firebase/auth";
import { MemoryRouter, useLoaderData } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as ConfirmationContext from "@/context/ConfirmationContext";
import * as ToastContext from "@/context/ToastContext";
import * as TeamsService from "@/firebase/services/teamsService";
import * as UserTeamsHooks from "@/hooks/useUserTeams";
import { Team } from "@/types/teams";

import MyTeamsPage from "./MyTeamsPage";

// Mocking dependencies
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLoaderData: vi.fn(),
    useNavigate: vi.fn(() => vi.fn()),
    useRevalidator: vi.fn(() => ({ revalidate: vi.fn() })),
  };
});

vi.mock("@/hooks/useUserTeams");
vi.mock("@/context/ConfirmationContext");
vi.mock("@/context/ToastContext");
vi.mock("@/firebase/services/teamsService");

// Mocking organisms
vi.mock("@/components/organisms/TeamList", () => ({
  default: ({
    teams,
    onDeleteTeam,
    onSubmitTeam,
    onCancelSubmission,
  }: {
    teams: Team[];
    onDeleteTeam: (id: string) => void;
    onSubmitTeam: (id: string) => void;
    onCancelSubmission: (id: string) => void;
  }) => (
    <div data-testid="team-list">
      {teams.map((t: Team) => (
        <div key={t.id}>
          {t.name}
          <button onClick={() => onDeleteTeam(t.id || "")}>
            Delete {t.id}
          </button>
          <button onClick={() => onSubmitTeam(t.id || "")}>
            Submit {t.id}
          </button>
          <button onClick={() => onCancelSubmission(t.id || "")}>
            Cancel {t.id}
          </button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("@/components/organisms/CreateTeamModal", () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="create-modal">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe("MyTeamsPage", () => {
  const mockUser = { uid: "user123" } as User;
  const mockTeam = { id: "t1", name: "Team 1" } as Team;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ConfirmationContext.useConfirm).mockReturnValue(
      vi.fn(() => Promise.resolve(true))
    );
    vi.mocked(ToastContext.useToast).mockReturnValue(vi.fn());
    vi.mocked(UserTeamsHooks.useUserTeams).mockReturnValue({
      createTeam: vi.fn(),
      deleteTeam: vi.fn(),
    } as unknown as UserTeamsHooks.UseUserTeamsReturn);

    vi.mocked(useLoaderData).mockReturnValue({
      teams: [mockTeam],
      user: mockUser,
    });
  });

  it("handles team submission", async () => {
    render(
      <MemoryRouter>
        <MyTeamsPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Submit t1"));

    await waitFor(() => {
      expect(TeamsService.updateTeamStatus).toHaveBeenCalledWith(
        mockUser.uid,
        "t1",
        "pending"
      );
    });
  });

  it("handles team submission cancellation", async () => {
    render(
      <MemoryRouter>
        <MyTeamsPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Cancel t1"));

    await waitFor(() => {
      expect(TeamsService.updateTeamStatus).toHaveBeenCalledWith(
        mockUser.uid,
        "t1",
        "draft"
      );
    });
  });
});
