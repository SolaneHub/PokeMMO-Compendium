import { 
  addDoc, 
  collection, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  updateDoc, 
} from "firebase/firestore";

import { db } from "./config";

// --- Collection References ---
const USERS_COLLECTION = "users";
const TEAMS_COLLECTION = "elite_four_teams";

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
  try {
    const teamsRef = getUserTeamsRef(userId);
    const docRef = await addDoc(teamsRef, {
      ...teamData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating team:", error);
    throw error;
  }
}

/**
 * Fetches all Elite Four teams for a user.
 * @param {string} userId - The user's Firebase UID.
 * @returns {Promise<Array>} List of teams with IDs.
 */
export async function getUserTeams(userId) {
  try {
    const teamsRef = getUserTeamsRef(userId);
    const q = query(teamsRef);
    const querySnapshot = await getDocs(q);
    
    const teams = [];
    querySnapshot.forEach((doc) => {
      teams.push({ id: doc.id, ...doc.data() });
    });
    
    return teams;
  } catch (error) {
    console.error("Error fetching user teams:", error);
    throw error;
  }
}

/**
 * Updates an existing team.
 * @param {string} userId 
 * @param {string} teamId 
 * @param {object} updates 
 */
export async function updateUserTeam(userId, teamId, updates) {
  try {
    const teamRef = doc(db, USERS_COLLECTION, userId, TEAMS_COLLECTION, teamId);
    await updateDoc(teamRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating team:", error);
    throw error;
  }
}

/**
 * Deletes a team.
 * @param {string} userId 
 * @param {string} teamId 
 */
export async function deleteUserTeam(userId, teamId) {
  try {
    const teamRef = doc(db, USERS_COLLECTION, userId, TEAMS_COLLECTION, teamId);
    await deleteDoc(teamRef);
  } catch (error) {
    console.error("Error deleting team:", error);
    throw error;
  }
}
