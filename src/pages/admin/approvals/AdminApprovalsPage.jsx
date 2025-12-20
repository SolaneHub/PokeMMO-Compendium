import { Check, CheckCircle, RotateCcw, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  deleteUserTeam,
  getTeamsByStatus,
  updateTeamStatus,
} from "@/firebase/firestoreService";
import { useConfirm } from "@/shared/components/ConfirmationModal"; // Import useConfirm
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import PageTitle from "@/shared/components/PageTitle";
import PokemonSpriteCircle from "@/shared/components/PokemonSpriteCircle"; // Import the new component
import { useAuth } from "@/shared/context/AuthContext";
import { useAdminCheck } from "@/shared/hooks/useAdminCheck";

const AdminTeamList = ({ status }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const confirm = useConfirm(); // Initialize useConfirm

  useEffect(() => {
    let mounted = true;

    const fetchTeams = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTeamsByStatus(status);
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
  }, [status]);

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
      // Refresh list
      const updatedTeams = await getTeamsByStatus(status);
      setTeams(updatedTeams);
    } catch (err) {
      alert(`Failed to ${action.toLowerCase()} team.`);
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
      // Refresh list
      const updatedTeams = await getTeamsByStatus(status);
      setTeams(updatedTeams);
    } catch (err) {
      alert("Failed to delete team.");
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
          onClick={() => window.location.reload()}
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
            </div>
            <p className="text-xs text-slate-500">By User ID: {team.userId}</p>
            <div className="mt-3 flex gap-2">
              {team.members?.slice(0, 6).map((m, i) => (
                <PokemonSpriteCircle
                  key={i}
                  spriteUrl={m?.sprite}
                  pokemonName={m?.name}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2 border-t border-slate-700 pt-4">
            {status === "pending" && (
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

            {status === "approved" && (
              <button
                onClick={() => handleStatusChange(team, "rejected")}
                disabled={!!processingId}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                <X size={16} /> Revoke Approval
              </button>
            )}

            {status === "rejected" && (
              <button
                onClick={() => handleStatusChange(team, "pending")}
                disabled={!!processingId}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-600 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
              >
                <RotateCcw size={16} /> Move to Pending
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

const AdminApprovalsPage = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    if (authLoading || adminLoading) return;

    if (!currentUser || !isAdmin) {
      navigate("/"); // Or a dedicated 403 page
      return;
    }
  }, [currentUser, authLoading, isAdmin, adminLoading, navigate]);

  const tabs = [
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ];

  if (authLoading || adminLoading) {
    return (
      <div className="p-8 text-center text-white">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="animate-fade-in container mx-auto min-h-screen text-slate-200">
      <PageTitle title="Admin Approvals" />

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
        <AdminTeamList status={activeTab} />
      </ErrorBoundary>
    </div>
  );
};

export default AdminApprovalsPage;
