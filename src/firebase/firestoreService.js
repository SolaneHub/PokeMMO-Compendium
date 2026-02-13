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
  setDoc,
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
const SUPER_TRAINERS_COLLECTION = "super_trainers";
const PICKUP_COLLECTION = "pickup";

// Helper function to normalize doc IDs for Pokedex entries
function getPokemonDocId(id) {
  if (typeof id === "number") {
    return id.toString().padStart(3, "0");
  }
  if (typeof id === "string" && /^\d+$/.test(id)) {
    return id.padStart(3, "0");
  }
  return id;
}

/**
 * Fetches all Pickup data from Firestore.
 */
export async function getPickupData() {
  const collRef = collection(db, PICKUP_COLLECTION);
  const q = query(collRef);
  const querySnapshot = await getDocs(q);
  const regions = [];
  querySnapshot.forEach((doc) => {
    regions.push(doc.data());
  });
  return regions;
}

/**
 * Updates Pickup collection.
 * @param {Array} regionsArray - Array of region objects.
 */
export async function updatePickupCollection(regionsArray) {
  if (!regionsArray || regionsArray.length === 0) return;
  const batch = writeBatch(db);
  regionsArray.forEach((region) => {
    if (region.name) {
      const docId = region.name.toLowerCase();
      const docRef = doc(db, PICKUP_COLLECTION, docId);
      const cleanData = JSON.parse(JSON.stringify(region));
      batch.set(docRef, cleanData);
    }
  });
  await batch.commit();
}

/**
 * Fetches all Super Trainers data from Firestore.
 */
export async function getSuperTrainers() {
  const collRef = collection(db, SUPER_TRAINERS_COLLECTION);
  const q = query(collRef);
  const querySnapshot = await getDocs(q);
  const trainers = [];
  querySnapshot.forEach((doc) => {
    trainers.push(doc.data());
  });
  return trainers;
}

/**
 * Updates Super Trainers collection.
 */
export async function updateSuperTrainersCollection(trainersArray) {
  if (!trainersArray || trainersArray.length === 0) return;
  const batch = writeBatch(db);
  trainersArray.forEach((trainer) => {
    if (trainer.name) {
      const docId = trainer.name.toLowerCase();
      const docRef = doc(db, SUPER_TRAINERS_COLLECTION, docId);
      const cleanData = JSON.parse(JSON.stringify(trainer));
      batch.set(docRef, cleanData);
    }
  });
  await batch.commit();
}

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
  variations: z.array(z.lazy(() => StrategyVariationSchema)).optional(),
});

const StrategyVariationSchema = z.object({
  type: z.string(), // e.g., "step"
  name: z.string().optional(),
  steps: z.array(StrategyStepSchema).optional(),
});

const BaseTeamSchema = z.object({
  name: z.string().min(1).max(100),
  region: z.string().max(50).nullable(),
  members: z.array(z.any()).max(6),
  strategies: z
    .record(z.string(), z.record(z.string(), z.array(StrategyStepSchema)))
    .optional(),
  enemyPools: z.record(z.string(), z.array(z.string())).optional(),
  status: z.enum(["draft", "pending", "approved", "rejected"]).optional(),
  isPublic: z.boolean().optional(),
});

const TeamSchema = BaseTeamSchema.refine(
  (data) => JSON.stringify(data).length < 1000000,
  {
    message: "Team data too large",
  }
);

const getUserTeamsRef = (userId) => {
  return collection(db, USERS_COLLECTION, userId, TEAMS_COLLECTION);
};

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

export async function updateUserTeam(userId, teamId, updates) {
  const validatedData = TeamSchema.partial().parse(updates);
  const teamRef = doc(db, USERS_COLLECTION, userId, TEAMS_COLLECTION, teamId);
  await updateDoc(teamRef, {
    ...validatedData,
    updatedAt: new Date(),
  });
}

export async function deleteUserTeam(userId, teamId) {
  const teamRef = doc(db, USERS_COLLECTION, userId, TEAMS_COLLECTION, teamId);
  await deleteDoc(teamRef);
}

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
  teamsQuery = query(teamsQuery, firestoreLimit(limit + 1));
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
    teams.pop();
    nextPageToken = {
      userId: teams[teams.length - 1].userId,
      teamId: teams[teams.length - 1].id,
    };
  }
  return { teams, nextPageToken };
}

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
  teamsQuery = query(teamsQuery, firestoreLimit(limit + 1));
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
    teams.pop();
    nextPageToken = {
      userId: teams[teams.length - 1].userId,
      teamId: teams[teams.length - 1].id,
    };
  }
  return { teams, nextPageToken };
}

export async function updatePokedexData(pokedexArray) {
  if (!pokedexArray || pokedexArray.length === 0) {
    return;
  }
  const batch = writeBatch(db);
  pokedexArray.forEach((pokemon) => {
    if (pokemon.id) {
      const docId = getPokemonDocId(pokemon.id);
      const docRef = doc(db, POKEDEX_COLLECTION, docId);
      const cleanPokemon = JSON.parse(JSON.stringify(pokemon));
      batch.set(docRef, cleanPokemon, { merge: true });
    }
  });
  await batch.commit();
}

export async function savePokedexEntry(pokemon) {
  if (!pokemon.name) throw new Error("Pokemon name is required");
  const docId = pokemon.id
    ? getPokemonDocId(pokemon.id)
    : pokemon.name.toLowerCase();
  const docRef = doc(db, POKEDEX_COLLECTION, docId);
  const cleanPokemon = JSON.parse(JSON.stringify(pokemon));
  await setDoc(docRef, cleanPokemon);
}

export async function updatePokedexEntry(id, updates) {
  const docId = getPokemonDocId(id);
  const docRef = doc(db, POKEDEX_COLLECTION, docId);
  await updateDoc(docRef, updates);
}

export async function deletePokedexEntry(id) {
  const docId = getPokemonDocId(id);
  const docRef = doc(db, POKEDEX_COLLECTION, docId);
  await deleteDoc(docRef);
}

export async function getAllPendingTeams() {
  return getTeamsByStatus("pending");
}

export async function updateTeamStatus(userId, teamId, status) {
  const isPublic = status === "approved";
  return updateUserTeam(userId, teamId, { status, isPublic });
}

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
    teamsQuery = query(teamsQuery, firestoreLimit(limit + 1));
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
    teams.pop();
    nextPageToken = {
      userId: teams[teams.length - 1].userId,
      teamId: teams[teams.length - 1].id,
    };
  }
  return { teams, nextPageToken };
}

export async function getAllApprovedTeams() {
  const result = await getPublicApprovedTeams();
  return result.teams;
}
