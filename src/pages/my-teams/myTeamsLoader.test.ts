import { User } from "firebase/auth";
import { redirect } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as authUtils from "@/firebase/authUtils";
import * as teamsService from "@/firebase/services/teamsService";
import { Team } from "@/types/teams";

import { myTeamsLoader } from "./myTeamsLoader";

// Mocking dependencies
vi.mock("@/firebase/authUtils");
vi.mock("@/firebase/services/teamsService");
vi.mock("react-router-dom", () => ({
  redirect: vi.fn(
    (url: string) => ({ status: 302, url }) as unknown as Response
  ),
}));

describe("myTeamsLoader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to login if no user", async () => {
    vi.mocked(authUtils.getCurrentUser).mockResolvedValue(null);

    await myTeamsLoader();

    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("returns teams and user if authenticated", async () => {
    const mockUser = { uid: "123" } as User;
    const mockTeams: Team[] = [
      {
        id: "t1",
        name: "Team 1",
        region: "Kanto",
        members: [],
      } as unknown as Team,
    ];
    vi.mocked(authUtils.getCurrentUser).mockResolvedValue(mockUser);
    vi.mocked(teamsService.getUserTeams).mockResolvedValue(mockTeams);

    const result = await myTeamsLoader();

    expect(result).toEqual({ teams: mockTeams, user: mockUser });
  });

  it("returns empty teams on error", async () => {
    const mockUser = { uid: "123" } as User;
    vi.mocked(authUtils.getCurrentUser).mockResolvedValue(mockUser);
    vi.mocked(teamsService.getUserTeams).mockRejectedValue(new Error("Fail"));

    const result = await myTeamsLoader();

    expect(result).toEqual({ teams: [], user: mockUser });
  });
});
