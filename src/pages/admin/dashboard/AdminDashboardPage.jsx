import {
  Check,
  CheckCircle,
  Database,
  Edit,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  deleteUserTeam,
  getAllUserTeams,
  getTeamsByStatus,
  updateTeamStatus,
} from "@/firebase/firestoreService";
import { useConfirm } from "@/shared/components/ConfirmationModal";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import PageTitle from "@/shared/components/PageTitle";
import PokemonSpriteCircle from "@/shared/components/PokemonSpriteCircle";
import { useToast } from "@/shared/components/ToastNotification";
import { useAuth } from "@/shared/context/AuthContext";

const AdminTeamList = ({ status }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const confirm = useConfirm();
  const showToast = useToast();
  const [retryTrigger, setRetryTrigger] = useState(0);
  const navigate = useNavigate();

  const fetchAllTeams = useCallback(async () => {
    let allTeams = [];
    let nextPageToken = null;
    do {
      const result =
        status === "all"
          ? await getAllUserTeams({ limit: 100, startAfter: nextPageToken })
          : await getTeamsByStatus(status, {
              limit: 100,
              startAfter: nextPageToken,
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
          setError(err);
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

  const handleStatusChange = async (team, newStatus) => {
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

  const handleDeleteTeam = async (team) => {
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
      <div className="animate-fade-in py-20 text-center text-slate-400">
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
          className="mt-4 rounded bg-red-600 px-4 py-2 text-sm font-bold hover:bg-red-700"
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
          className="relative flex flex-col rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-lg transition-transform hover:-translate-y-1"
        >
          <div className="mb-4 flex-1">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{team.name}</h3>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-2 py-0.5 text-xs font-bold uppercase ${
                    team.status === "approved"
                      ? "bg-green-500/20 text-green-400"
                      : team.status === "rejected"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {team.status || "draft"}
                </span>
                <button
                  onClick={() =>
                    navigate(`/admin/edit-team/${team.userId}/${team.id}`)
                  }
                  className="rounded bg-blue-600 p-1.5 text-white transition-colors hover:bg-blue-700"
                  title="Edit Team"
                >
                  <Edit size={14} />
                </button>
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
                <button
                  onClick={() => handleStatusChange(team, "approved")}
                  disabled={!!processingId}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-2 text-sm font-bold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                >
                  <Check size={16} /> Approve
                </button>
                <button
                  onClick={() => handleStatusChange(team, "rejected")}
                  disabled={!!processingId}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  <X size={16} /> Reject
                </button>
              </>
            )}

            {(status === "approved" ||
              (status === "all" && team.status === "approved")) && (
              <button
                onClick={() => handleStatusChange(team, "rejected")}
                disabled={!!processingId}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                <X size={16} /> Revoke Approval
              </button>
            )}

            {(status === "rejected" ||
              (status === "all" && team.status === "rejected")) && (
              <button
                onClick={() => handleStatusChange(team, "pending")}
                disabled={!!processingId}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-600 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
              >
                <RotateCcw size={16} /> Move to Pending
              </button>
            )}

            {status === "all" && (!team.status || team.status === "draft") && (
              <button
                onClick={() => handleStatusChange(team, "pending")}
                disabled={!!processingId}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                <Check size={16} /> Publish
              </button>
            )}

            <button
              onClick={() => handleDeleteTeam(team)}
              disabled={!!processingId}
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
              title="Delete Team"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminDashboardPage = () => {
  const { loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All Teams" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
    { id: "system", label: "System" },
  ];

  if (authLoading) {
    return <div className="p-8 text-center text-white">Loading...</div>;
  }

  return (
    <div className="animate-fade-in container mx-auto min-h-screen text-slate-200">
      <PageTitle title="Admin Dashboard" />
      <div className="mb-8 flex flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <CheckCircle className="text-blue-400" size={32} />
          Admin Dashboard
        </h1>
        <p className="text-slate-400">Manage user-submitted strategies.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-4 border-b border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-bold transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ErrorBoundary>
        {activeTab === "system" ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3 text-blue-400">
                <Database size={24} />
                <h3 className="text-xl font-bold text-white">System Tools</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-slate-700/50 p-4">
                  <div>
                    <h4 className="font-bold text-white">Pokedex Editor</h4>
                    <p className="text-sm text-slate-400">
                      Manage Pokemon data
                    </p>
                  </div>
                  <Link
                    to="/admin/pokedex-editor"
                    className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
                  >
                    Open
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <AdminTeamList status={activeTab} />
        )}
      </ErrorBoundary>
    </div>
  );
};

export default AdminDashboardPage;
