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

import { db } from "@/firebase/config";
import { TEAMS_COLLECTION, USERS_COLLECTION } from "@/firebase/services/common";
import { Team, TeamSchema, TeamStatus } from "@/types/teams";

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
    const data = { id: doc.id, ...doc.data() };
    const result = TeamSchema.safeParse(data);
    if (result.success) {
      teams.push(result.data);
    } else {
      console.warn(
        `[Zod Validation] Invalid Team data for doc ID: ${doc.id}`,
        result.error
      );
    }
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
    const data = {
      id: doc.id,
      userId: parentUser ? parentUser.id : "unknown",
      ...doc.data(),
    };
    const result = TeamSchema.safeParse(data);
    if (result.success) {
      teams.push(result.data);
    } else {
      console.warn(
        `[Zod Validation] Invalid Team data for doc ID: ${doc.id}`,
        result.error
      );
    }
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
    const data = {
      id: doc.id,
      userId: parentUser ? parentUser.id : "unknown",
      ...doc.data(),
    };
    const result = TeamSchema.safeParse(data);
    if (result.success) {
      teams.push(result.data);
    } else {
      console.warn(
        `[Zod Validation] Invalid Team data for doc ID: ${doc.id}`,
        result.error
      );
    }
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
    const data = {
      id: doc.id,
      userId: parentUser ? parentUser.id : "unknown",
      ...doc.data(),
    };
    const result = TeamSchema.safeParse(data);
    if (result.success) {
      teams.push(result.data);
    } else {
      console.warn(
        `[Zod Validation] Invalid Team data for doc ID: ${doc.id}`,
        result.error
      );
    }
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
