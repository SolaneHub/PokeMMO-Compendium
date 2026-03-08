import { act, renderHook, waitFor } from "@testing-library/react";
import { useNavigate, useParams } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getUserTeams, updateUserTeam } from "@/firebase/services/teamsService";
import { Team } from "@/types/teams";

import { useTeamEditor } from "./useTeamEditor";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/context/ToastContext", () => ({
  useToast: vi.fn(),
}));

vi.mock("@/firebase/services/teamsService", () => ({
  getUserTeams: vi.fn(),
  updateUserTeam: vi.fn(),
}));

describe("useTeamEditor", () => {
  const mockUserId = "user123";
  const mockTeamId = "team456";
  const mockNavigate = vi.fn();
  const mockShowToast = vi.fn();
  const mockTeam = {
    id: mockTeamId,
    name: "Test Team",
    region: "Kanto",
    members: [],
    strategies: {},
    enemyPools: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({ id: mockTeamId });
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useAuth).mockReturnValue({
      currentUser: { uid: mockUserId },
    } as unknown as ReturnType<typeof useAuth>);
    vi.mocked(useToast).mockReturnValue(mockShowToast);
  });

  it("loads team successfully on mount", async () => {
    vi.mocked(getUserTeams).mockResolvedValueOnce([mockTeam] as Team[]);

    const { result } = renderHook(() => useTeamEditor());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.team).toEqual(
      expect.objectContaining({ name: "Test Team" })
    );
    expect(getUserTeams).toHaveBeenCalledWith(mockUserId);
  });

  it("navigates back and shows toast if team not found", async () => {
    vi.mocked(getUserTeams).mockResolvedValueOnce([] as Team[]);

    renderHook(() => useTeamEditor());

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith("Team not found", "error");
      expect(mockNavigate).toHaveBeenCalledWith("/my-teams");
    });
  });

  it("handles load error gracefully", async () => {
    vi.mocked(getUserTeams).mockRejectedValueOnce(new Error("Load failed"));

    const { result } = renderHook(() => useTeamEditor());

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith("Error loading team", "error");
      expect(result.current.loading).toBe(false);
    });
  });

  describe("saveTeam", () => {
    it("successfully saves the team", async () => {
      vi.mocked(getUserTeams).mockResolvedValueOnce([mockTeam] as Team[]);
      vi.mocked(updateUserTeam).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useTeamEditor());

      await waitFor(() => {
        expect(result.current.team).not.toBeNull();
      });

      await act(async () => {
        await result.current.saveTeam();
      });

      expect(updateUserTeam).toHaveBeenCalledWith(
        mockUserId,
        mockTeamId,
        expect.objectContaining({ name: "Test Team" })
      );
      expect(mockShowToast).toHaveBeenCalledWith(
        "Team saved successfully!",
        "success"
      );
      expect(result.current.saving).toBe(false);
    });

    it("shows error toast if save fails", async () => {
      vi.mocked(getUserTeams).mockResolvedValueOnce([mockTeam] as Team[]);
      vi.mocked(updateUserTeam).mockRejectedValueOnce(new Error("Save failed"));

      const { result } = renderHook(() => useTeamEditor());

      await waitFor(() => {
        expect(result.current.team).not.toBeNull();
      });

      await act(async () => {
        await result.current.saveTeam();
      });

      expect(mockShowToast).toHaveBeenCalledWith(
        "Failed to save team. Data might be invalid.",
        "error"
      );
    });
  });

  describe("sanitizeTeam", () => {
    it("ensures step IDs are generated", async () => {
      const teamWithNoIds = {
        ...mockTeam,
        strategies: {
          Pikachu: {
            Gengar: [{ description: "Thunderbolt", type: "main" }],
          },
        },
      } as unknown as Team;
      vi.mocked(getUserTeams).mockResolvedValueOnce([teamWithNoIds]);

      const { result } = renderHook(() => useTeamEditor());

      await waitFor(() => {
        expect(result.current.team).not.toBeNull();
      });

      const steps = result.current.team?.strategies?.["Pikachu"]?.["Gengar"];
      if (!steps || !steps[0]) throw new Error("Steps not found");
      expect(steps[0].id).toBeDefined();
      expect(typeof steps[0].id).toBe("string");
    });
  });
});
