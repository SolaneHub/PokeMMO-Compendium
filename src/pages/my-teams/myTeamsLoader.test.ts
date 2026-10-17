import { redirect } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as authUtils from "@/firebase/authUtils";
import * as teamsService from "@/firebase/services/teamsService";
import { createMockTeam } from "@/test/factories";
import { AppUser } from "@/types/auth";
import { Team } from "@/types/teams";

import { myTeamsLoader } from "./myTeamsLoader";

// Mocking dependencies
vi.mock("@/firebase/authUtils");
vi.mock("@/firebase/services/teamsService");
vi.mock("react-router-dom", () => ({
  redirect: vi.fn(
    (url: string) =>
      new Response(null, { status: 302, headers: { Location: url } })
  ),
}));

describe("myTeamsLoader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(vi.fn());
  });

  it("redirects to login if no user", async () => {
    vi.mocked(authUtils.getCurrentUser).mockResolvedValue(null);

    await myTeamsLoader();

    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("returns teams and user if authenticated", async () => {
    const mockUser: AppUser = { uid: "123", email: "test@example.com" };
    const mockTeams: Team[] = [
      createMockTeam({
        id: "t1",
        name: "Team 1",
        region: "Kanto",
        members: [],
      }),
    ];
    vi.mocked(authUtils.getCurrentUser).mockResolvedValue(mockUser);
    vi.mocked(teamsService.getUserTeams).mockResolvedValue(mockTeams);

    const result = await myTeamsLoader();

    expect(result).toEqual({ teams: mockTeams, user: mockUser });
  });

  it("returns empty teams and error message on failure", async () => {
    const mockUser: AppUser = { uid: "123", email: "test@example.com" };
    vi.mocked(authUtils.getCurrentUser).mockResolvedValue(mockUser);
    vi.mocked(teamsService.getUserTeams).mockRejectedValue(new Error("Fail"));

    const result = await myTeamsLoader();

    expect(result).toEqual({
      teams: [],
      user: mockUser,
      error:
        "Failed to load your teams. Please check your network connection and refresh.",
    });
  });
});
