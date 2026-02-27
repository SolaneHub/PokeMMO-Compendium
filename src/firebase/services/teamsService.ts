import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDocs,
  limit as firestoreLimit,
  orderBy,
  query,
  startAfter as firestoreStartAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { z } from "zod";

import { db } from "@/firebase/config";
import { TEAMS_COLLECTION, USERS_COLLECTION } from "@/firebase/services/common";
import {
  StrategyStep,
  StrategyVariation,
  Team,
  TeamStatus,
} from "@/types/teams";

// Recursive Zod schema
const StrategyStepSchema: z.ZodType<StrategyStep> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: z.string(),
    player: z.string().optional(),
    warning: z.string().optional(),
    variations: z.array(StrategyVariationSchema).optional(),
  })
);

const StrategyVariationSchema: z.ZodType<StrategyVariation> = z.lazy(() =>
  z.object({
    type: z.string(),
    name: z.string().optional(),
    steps: z.array(StrategyStepSchema).optional(),
  })
);

const TeamSchema = z.object({
  name: z.string().min(1).max(100),
  region: z.string().max(50).nullable(),
  members: z.array(z.record(z.string(), z.unknown()).nullable()).max(6),
  strategies: z
    .record(z.string(), z.record(z.string(), z.array(StrategyStepSchema)))
    .optional(),
  enemyPools: z.record(z.string(), z.array(z.string())).optional(),
  status: z.enum(["draft", "pending", "approved", "rejected"]).optional(),
  isPublic: z.boolean().optional(),
});

const getUserTeamsRef = (userId: string) => {
  return collection(db, USERS_COLLECTION, userId, TEAMS_COLLECTION);
};

export async function createUserTeam(userId: string, teamData: Partial<Team>) {
  const validatedData = TeamSchema.parse(teamData);
  const teamsRef = getUserTeamsRef(userId);
  const docRef = await addDoc(teamsRef, {
    ...validatedData,
    status: "draft",
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
}

export async function getUserTeams(userId: string): Promise<Team[]> {
  const teamsRef = getUserTeamsRef(userId);
  const q = query(teamsRef);
  const querySnapshot = await getDocs(q);
  const teams: Team[] = [];
  querySnapshot.forEach((doc) => {
    teams.push({ id: doc.id, ...doc.data() } as Team);
  });
  return teams;
}

export async function updateUserTeam(
  userId: string,
  teamId: string,
  updates: Partial<Team>
) {
  const validatedData = TeamSchema.partial().parse(updates);
  const teamRef = doc(db, USERS_COLLECTION, userId, TEAMS_COLLECTION, teamId);
  await updateDoc(teamRef, {
    ...validatedData,
    updatedAt: new Date(),
  });
}

export async function deleteUserTeam(userId: string, teamId: string) {
  const teamRef = doc(db, USERS_COLLECTION, userId, TEAMS_COLLECTION, teamId);
  await deleteDoc(teamRef);
}

interface PaginationOptions {
  limit?: number;
  startAfter?: { userId: string; teamId: string };
}

export async function getTeamsByStatus(
  status: TeamStatus,
  options: PaginationOptions = {}
) {
  const { limit = 50, startAfter } = options;
  let teamsQuery = query(
    collectionGroup(db, TEAMS_COLLECTION),
    where("status", "==", status),
    orderBy("status"),
    orderBy("__name__")
  );
  if (startAfter) {
    const startDocRef = doc(
      db,
      USERS_COLLECTION,
      startAfter.userId,
      TEAMS_COLLECTION,
      startAfter.teamId
    );
    teamsQuery = query(teamsQuery, firestoreStartAfter(startDocRef));
  }
  teamsQuery = query(teamsQuery, firestoreLimit(limit + 1));
  const querySnapshot = await getDocs(teamsQuery);
  const teams: Team[] = [];
  querySnapshot.forEach((doc) => {
    const parentUser = doc.ref.parent.parent;
    teams.push({
      id: doc.id,
      userId: parentUser ? parentUser.id : "unknown",
      ...doc.data(),
    } as Team);
  });
  let nextPageToken = null;
  if (teams.length > limit) {
    teams.pop();
    const lastTeam = teams[teams.length - 1];
    nextPageToken = {
      userId: lastTeam?.userId ?? "unknown",
      teamId: lastTeam?.id ?? "unknown",
    };
  }
  return { teams, nextPageToken };
}

export async function getAllUserTeams(options: PaginationOptions = {}) {
  const { limit = 50, startAfter } = options;
  let teamsQuery = query(
    collectionGroup(db, TEAMS_COLLECTION),
    orderBy("__name__")
  );
  if (startAfter) {
    const startDocRef = doc(
      db,
      USERS_COLLECTION,
      startAfter.userId,
      TEAMS_COLLECTION,
      startAfter.teamId
    );
    teamsQuery = query(teamsQuery, firestoreStartAfter(startDocRef));
  }
  teamsQuery = query(teamsQuery, firestoreLimit(limit + 1));
  const querySnapshot = await getDocs(teamsQuery);
  const teams: Team[] = [];
  querySnapshot.forEach((doc) => {
    const parentUser = doc.ref.parent.parent;
    teams.push({
      id: doc.id,
      userId: parentUser ? parentUser.id : "unknown",
      ...doc.data(),
    } as Team);
  });
  let nextPageToken = null;
  if (teams.length > limit) {
    teams.pop();
    const lastTeam = teams[teams.length - 1];
    nextPageToken = {
      userId: lastTeam?.userId ?? "unknown",
      teamId: lastTeam?.id ?? "unknown",
    };
  }
  return { teams, nextPageToken };
}

export async function getAllPendingTeams() {
  return getTeamsByStatus("pending");
}

export async function updateTeamStatus(
  userId: string,
  teamId: string,
  status: TeamStatus
) {
  const isPublic = status === "approved";
  return updateUserTeam(userId, teamId, { status, isPublic });
}

export async function getPublicApprovedTeams(options: PaginationOptions = {}) {
  const { limit, startAfter } = options;
  let teamsQuery = query(
    collectionGroup(db, TEAMS_COLLECTION),
    where("status", "==", "approved"),
    where("isPublic", "==", true),
    orderBy("status"),
    orderBy("isPublic"),
    orderBy("__name__")
  );
  if (startAfter) {
    const startDocRef = doc(
      db,
      USERS_COLLECTION,
      startAfter.userId,
      TEAMS_COLLECTION,
      startAfter.teamId
    );
    teamsQuery = query(teamsQuery, firestoreStartAfter(startDocRef));
  }
  if (limit) {
    teamsQuery = query(teamsQuery, firestoreLimit(limit + 1));
  }
  const querySnapshot = await getDocs(teamsQuery);
  const teams: Team[] = [];
  querySnapshot.forEach((doc) => {
    const parentUser = doc.ref.parent.parent;
    teams.push({
      id: doc.id,
      userId: parentUser ? parentUser.id : "unknown",
      ...doc.data(),
    } as Team);
  });
  let nextPageToken = null;
  if (limit && teams.length > limit) {
    teams.pop();
    const lastTeam = teams[teams.length - 1];
    nextPageToken = {
      userId: lastTeam?.userId ?? "unknown",
      teamId: lastTeam?.id ?? "unknown",
    };
  }
  return { teams, nextPageToken };
}

export async function getAllApprovedTeams(): Promise<Team[]> {
  const result = await getPublicApprovedTeams();
  return result.teams;
}
