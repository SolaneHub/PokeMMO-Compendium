import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getUserTeams, updateUserTeam } from "@/firebase/firestoreService";
import { useToast } from "@/shared/components/ToastNotification";
import { useAuth } from "@/shared/context/AuthContext";

/**
 * Recursively ensures all strategy steps have a unique ID and correct structure.
 * This is crucial for legacy data migration and DND functionality.
 */
const ensureStepIds = (steps) => {
  if (!Array.isArray(steps)) return [];
  return steps.map((step) => {
    const newStep = {
      ...step,
      id: step.id || crypto.randomUUID(),
      type: step.type || "main",
    };

    // Handle variations: ensure it's an array or undefined (not null)
    if (newStep.variations && Array.isArray(newStep.variations)) {
      newStep.variations = newStep.variations.map((v) => ({
        ...v,
        type: v.type || "step", // Ensure variation has a type
        steps: ensureStepIds(v.steps || []), // Ensure steps is an array
      }));
    } else if (newStep.variations === null) {
      delete newStep.variations;
    }

    return newStep;
  });
};

/**
 * Sanitizes team data to ensure it matches the current expected structure.
 */
const sanitizeTeam = (teamData) => {
  if (!teamData) return null;

  // Clone to avoid mutation
  const sanitized = JSON.parse(JSON.stringify(teamData));

  // 1. Ensure basics
  if (!sanitized.strategies) sanitized.strategies = {};
  if (!sanitized.enemyPools) sanitized.enemyPools = {};
  if (!sanitized.members) sanitized.members = [];
  if (sanitized.region === undefined) sanitized.region = null;

  // 2. Ensure IDs and structure in all strategies
  if (sanitized.strategies && typeof sanitized.strategies === "object") {
    Object.keys(sanitized.strategies).forEach((memberName) => {
      const memberStrats = sanitized.strategies[memberName];
      if (memberStrats && typeof memberStrats === "object") {
        Object.keys(memberStrats).forEach((enemyName) => {
          memberStrats[enemyName] = ensureStepIds(memberStrats[enemyName]);
        });
      }
    });
  }

  // 3. Ensure enemyPools are always arrays
  if (sanitized.enemyPools && typeof sanitized.enemyPools === "object") {
    Object.keys(sanitized.enemyPools).forEach((key) => {
      if (!Array.isArray(sanitized.enemyPools[key])) {
        sanitized.enemyPools[key] = [];
      }
    });
  }

  return sanitized;
};

export function useTeamEditor() {
  const { id: teamId, userId: paramUserId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Determine which user ID to use (paramUserId for admin editing, or currentUser.uid)
  const targetUserId = paramUserId || currentUser?.uid;

  useEffect(() => {
    async function load() {
      if (!targetUserId) return;
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
      } catch (err) {
        console.error("[useTeamEditor] Error loading team:", err);
        showToast("Error loading team", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [targetUserId, teamId, navigate, showToast, paramUserId]);

  const saveTeam = async (updatedTeam) => {
    const teamToSave = updatedTeam || team;
    if (!teamToSave || !targetUserId) return;
    setSaving(true);

    // Sanitize before saving
    const sanitizedToSave = sanitizeTeam(teamToSave);

    try {
      // Use the service to update Firestore
      await updateUserTeam(targetUserId, teamId, {
        name: sanitizedToSave.name,
        region: sanitizedToSave.region,
        members: sanitizedToSave.members,
        strategies: sanitizedToSave.strategies,
        enemyPools: sanitizedToSave.enemyPools,
      });

      showToast("Team saved successfully!", "success");
      setTeam(sanitizedToSave);
    } catch (error) {
      console.error("[useTeamEditor] Failed to save team:", error);
      // Log validation details if it's a Zod error
      if (error.name === "ZodError") {
        console.error("Validation details:", error.errors);
      }
      showToast("Failed to save team. Data might be invalid.", "error");
    } finally {
      setSaving(false);
    }
  };

  return { team, setTeam, loading, saving, saveTeam };
}
