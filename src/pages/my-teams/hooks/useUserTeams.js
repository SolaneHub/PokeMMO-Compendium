import { useCallback, useEffect, useOptimistic, useState } from "react";

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

  // Optimistic UI for deletions
  const [optimisticTeams, setOptimisticTeams] = useOptimistic(
    teams,
    (state, teamIdToDelete) => state.filter((t) => t.id !== teamIdToDelete)
  );

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
      showToast("Failed to load teams", "error");
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid, authLoading, showToast]);

  useEffect(() => {
    _fetchTeams();
  }, [_fetchTeams]);

  const createTeam = async (teamName) => {
    if (!currentUser) return null;
    try {
      const newTeam = {
        name: teamName,
        region: null,
        members: Array(6).fill(null),
        strategies: {},
        enemyPools: {}, // ✅ Aggiungi questo
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

  const deleteTeam = async (teamId) => {
    if (!currentUser) return;

    // Optimistically update UI
    setOptimisticTeams(teamId);

    try {
      await deleteUserTeam(currentUser.uid, teamId);
      showToast("Team deleted", "info");
      // Update actual state by refetching
      await _fetchTeams();
    } catch (error) {
      showToast("Failed to delete team", "error");
      // Re-fetch to sync state if failed
      await _fetchTeams();
    }
  };

  return {
    teams: optimisticTeams,
    loading: authLoading || loading,
    createTeam,
    deleteTeam,
    authLoading,
    currentUser,
    refreshTeams: _fetchTeams, // Expose the internal fetch function as refreshTeams
  };
}
