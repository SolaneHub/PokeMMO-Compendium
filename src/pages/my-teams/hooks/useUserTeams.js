import { useCallback, useEffect, useState } from "react";

import {
  createUserTeam,
  deleteUserTeam,
  getUserTeams,
} from "@/firebase/firestoreService";
import { useToast } from "@/shared/components/ToastNotification";
import { useAuth } from "@/shared/context/AuthContext";

export function useUserTeams() {
  const { currentUser, loading: authLoading } = useAuth();
  const showToast = useToast();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH TEAMS
  const _fetchTeams = useCallback(async () => {
    if (!currentUser) {
      if (!authLoading) setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userTeams = await getUserTeams(currentUser.uid);
      setTeams(userTeams);
    } catch (error) {
      console.error(error); // Keep simple console log for debug
      showToast("Failed to load teams", "error");
    } finally {
      setLoading(false);
    }
  }, [currentUser, authLoading, showToast]);

  useEffect(() => {
    _fetchTeams();
  }, [_fetchTeams]);

  // CREATE TEAM
  const createTeam = async (teamName) => {
    if (!currentUser) return null;
    try {
      const newTeam = {
        name: teamName,
        region: null,
        members: Array(6).fill(null),
        strategies: {},
        enemyPools: {},
        status: "draft",
      };
      const teamId = await createUserTeam(currentUser.uid, newTeam);
      showToast("Team created successfully!", "success");

      // Refresh list
      await _fetchTeams();

      return teamId;
    } catch (error) {
      showToast("Failed to create team", "error");
      return null;
    }
  };

  // DELETE TEAM (Manual Optimistic UI)
  const deleteTeam = async (teamId) => {
    if (!currentUser) return;

    // 1. Optimistic Update: Remove locally immediately
    const previousTeams = [...teams];
    setTeams((prev) => prev.filter((t) => t.id !== teamId));

    try {
      // 2. Perform actual deletion
      await deleteUserTeam(currentUser.uid, teamId);
      showToast("Team deleted", "info");
      // 3. Confirm with fresh fetch (optional, but good for consistency)
      await _fetchTeams();
    } catch (error) {
      // 4. Rollback on failure
      setTeams(previousTeams);
      showToast("Failed to delete team", "error");
    }
  };

  return {
    teams, // Return the standard state (which we manage optimistically manually)
    loading: authLoading || loading,
    createTeam,
    deleteTeam,
    authLoading,
    currentUser,
    refreshTeams: _fetchTeams,
  };
}
