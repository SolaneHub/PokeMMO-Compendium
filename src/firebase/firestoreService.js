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
  writeBatch,
} from "firebase/firestore";
import { z } from "zod";

import { db } from "./config";

// --- Collection References ---
const USERS_COLLECTION = "users";
const TEAMS_COLLECTION = "elite_four_teams";
const POKEDEX_COLLECTION = "pokedex";

/**
 * Fetches all Pokemon data from the 'pokedex' collection.
 * @returns {Promise<Array>} List of all Pokemon.
 */
export async function getPokedexData() {
  const pokedexRef = collection(db, POKEDEX_COLLECTION);
  const q = query(pokedexRef);
  const querySnapshot = await getDocs(q);

  const pokedex = [];
  querySnapshot.forEach((doc) => {
    pokedex.push({ id: doc.id, ...doc.data() });
  });

  return pokedex;
}

// Define a schema for a single strategy step (recursive)
const StrategyStepSchema = z.object({
  id: z.string(),
  type: z.string(), // "main", "note", "variation_step" etc.
  player: z.string().optional(),
  warning: z.string().optional(),
  variations: z.array(z.lazy(() => StrategyVariationSchema)).optional(), // Using z.lazy for recursion
});

// Define a schema for a variation within a strategy step (recursive)
const StrategyVariationSchema = z.object({
  type: z.string(), // e.g., "step"
  name: z.string().optional(),
  steps: z.array(StrategyStepSchema).optional(), // This will be an array of StrategyStepSchema
});

// Aggiungi limiti nella validazione
const TeamSchema = z
  .object({
    name: z.string().min(1).max(100),
    region: z.string().max(50).nullable(),
    members: z.array(z.any()).max(6),
    strategies: z
      .record(z.string(), z.record(z.string(), z.array(StrategyStepSchema)))
      .optional(), // Nested object: memberName -> enemyName -> array of StrategyStepSchema
    enemyPools: z.record(z.string(), z.array(z.string())).optional(), // Nested object: memberName -> array of enemy pokemon names
    status: z.enum(["draft", "pending", "approved", "rejected"]).optional(),
    isPublic: z.boolean().optional(),
  })
  .refine((data) => JSON.stringify(data).length < 1000000, {
    message: "Team data too large",
  });

// Helper to get teams collection ref for a specific user
const getUserTeamsRef = (userId) => {
  return collection(db, USERS_COLLECTION, userId, TEAMS_COLLECTION);
};

/**
 * Creates a new team for the user.
 * @param {string} userId - The user's Firebase UID.
 * @param {object} teamData - The team data (name, region, members, etc.).
 * @returns {Promise<string>} The new team ID.
 */
