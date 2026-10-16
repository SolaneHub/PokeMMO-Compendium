import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  createUserTeam,
  deleteUserTeam,
  getUserTeams,
} from "@/firebase/services/teamsService";
import { Team } from "@/types/teams";

import { useUserTeams } from "./useUserTeams";

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/context/ToastContext", () => ({
  useToast: vi.fn(),
}));

vi.mock("@/firebase/services/teamsService", () => ({
  createUserTeam: vi.fn(),
  deleteUserTeam: vi.fn(),
  getUserTeams: vi.fn(),
}));

describe("useUserTeams", () => {
  const mockUser = { uid: "user123" };
  const mockShowToast = vi.fn();
  const mockTeams: Team[] = [
    { id: "team1", name: "Team 1", region: null, members: [] },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      currentUser: mockUser,
      loading: false,
    } as unknown as ReturnType<typeof useAuth>);
    vi.mocked(useToast).mockReturnValue(mockShowToast);
  });

  it("fetches teams on mount if user is logged in", async () => {
    vi.mocked(getUserTeams).mockResolvedValueOnce(mockTeams);

    const { result } = renderHook(() => useUserTeams());

    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.teams).toEqual(mockTeams);
    expect(getUserTeams).toHaveBeenCalledWith(mockUser.uid);
  });

  it("initializes with initialTeams synchronously without fetching", () => {
    const { result } = renderHook(() => useUserTeams(mockTeams));

    expect(result.current.loading).toBe(false);
    expect(result.current.teams).toEqual(mockTeams);
    expect(getUserTeams).not.toHaveBeenCalled();
  });

  it("updates teams state when initialTeams prop changes on revalidate", () => {
    const initial = [
      { id: "team1", name: "Team 1", region: null, members: [] },
    ] as unknown as Team[];
    const updated = [
      { id: "team1", name: "Team 1", region: null, members: [] },
      { id: "team2", name: "Team 2", region: null, members: [] },
    ] as unknown as Team[];

    const { result, rerender } = renderHook(
      ({ teams }) => useUserTeams(teams),
      { initialProps: { teams: initial } }
    );

    expect(result.current.teams).toEqual(initial);

    rerender({ teams: updated });

    expect(result.current.teams).toEqual(updated);
    expect(getUserTeams).not.toHaveBeenCalled();
  });

  it("does not fetch teams if user is not logged in", async () => {
    vi.mocked(useAuth).mockReturnValue({
      currentUser: null,
      loading: false,
    } as unknown as ReturnType<typeof useAuth>);

    const { result } = renderHook(() => useUserTeams());

    expect(result.current.loading).toBe(false);
    expect(getUserTeams).not.toHaveBeenCalled();
  });

  it("shows error toast if fetch fails", async () => {
    vi.mocked(getUserTeams).mockRejectedValueOnce(new Error("Fetch failed"));

    const { result } = renderHook(() => useUserTeams());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockShowToast).toHaveBeenCalledWith("Failed to load teams", "error");
  });

  describe("createTeam", () => {
    it("successfully creates a team and refreshes", async () => {
      vi.mocked(getUserTeams).mockResolvedValue(mockTeams);
      vi.mocked(createUserTeam).mockResolvedValueOnce("new-id");

      const { result } = renderHook(() => useUserTeams());

      let teamId;
      await act(async () => {
        teamId = await result.current.createTeam("New Team");
      });

      expect(teamId).toBe("new-id");
      expect(createUserTeam).toHaveBeenCalledWith(
        mockUser.uid,
        expect.objectContaining({ name: "New Team" })
      );
      expect(mockShowToast).toHaveBeenCalledWith(
        "Team created successfully!",
        "success"
      );
      expect(getUserTeams).toHaveBeenCalledTimes(2); // Initial + After create
    });

    it("returns null and shows error toast if creation fails", async () => {
      vi.mocked(getUserTeams).mockResolvedValue(mockTeams);
      vi.mocked(createUserTeam).mockRejectedValueOnce(
        new Error("Create failed")
      );

      const { result } = renderHook(() => useUserTeams());

      let teamId;
      await act(async () => {
        teamId = await result.current.createTeam("New Team");
      });

      expect(teamId).toBeNull();
      expect(mockShowToast).toHaveBeenCalledWith(
        "Failed to create team",
        "error"
      );
    });
  });

  describe("deleteTeam", () => {
    it("successfully deletes a team", async () => {
      vi.mocked(getUserTeams).mockResolvedValue(mockTeams);
      vi.mocked(deleteUserTeam).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useUserTeams());

      await waitFor(() => {
        expect(result.current.teams).toEqual(mockTeams);
      });

      await act(async () => {
        await result.current.deleteTeam("team1");
      });

      expect(deleteUserTeam).toHaveBeenCalledWith(mockUser.uid, "team1");
      expect(mockShowToast).toHaveBeenCalledWith("Team deleted", "info");
      expect(result.current.teams).toEqual([]);
    });

    it("restores teams and shows error toast if deletion fails", async () => {
      vi.mocked(getUserTeams).mockResolvedValue(mockTeams);
      vi.mocked(deleteUserTeam).mockRejectedValueOnce(
        new Error("Delete failed")
      );

      const { result } = renderHook(() => useUserTeams());

      await waitFor(() => {
        expect(result.current.teams).toEqual(mockTeams);
      });

      await act(async () => {
        await result.current.deleteTeam("team1");
      });

      expect(mockShowToast).toHaveBeenCalledWith(
        "Failed to delete team",
        "error"
      );
      expect(result.current.teams).toEqual(mockTeams);
    });
  });
});
