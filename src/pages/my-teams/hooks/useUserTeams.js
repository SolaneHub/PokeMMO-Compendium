import { useCallback, useEffect,useState } from "react";

import { createUserTeam, deleteUserTeam,getUserTeams } from "@/firebase/firestoreService";
import { useToast } from "@/shared/components/ToastNotification";
import { useAuth } from "@/shared/context/AuthContext";

export function useUserTeams() {
  const { currentUser, loading: authLoading } = useAuth();
  const showToast = useToast();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchTeams = useCallback(async () => {
    if (!currentUser) return;
    try {
      const userTeams = await getUserTeams(currentUser.uid);
      setTeams(userTeams);
    } catch (error) {
      console.error(error);
      showToast("Failed to load teams", "error");
    } finally {
      setLoading(false);
    }
  }, [currentUser, showToast]);

  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchTeams();
    } else if (!authLoading && !currentUser) {
        setLoading(false);
    }
  }, [currentUser, authLoading, fetchTeams]);

  const createTeam = async (teamName) => {
    if (!currentUser) return null;
    setCreating(true);
    try {
      const newTeam = {
        name: teamName,
        region: null,
        members: Array(6).fill(null),
        strategies: {},
      };
      const teamId = await createUserTeam(currentUser.uid, newTeam);
      showToast("Team created successfully!", "success");
      return teamId;
    } catch (error) {
        console.error(error);
        showToast("Failed to create team", "error");
        return null;
    } finally {
      setCreating(false);
    }
  };

  const deleteTeam = async (teamId) => {
    if (!currentUser) return;
    try {
      await deleteUserTeam(currentUser.uid, teamId);
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
      showToast("Team deleted", "info");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete team", "error");
    }
  };

  return { teams, loading, creating, createTeam, deleteTeam, authLoading, currentUser };
}
