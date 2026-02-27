// --- Collection References ---
export const USERS_COLLECTION = "users";
export const TEAMS_COLLECTION = "elite_four_teams";
export const POKEDEX_COLLECTION = "pokedex";
export const SUPER_TRAINERS_COLLECTION = "super_trainers";
export const PICKUP_COLLECTION = "pickup";
export const BOSS_FIGHTS_COLLECTION = "boss_fights";
export const TRAINER_RERUN_COLLECTION = "trainer_rerun";
export const MOVES_COLLECTION = "moves";

/**
 * Helper function to normalize doc IDs for Pokedex entries
 */
export function getPokemonDocId(id: string | number) {
  if (typeof id === "number") {
    return id.toString().padStart(3, "0");
  }
  if (typeof id === "string" && /^\d+$/.test(id)) {
    return id.padStart(3, "0");
  }
  return id;
}