export async function createUserTeam(userId, teamData) {
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

/**
 * Fetches all Elite Four teams for a user.
 * @param {string} userId - The user's Firebase UID.
 * @returns {Promise<Array>} List of teams with IDs.
 */
export async function getUserTeams(userId) {
  const teamsRef = getUserTeamsRef(userId);
  const q = query(teamsRef);
  const querySnapshot = await getDocs(q);

  const teams = [];
  querySnapshot.forEach((doc) => {
    teams.push({ id: doc.id, ...doc.data() });
  });

  return teams;
}

/**
 * Updates an existing team.
 * @param {string} userId
 * @param {string} teamId
 * @param {object} updates
 */
export async function updateUserTeam(userId, teamId, updates) {
  const validatedData = TeamSchema.partial().parse(updates);
  const teamRef = doc(db, USERS_COLLECTION, userId, TEAMS_COLLECTION, teamId);
  await updateDoc(teamRef, {
    ...validatedData,
    updatedAt: new Date(),
  });
}

/**
 * Deletes a team.
 * @param {string} userId
 * @param {string} teamId
 */
export async function deleteUserTeam(userId, teamId) {
  const teamRef = doc(db, USERS_COLLECTION, userId, TEAMS_COLLECTION, teamId);
  await deleteDoc(teamRef);
}

// --- Admin / Approval Functions ---

/**
 * Fetches all teams with a specific status across ALL users.
 * @param {string} status - 'pending' | 'approved' | 'rejected'
 * @param {Object} options - Pagination options.
 * @param {number} options.limit - Number of teams to fetch.
 * @param {Object} options.startAfter - { userId, teamId } of the last team from previous page.
 * @returns {Promise<Object>} { teams, nextPageToken } where nextPageToken is { userId, teamId } or null.
 */
export async function getTeamsByStatus(
  status,
  { limit = 50, startAfter } = {}
) {
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

  teamsQuery = query(teamsQuery, firestoreLimit(limit + 1)); // +1 to check if there are more

  const querySnapshot = await getDocs(teamsQuery);
  const teams = [];

  querySnapshot.forEach((doc) => {
    const parentUser = doc.ref.parent.parent;
    teams.push({
      id: doc.id,
      userId: parentUser ? parentUser.id : "unknown",
      ...doc.data(),
    });
  });

  let nextPageToken = null;
  if (teams.length > limit) {
    teams.pop(); // remove the extra one
    nextPageToken = {
      userId: teams[teams.length - 1].userId,
      teamId: teams[teams.length - 1].id,
    };
  }

  return { teams, nextPageToken };
}

/**
 * Fetches ALL teams across ALL users with pagination support.
 * Requires a Firestore Composite Index (CollectionGroup).
 * @param {Object} options - Pagination options.
 * @param {number} options.limit - Number of teams to fetch.
 * @param {Object} options.startAfter - { userId, teamId } of the last team from previous page.
 * @returns {Promise<Object>} { teams, nextPageToken } where nextPageToken is { userId, teamId } or null.
 */
export async function getAllUserTeams({ limit = 50, startAfter } = {}) {
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

  teamsQuery = query(teamsQuery, firestoreLimit(limit + 1)); // +1 to check if there are more

  const querySnapshot = await getDocs(teamsQuery);
  const teams = [];

  querySnapshot.forEach((doc) => {
    const parentUser = doc.ref.parent.parent;
    teams.push({
      id: doc.id,
      userId: parentUser ? parentUser.id : "unknown",
      ...doc.data(),
    });
  });

  let nextPageToken = null;
  if (teams.length > limit) {
    teams.pop(); // remove the extra one
    nextPageToken = {
      userId: teams[teams.length - 1].userId,
      teamId: teams[teams.length - 1].id,
    };
  }

  return { teams, nextPageToken };
}

/**
 * Updates an array of Pokemon data in the 'pokedex' collection.
 * Each Pokemon document is identified by its 'id' field.
 * Uses a batch write for efficiency.
 * @param {Array<Object>} pokedexArray - An array of Pokemon objects to update.
 */
export async function updatePokedexData(pokedexArray) {
  if (!pokedexArray || pokedexArray.length === 0) {
    console.warn("No Pokedex data provided for update.");
    return;
  }

  const batch = writeBatch(db);

  pokedexArray.forEach((pokemon) => {
    if (pokemon.id) {
      // Use zero-padding for document ID to ensure correct lexicographical order in Firestore console
      const docId = pokemon.id.toString().padStart(3, "0");
      const docRef = doc(db, POKEDEX_COLLECTION, docId);
      // Firestore doesn't like undefined values, so clean the object
      const cleanPokemon = JSON.parse(JSON.stringify(pokemon));
      batch.set(docRef, cleanPokemon, { merge: true }); // Use merge to avoid overwriting entire documents if not all fields are present
    } else {
      console.warn("Pokemon object missing 'id' field, skipping:", pokemon);
    }
  });

  await batch.commit();
}
/**
 * Fetches all teams with status 'pending' across ALL users.
 * Requires a Firestore Composite Index (CollectionGroup).
 */
export async function getAllPendingTeams() {
  return getTeamsByStatus("pending");
}

/**
 * Updates the approval status of a team.
 * Automatically handles visibility: Approved teams become public.
 * @param {string} userId - The ID of the user who owns the team.
 * @param {string} teamId - The team ID.
 * @param {string} status - 'approved' | 'rejected' | 'pending'
 */
export async function updateTeamStatus(userId, teamId, status) {
  const isPublic = status === "approved";
  return updateUserTeam(userId, teamId, { status, isPublic });
}

/**
 * Fetches all teams with status 'approved' AND 'isPublic' == true.
 * This is for the public gallery.
 * Requires a Composite Index: status ASC, isPublic ASC, __name__ ASC.
 * @param {Object} options - Pagination options.
 * @param {number} options.limit - Number of teams to fetch. If not provided, fetches all.
 * @param {Object} options.startAfter - { userId, teamId } of the last team from previous page.
 * @returns {Promise<Object>} { teams, nextPageToken } where nextPageToken is { userId, teamId } or null.
 */
export async function getPublicApprovedTeams(options = {}) {
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
    teamsQuery = query(teamsQuery, firestoreLimit(limit + 1)); // +1 to check if there are more
  }

  const querySnapshot = await getDocs(teamsQuery);
  const teams = [];

  querySnapshot.forEach((doc) => {
    const parentUser = doc.ref.parent.parent;
    teams.push({
      id: doc.id,
      userId: parentUser ? parentUser.id : "unknown",
      ...doc.data(),
    });
  });

  let nextPageToken = null;
  if (limit && teams.length > limit) {
    teams.pop(); // remove the extra one
    nextPageToken = {
      userId: teams[teams.length - 1].userId,
      teamId: teams[teams.length - 1].id,
    };
  }

  return { teams, nextPageToken };
}

/**
 * @deprecated Since v1.0 - will be removed in v2.0. Use getPublicApprovedTeams for public views or getTeamsByStatus('approved') for admin views.
 */
export async function getAllApprovedTeams() {
  const result = await getPublicApprovedTeams();
  return result.teams;
}
