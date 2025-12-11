import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";

import { getUserTeams, updateUserTeam } from "@/firebase/firestoreService";
import { useToast } from "@/shared/components/ToastNotification";
import { useAuth } from "@/shared/context/AuthContext";

export function useTeamEditor() {
  const { id: teamId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (!currentUser) return;
      try {
        const teams = await getUserTeams(currentUser.uid);
        const found = teams.find((t) => t.id === teamId);
        if (found) {
          setTeam(found);
          if (!found.strategies) found.strategies = {};
          if (!found.enemyPools) found.enemyPools = {};
        } else {
          showToast("Team not found", "error");
          navigate("/my-teams");
        }
      } catch (err) {
        console.error(err);
        showToast("Error loading team", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser, teamId, navigate, showToast]);

  const saveTeam = async (updatedTeam) => {
    const teamToSave = updatedTeam || team;
    if (!teamToSave) return;
    setSaving(true);
    try {
      await updateUserTeam(currentUser.uid, teamId, {
        name: teamToSave.name,
        members: teamToSave.members,
        strategies: teamToSave.strategies,
        enemyPools: teamToSave.enemyPools,
      });
      showToast("Team saved successfully!", "success");
      setTeam(teamToSave); // Update local state if needed
    } catch (error) {
      console.error(error);
      showToast("Failed to save team", "error");
    } finally {
      setSaving(false);
    }
  };

  return { team, setTeam, loading, saving, saveTeam };
}
