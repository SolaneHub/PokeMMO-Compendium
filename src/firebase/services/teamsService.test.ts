import * as firestore from "firebase/firestore";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { setMockDocs } from "@/test/setup";
import { TeamStatus } from "@/types/teams";

import {
  createUserTeam,
  deleteUserTeam,
  getAllApprovedTeams,
  getAllPendingTeams,
  getAllUserTeams,
  getPublicApprovedTeams,
  getTeamsByStatus,
  getUserTeams,
  updateTeamStatus,
  updateUserTeam,
} from "./teamsService";

vi.mock("./common", () => ({
  TEAMS_COLLECTION: "teams",
  USERS_COLLECTION: "users",
}));

describe("teamsService", () => {
  const userId = "user123";
  const teamId = "team456";
  const mockTeam = {
    id: teamId,
    name: "Test Team",
    region: "Kanto",
    members: [],
    status: "draft" as TeamStatus,
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "warn").mockImplementation(() => {
      // Mock console.warn
    });
  });

  afterEach(() => {
    setMockDocs([]);
    vi.restoreAllMocks();
  });

  describe("createUserTeam", () => {
    it("successfully creates a team and returns the ID", async () => {
      const mockDocRef = { id: "new-team-id" };
      vi.mocked(firestore.addDoc).mockResolvedValueOnce(
        mockDocRef as unknown as firestore.DocumentReference
      );

      const result = await createUserTeam(userId, {
        name: "New Team",
        region: "Kanto",
        members: [],
      });

      expect(result).toBe("new-team-id");
      expect(firestore.addDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          name: "New Team",
          region: "Kanto",
          members: [],
          status: "draft",
          isPublic: false,
        })
      );
    });
  });

  describe("getUserTeams", () => {
    it("returns an array of teams for a user", async () => {
      setMockDocs([mockTeam]);

      const result = await getUserTeams(userId);

      expect(result.length).toBe(1);
      const team = result[0];
      if (!team) throw new Error("Team not found");
      expect(team.id).toBe(teamId);
      expect(team.name).toBe("Test Team");
    });

    it("filters out invalid teams and warns", async () => {
      setMockDocs([
        mockTeam,
        { id: "invalid", name: 123 } as unknown as unknown,
      ]); // Invalid name type

      const result = await getUserTeams(userId);

      expect(result.length).toBe(1);
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe("updateUserTeam", () => {
    it("calls updateDoc with correct parameters", async () => {
      await updateUserTeam(userId, teamId, { name: "Updated Name" });

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          name: "Updated Name",
          updatedAt: expect.any(Date),
        })
      );
    });
  });

  describe("deleteUserTeam", () => {
    it("calls deleteDoc with correct parameters", async () => {
      await deleteUserTeam(userId, teamId);

      expect(firestore.deleteDoc).toHaveBeenCalled();
    });
  });

  describe("getTeamsByStatus", () => {
    it("returns teams with specific status", async () => {
      setMockDocs([mockTeam]);
      // Mocking doc reference for parent access in getTeamsByStatus
      vi.mocked(firestore.getDocs).mockResolvedValueOnce({
        forEach: (cb: (data: unknown) => void) =>
          cb({
            id: teamId,
            data: () => mockTeam,
            ref: { parent: { parent: { id: userId } } },
          }),
        docs: [],
      } as unknown as firestore.QuerySnapshot);

      const result = await getTeamsByStatus("draft");

      expect(result.teams.length).toBe(1);
      const team = result.teams[0];
      if (!team) throw new Error("Team not found");
      expect(team.status).toBe("draft");
    });

    it("handles pagination", async () => {
      const manyTeams = Array.from({ length: 3 }, (_, i) => ({
        ...mockTeam,
        id: `team${i}`,
      }));

      vi.mocked(firestore.getDocs).mockResolvedValueOnce({
        forEach: (cb: (data: unknown) => void) =>
          manyTeams.forEach((t) =>
            cb({
              id: t.id,
              data: () => t,
              ref: { parent: { parent: { id: userId } } },
            })
          ),
        docs: manyTeams.map((t) => ({ id: t.id, data: () => t })),
      } as unknown as firestore.QuerySnapshot);

      const result = await getTeamsByStatus("draft", { limit: 2 });

      expect(result.teams.length).toBe(2);
      expect(result.nextPageToken).toEqual({ userId, teamId: "team1" });
    });
  });

  describe("getAllUserTeams", () => {
    it("returns all teams across all users", async () => {
      setMockDocs([mockTeam]);
      vi.mocked(firestore.getDocs).mockResolvedValueOnce({
        forEach: (cb: (data: unknown) => void) =>
          cb({
            id: teamId,
            data: () => mockTeam,
            ref: { parent: { parent: { id: userId } } },
          }),
        docs: [],
      } as unknown as firestore.QuerySnapshot);

      const result = await getAllUserTeams();

      expect(result.teams.length).toBe(1);
    });
  });

  describe("getAllPendingTeams", () => {
    it("returns teams with pending status", async () => {
      const pendingTeam = { ...mockTeam, status: "pending" };
      vi.mocked(firestore.getDocs).mockResolvedValueOnce({
        forEach: (cb: (data: unknown) => void) =>
          cb({
            id: teamId,
            data: () => pendingTeam,
            ref: { parent: { parent: { id: userId } } },
          }),
        docs: [],
      } as unknown as firestore.QuerySnapshot);

      const result = await getAllPendingTeams();

      expect(result.teams.length).toBe(1);
      const team = result.teams[0];
      if (!team) throw new Error("Team not found");
      expect(team.status).toBe("pending");
    });
  });

  describe("updateTeamStatus", () => {
    it("updates status and sets isPublic to true if approved", async () => {
      await updateTeamStatus(userId, teamId, "approved");

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: "approved",
          isPublic: true,
        })
      );
    });

    it("updates status and sets isPublic to false if rejected", async () => {
      await updateTeamStatus(userId, teamId, "rejected");

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: "rejected",
          isPublic: false,
        })
      );
    });
  });

  describe("getPublicApprovedTeams", () => {
    it("returns only approved and public teams", async () => {
      const approvedTeam = { ...mockTeam, status: "approved", isPublic: true };
      vi.mocked(firestore.getDocs).mockResolvedValueOnce({
        forEach: (cb: (data: unknown) => void) =>
          cb({
            id: teamId,
            data: () => approvedTeam,
            ref: { parent: { parent: { id: userId } } },
          }),
        docs: [],
      } as unknown as firestore.QuerySnapshot);

      const result = await getPublicApprovedTeams();

      expect(result.teams.length).toBe(1);
      const team = result.teams[0];
      if (!team) throw new Error("Team not found");
      expect(team.status).toBe("approved");
      expect(team.isPublic).toBe(true);
    });
  });

  describe("getAllApprovedTeams", () => {
    it("calls getPublicApprovedTeams and returns the teams array", async () => {
      const approvedTeam = { ...mockTeam, status: "approved", isPublic: true };
      vi.mocked(firestore.getDocs).mockResolvedValueOnce({
        forEach: (cb: (data: unknown) => void) =>
          cb({
            id: teamId,
            data: () => approvedTeam,
            ref: { parent: { parent: { id: userId } } },
          }),
        docs: [],
      } as unknown as firestore.QuerySnapshot);

      const result = await getAllApprovedTeams();

      expect(result.length).toBe(1);
      const team = result[0];
      if (!team) throw new Error("Team not found");
      expect(team.status).toBe("approved");
    });
  });
});
