import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  createUserTeam,
  deleteUserTeam,
  getUserTeams,
} from "@/firebase/firestoreService";

export function useUserTeams() {
  const { currentUser, loading: authLoading } = useAuth();
  const showToast = useToast();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, [currentUser, authLoading, showToast]);

  useEffect(() => {
    _fetchTeams();
  }, [_fetchTeams]);

  const createTeam = useCallback(
    async (teamName) => {
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
        _fetchTeams().catch(() => {});
        return teamId;
      } catch (error) {
        showToast("Failed to create team", "error");
        return null;
      }
    },
    [currentUser, showToast, _fetchTeams]
  );

  const deleteTeam = useCallback(
    async (teamId) => {
      if (!currentUser) return;
      const previousTeams = teams;
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
      try {
        await deleteUserTeam(currentUser.uid, teamId);
        showToast("Team deleted", "info");
      } catch (error) {
        setTeams(previousTeams);
        showToast("Failed to delete team", "error");
      }
    },
    [currentUser, showToast, teams]
  );

  return {
    teams,
    loading: authLoading || loading,
    createTeam,
    deleteTeam,
    authLoading,
    currentUser,
    refreshTeams: _fetchTeams,
  };
}
