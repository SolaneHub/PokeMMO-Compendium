import { Check, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getTeamsByStatus,
  updateTeamStatus,
} from "@/firebase/firestoreService";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import PageTitle from "@/shared/components/PageTitle";
import { isAdmin } from "@/shared/constants/admin";
import { useAuth } from "@/shared/context/AuthContext";

const AdminTeamList = ({ status }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

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
        console.error("Error fetching teams:", err);
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
    if (!window.confirm(`${action} "${team.name}"?`)) return;

    setProcessingId(team.id);
    try {
      await updateTeamStatus(team.userId, team.id, newStatus);
      // Refresh list
      const updatedTeams = await getTeamsByStatus(status);
      setTeams(updatedTeams);
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action.toLowerCase()} team.`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        Loading {status} teams...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/50 bg-red-900/20 p-6 text-center text-red-200">
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

  if (teams.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-600 bg-slate-800/50 py-20 text-center">
        <p className="text-xl text-slate-400">No {status} teams found.</p>
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
                <div
                  key={i}
                  className="h-8 w-8 overflow-hidden rounded-full border border-slate-600 bg-slate-700"
                >
                  {m?.sprite ? (
                    <img
                      src={m.sprite}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                      ?
                    </div>
                  )}
                </div>
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
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminApprovalsPage = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    if (authLoading) return;

    if (!currentUser || !isAdmin(currentUser.email)) {
      navigate("/"); // Or a dedicated 403 page
      return;
    }
  }, [currentUser, authLoading, navigate]);

  const tabs = [
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ];

  if (authLoading) {
    return (
      <div className="p-8 text-center text-white">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="animate-fade-in container mx-auto min-h-screen p-6 text-slate-200">
      <PageTitle title="Admin Approvals" />

      <div className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-1 text-slate-400">Manage user-submitted strategies.</p>
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
