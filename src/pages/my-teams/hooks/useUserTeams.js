import { useEffect, useOptimistic, useState } from "react";

import { createUserTeam, deleteUserTeam, getUserTeams } from "@/firebase/firestoreService";
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

  useEffect(() => {
    let ignore = false;
    async function fetchTeams() {
      if (!currentUser) {
        if (!authLoading) setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const userTeams = await getUserTeams(currentUser.uid);
        if (!ignore) setTeams(userTeams);
      } catch (error) {
        console.error(error);
        if (!ignore) showToast("Failed to load teams", "error");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchTeams();
    return () => { ignore = true; };
  }, [currentUser, authLoading, showToast]);

  const createTeam = async (teamName) => {
    if (!currentUser) return null;
    try {
      const newTeam = {
        name: teamName,
        region: null,
        members: Array(6).fill(null),
        strategies: {},
      };
      const teamId = await createUserTeam(currentUser.uid, newTeam);
      showToast("Team created successfully!", "success");
      
      // Refresh list
      const updatedTeams = await getUserTeams(currentUser.uid);
      setTeams(updatedTeams);
      
      return teamId;
    } catch (error) {
        console.error(error);
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
      // Update actual state
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
    } catch (error) {
      console.error(error);
      showToast("Failed to delete team", "error");
      // Re-fetch to sync state if failed
      const updatedTeams = await getUserTeams(currentUser.uid);
      setTeams(updatedTeams);
    }
  };

  return { 
    teams: optimisticTeams, 
    loading: authLoading || loading, 
    createTeam, 
    deleteTeam, 
    authLoading, 
    currentUser 
  };
}
