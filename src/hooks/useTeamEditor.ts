import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getUserTeams, updateUserTeam } from "@/firebase/services/teamsService";
import { StrategyStep, StrategyVariation, Team } from "@/types/teams";

const ensureStepIds = (steps: StrategyStep[]): StrategyStep[] => {
  if (!Array.isArray(steps)) return [];
  return steps.map((step) => {
    const newStep: StrategyStep = {
      ...step,
      id: step.id || crypto.randomUUID(),
      type: step.type || "main",
    };
    if (newStep.variations && Array.isArray(newStep.variations)) {
      newStep.variations = newStep.variations.map((v: StrategyVariation) => ({
        ...v,
        type: v.type || "step",
        steps: ensureStepIds(v.steps || []),
      }));
    }
    return newStep;
  });
};

const sanitizeTeam = (teamData: Team | null): Team | null => {
  if (!teamData) return null;
  const sanitized: Team = structuredClone(teamData);
  if (!sanitized.strategies) sanitized.strategies = {};
  if (!sanitized.enemyPools) sanitized.enemyPools = {};
  if (!sanitized.members) sanitized.members = [];
  if (sanitized.region === undefined) sanitized.region = null;

  if (sanitized.strategies && typeof sanitized.strategies === "object") {
    const strategies = sanitized.strategies;
    Object.keys(strategies).forEach((memberName) => {
      const memberStrats = strategies[memberName];
      if (memberStrats && typeof memberStrats === "object") {
        Object.keys(memberStrats).forEach((enemyName) => {
          const steps = memberStrats[enemyName];
          if (steps) {
            memberStrats[enemyName] = ensureStepIds(steps);
          }
        });
      }
    });
  }

  if (sanitized.enemyPools && typeof sanitized.enemyPools === "object") {
    const pools = sanitized.enemyPools;
    Object.keys(pools).forEach((key) => {
      if (!Array.isArray(pools[key])) {
        (pools as Record<string, string[]>)[key] = [];
      }
    });
  }
  return sanitized;
};

export function useTeamEditor() {
  const { id: teamId, userId: paramUserId } = useParams<{
    id: string;
    userId?: string;
  }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const targetUserId = paramUserId || currentUser?.uid;

  useEffect(() => {
    async function load() {
      if (!targetUserId || !teamId) return;
      try {
        const teams = await getUserTeams(targetUserId);
        const found = teams.find((t) => t.id === teamId);
        if (found) {
          const sanitized = sanitizeTeam(found);
          setTeam(sanitized);
        } else {
          showToast("Team not found", "error");
          navigate(paramUserId ? "/admin/dashboard" : "/my-teams");
        }
      } catch {
        // Error is handled by showing a toast notification to the user
        showToast("Error loading team", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [targetUserId, teamId, navigate, showToast, paramUserId]);

  const saveTeam = async (updatedTeam?: Team) => {
    const teamToSave = updatedTeam || team;
    if (!teamToSave || !targetUserId || !teamId) return;
    setSaving(true);
    const sanitizedToSave = sanitizeTeam(teamToSave);
    if (!sanitizedToSave) return;

    try {
      await updateUserTeam(targetUserId, teamId, {
        name: sanitizedToSave.name,
        region: sanitizedToSave.region,
        members: sanitizedToSave.members,
        strategies: sanitizedToSave.strategies,
        enemyPools: sanitizedToSave.enemyPools,
      });
      showToast("Team saved successfully!", "success");
      setTeam(sanitizedToSave);
    } catch {
      // Error is handled by showing a toast notification to the user
      showToast("Failed to save team. Data might be invalid.", "error");
    } finally {
      setSaving(false);
    }
  };

  return { team, setTeam, loading, saving, saveTeam };
}
