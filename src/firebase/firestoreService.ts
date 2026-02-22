import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  DocumentData,
  FieldValue,
  getDoc,
  getDocs,
  limit as firestoreLimit,
  orderBy,
  query,
  setDoc,
  startAfter as firestoreStartAfter,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { z } from "zod";

import { BossFight } from "../types/bossFights";
import { PickupRegion } from "../types/pickup";
import { Pokemon } from "../types/pokemon";
import { SuperTrainer } from "../types/superTrainers";
import { TrainerRerunData } from "../types/trainerRerun";
import { db } from "./config";

// --- Collection References ---
const USERS_COLLECTION = "users";
const TEAMS_COLLECTION = "elite_four_teams";
const POKEDEX_COLLECTION = "pokedex";
const SUPER_TRAINERS_COLLECTION = "super_trainers";
const PICKUP_COLLECTION = "pickup";
const BOSS_FIGHTS_COLLECTION = "boss_fights";
const TRAINER_RERUN_COLLECTION = "trainer_rerun";

// Helper function to normalize doc IDs for Pokedex entries
function getPokemonDocId(id: string | number) {
  if (typeof id === "number") {
    return id.toString().padStart(3, "0");
  }
  if (typeof id === "string" && /^\d+$/.test(id)) {
    return id.padStart(3, "0");
  }
  return id;
}

/**
 * Fetches all Boss Fights data from Firestore.
 */
export async function getBossFights(): Promise<BossFight[]> {
  const collRef = collection(db, BOSS_FIGHTS_COLLECTION);
  const q = query(collRef);
  const querySnapshot = await getDocs(q);
  const bossFights: BossFight[] = [];
  querySnapshot.forEach((doc) => {
    bossFights.push(doc.data() as BossFight);
  });
  return bossFights;
}

/**
 * Updates Boss Fights collection.
 */
export async function updateBossFightsCollection(bossFightsArray: BossFight[]) {
  if (!bossFightsArray || bossFightsArray.length === 0) return;
  const batch = writeBatch(db);
  bossFightsArray.forEach((bossFight) => {
    if (bossFight.name && bossFight.region) {
      const docId = `${bossFight.region}-${bossFight.name}`.toLowerCase();
      const docRef = doc(db, BOSS_FIGHTS_COLLECTION, docId);
      const cleanData = JSON.parse(JSON.stringify(bossFight));
      batch.set(docRef, cleanData);
    }
  });
  await batch.commit();
}

/**
 * Fetches Trainer Rerun data from Firestore.
 * There's only one main document for trainer rerun.
 */
export async function getTrainerRerun(): Promise<TrainerRerunData | null> {
  const docRef = doc(db, TRAINER_RERUN_COLLECTION, "main");
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data() as TrainerRerunData;
}

/**
 * Updates Trainer Rerun document.
 */
export async function updateTrainerRerun(data: TrainerRerunData) {
  const docRef = doc(db, TRAINER_RERUN_COLLECTION, "main");
  const cleanData = JSON.parse(JSON.stringify(data));
  await setDoc(docRef, cleanData);
}

/**
 * Fetches all Pickup data from Firestore.
 */
export async function getPickupData(): Promise<PickupRegion[]> {
  const collRef = collection(db, PICKUP_COLLECTION);
  const q = query(collRef);
  const querySnapshot = await getDocs(q);
  const regions: PickupRegion[] = [];
  querySnapshot.forEach((doc) => {
    regions.push({ ...doc.data(), id: doc.id } as PickupRegion);
  });
  return regions;
}

/**
 * Updates Pickup collection.
 */
export async function updatePickupCollection(regionsArray: PickupRegion[]) {
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
export async function getSuperTrainers(): Promise<SuperTrainer[]> {
  const collRef = collection(db, SUPER_TRAINERS_COLLECTION);
  const q = query(collRef);
  const querySnapshot = await getDocs(q);
  const trainers: SuperTrainer[] = [];
  querySnapshot.forEach((doc) => {
    trainers.push(doc.data() as SuperTrainer);
  });
  return trainers;
}

/**
 * Updates Super Trainers collection.
 */
export async function updateSuperTrainersCollection(
  trainersArray: SuperTrainer[]
) {
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
 */
export async function getPokedexData(): Promise<Pokemon[]> {
  const pokedexRef = collection(db, POKEDEX_COLLECTION);
  const q = query(pokedexRef);
  const querySnapshot = await getDocs(q);
  const pokedex: Pokemon[] = [];
  querySnapshot.forEach((doc) => {
    pokedex.push({ id: doc.id, ...doc.data() } as Pokemon);
  });
  return pokedex;
}

// Define types for Zod schemas
export interface StrategyStep {
  id: string;
  type: string;
  description?: string;
  notes?: string;
  player?: string;
  warning?: string;
  variations?: StrategyVariation[];
}

export interface StrategyVariation {
  type: string;
  name?: string;
  steps?: StrategyStep[];
}

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

export type TeamStatus = "draft" | "pending" | "approved" | "rejected";

export interface TeamMember {
  name: string;
  item: string;
  ability: string;
  nature: string;
  evs: string;
  ivs: string;
  moves: string[];
  move1?: string;
  move2?: string;
  move3?: string;
  move4?: string;
  dexId?: number | string | null;
}

export interface Team {
  id?: string;
  userId?: string;
  name: string;
  region: string | null;
  members: (TeamMember | null)[];
  strategies?: Record<string, Record<string, StrategyStep[]>>;
  enemyPools?: Record<string, string[]>;
  status?: TeamStatus;
  isPublic?: boolean;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
}

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

export async function updatePokedexData(pokedexArray: Pokemon[]) {
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

export async function savePokedexEntry(pokemon: Pokemon) {
  if (!pokemon.name) throw new Error("Pokemon name is required");
  const docId = pokemon.id
    ? getPokemonDocId(pokemon.id)
    : pokemon.name.toLowerCase();
  const docRef = doc(db, POKEDEX_COLLECTION, docId);
  const cleanPokemon = JSON.parse(JSON.stringify(pokemon));
  await setDoc(docRef, cleanPokemon);
}

export async function updatePokedexEntry(
  id: string | number,
  updates: Partial<Pokemon>
) {
  const docId = getPokemonDocId(id);
  const docRef = doc(db, POKEDEX_COLLECTION, docId);
  await updateDoc(docRef, updates as DocumentData);
}

export async function deletePokedexEntry(id: string | number) {
  const docId = getPokemonDocId(id);
  const docRef = doc(db, POKEDEX_COLLECTION, docId);
  await deleteDoc(docRef);
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
