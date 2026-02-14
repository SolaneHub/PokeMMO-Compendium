import { Check, Edit, RotateCcw, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/atoms/Button";
import PokemonSpriteCircle from "@/components/atoms/PokemonSpriteCircle";
import StatusBadge from "@/components/atoms/StatusBadge";
import { useConfirm } from "@/context/ConfirmationContext";
import { useToast } from "@/context/ToastContext";
import {
  deleteUserTeam,
  getAllUserTeams,
  getTeamsByStatus,
  Team,
  TeamStatus,
  updateTeamStatus,
} from "@/firebase/firestoreService";

interface AdminTeamListProps {
  status: TeamStatus | "all";
}

const AdminTeamList = ({ status }: AdminTeamListProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const confirm = useConfirm();
  const showToast = useToast();
  const [retryTrigger, setRetryTrigger] = useState(0);
  const navigate = useNavigate();

  const fetchAllTeams = useCallback(async () => {
    let allTeams: Team[] = [];
    let nextPageToken: { userId: string; teamId: string } | null = null;
    do {
      const result: {
        teams: Team[];
        nextPageToken: { userId: string; teamId: string } | null;
      } =
        status === "all"
          ? await getAllUserTeams({
              limit: 100,
              startAfter: nextPageToken || undefined,
            })
          : await getTeamsByStatus(status as TeamStatus, {
              limit: 100,
              startAfter: nextPageToken || undefined,
            });
      allTeams = allTeams.concat(result.teams);
      nextPageToken = result.nextPageToken;
    } while (nextPageToken);
    return allTeams;
  }, [status]);

  useEffect(() => {
    let mounted = true;
    const fetchTeams = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAllTeams();
        if (mounted) {
          setTeams(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    fetchTeams();
    return () => {
      mounted = false;
    };
  }, [fetchAllTeams, retryTrigger]);

  const handleStatusChange = async (team: Team, newStatus: TeamStatus) => {
    if (!team.id || !team.userId) return;

    const action =
      newStatus === "approved"
        ? "Approve"
        : newStatus === "rejected"
          ? "Reject"
          : "Reset to Pending";

    const confirmed = await confirm({
      message: `${action} "${team.name}"?`,
      title: `${action} Confirmation`,
      confirmText: action,
      cancelText: "Cancel",
    });
    if (!confirmed) return;

    setProcessingId(team.id);
    try {
      await updateTeamStatus(team.userId, team.id, newStatus);
      const updatedData = await fetchAllTeams();
      setTeams(updatedData);
      showToast(
        `Team "${team.name}" ${action.toLowerCase()}ed successfully.`,
        "success"
      );
    } catch (err) {
      showToast(`Failed to ${action.toLowerCase()} team.`, "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteTeam = async (team: Team) => {
    if (!team.id || !team.userId) return;

    const confirmed = await confirm({
      message: `Are you sure you want to delete "${team.name}"? This action cannot be undone.`,
      title: "Delete Confirmation",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!confirmed) return;

    setProcessingId(team.id);
    try {
      await deleteUserTeam(team.userId, team.id);
      const updatedData = await fetchAllTeams();
      setTeams(updatedData);
      showToast(`Team "${team.name}" deleted successfully.`, "success");
    } catch (err) {
      showToast(`Failed to delete team.`, "error");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in py-20 text-center text-white">
        Loading {status} teams...
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in rounded-xl border border-red-500/50 bg-red-900/20 p-6 text-center text-red-200">
        <h3 className="mb-2 text-lg font-bold">Error loading teams</h3>
        <p className="text-sm opacity-80">{error.message}</p>
        <button
          onClick={() => setRetryTrigger((prev) => prev + 1)}
          className="mt-4 rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <div
          key={team.id}
          className="relative flex flex-col rounded-xl border border-slate-700 bg-slate-800 p-4 text-white shadow-lg transition-transform hover:-translate-y-1"
        >
          <div className="mb-4 flex-1">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-bold">{team.name}</h3>
              <div className="flex items-center gap-2">
                <StatusBadge status={team.status || "draft"} />
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() =>
                    navigate(`/admin/edit-team/${team.userId}/${team.id}`)
                  }
                  className="bg-blue-600/20 text-blue-400 hover:bg-blue-600"
                  icon={Edit}
                >
                  {""}
                </Button>
              </div>
            </div>
            <p className="text-xs text-slate-500">By User ID: {team.userId}</p>
            {Array.isArray(team.members) && team.members.length > 0 && (
              <div className="mt-3 flex gap-2">
                {team.members.slice(0, 6).map((m, i) => (
                  <PokemonSpriteCircle
                    key={i}
                    spriteUrl={m?.sprite}
                    pokemonName={m?.name}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-2 border-t border-slate-700 pt-4">
            {(status === "pending" ||
              (status === "all" && team.status === "pending")) && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleStatusChange(team, "approved")}
                  disabled={!!processingId}
                  className="flex-1 bg-green-600 hover:bg-green-500"
                  icon={Check}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleStatusChange(team, "rejected")}
                  disabled={!!processingId}
                  className="flex-1"
                  icon={X}
                >
                  Reject
                </Button>
              </>
            )}
            {(status === "approved" ||
              (status === "all" && team.status === "approved")) && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleStatusChange(team, "rejected")}
                disabled={!!processingId}
                className="flex-1"
                icon={X}
              >
                Revoke Approval
              </Button>
            )}
            {(status === "rejected" ||
              (status === "all" && team.status === "rejected")) && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleStatusChange(team, "pending")}
                disabled={!!processingId}
                className="flex-1"
                icon={RotateCcw}
              >
                Move to Pending
              </Button>
            )}
            {status === "all" && (!team.status || team.status === "draft") && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleStatusChange(team, "pending")}
                disabled={!!processingId}
                className="flex-1"
                icon={Check}
              >
                Publish
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDeleteTeam(team)}
              disabled={!!processingId}
              className="px-3"
              icon={Trash2}
            >
              {""}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminTeamList;
