import { Edit, Map, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createUserTeam,
  deleteUserTeam,
  getUserTeams,
} from "@/firebase/firestoreService";
import PageTitle from "@/shared/components/PageTitle";
import { useToast } from "@/shared/components/ToastNotification";
import { useAuth } from "@/shared/context/AuthContext";

const MyTeamsPage = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Team Form State
  const [newTeamName, setNewTeamName] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchTeams = useCallback(async () => {
    try {
      const userTeams = await getUserTeams(currentUser.uid);
      setTeams(userTeams);
    } catch (error) {
      console.error(error);
      showToast("Failed to load teams", "error");
    } finally {
      setLoading(false);
    }
  }, [currentUser, showToast]); // showToast is stable, currentUser from context

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate("/login");
    } else if (currentUser) {
      fetchTeams();
    }
  }, [currentUser, authLoading, navigate, fetchTeams]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    setCreating(true);
    try {
      const newTeam = {
        name: newTeamName,
        region: null, // Region is now selected in editor context
        members: Array(6).fill(null), // Empty 6 slots
        strategies: {}, // Empty strategies map
      };

      const teamId = await createUserTeam(currentUser.uid, newTeam);
      showToast("Team created successfully!", "success");
      setShowCreateModal(false);
      setNewTeamName("");
      // Navigate to editor directly or refresh list
      navigate(`/my-teams/${teamId}`);
    } catch (error) {
      console.error(error);
      showToast("Failed to create team", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTeam = async (teamId, e) => {
    e.stopPropagation(); // Prevent card click
    if (!window.confirm("Are you sure you want to delete this team?")) return;

    try {
      await deleteUserTeam(currentUser.uid, teamId);
      setTeams(teams.filter((t) => t.id !== teamId));
      showToast("Team deleted", "info");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete team", "error");
    }
  };

  if (authLoading || loading)
    return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="animate-fade-in container mx-auto p-6 text-slate-200">
      <PageTitle title="My Elite Four Teams" />

      <div className="mb-8 flex items-center justify-between border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Teams</h1>
          <p className="mt-1 text-slate-400">
            Manage your strategies for the Elite Four.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-white shadow-lg transition-all hover:bg-pink-700 hover:shadow-pink-900/20 active:scale-95"
        >
          <Plus size={20} />
          Create New Team
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-600 bg-slate-800/50 py-20 text-center">
          <p className="mb-4 text-xl text-slate-400">
            You haven&apos;t created any teams yet.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-pink-400 hover:text-pink-300 hover:underline"
          >
            Create your first team now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => navigate(`/my-teams/${team.id}`)}
              className="group cursor-pointer rounded-xl border border-slate-700 bg-slate-800 p-5 transition-all hover:-translate-y-1 hover:border-pink-500/50 hover:shadow-xl"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white transition-colors group-hover:text-pink-400">
                    {team.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-1 text-sm text-slate-400">
                    <Map size={14} />
                    <span>Universal Team</span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteTeam(team.id, e)}
                  className="rounded-full p-2 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-500"
                  title="Delete Team"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mt-4 flex gap-2 overflow-hidden rounded-lg bg-slate-900/50 p-3">
                {/* Preview of team members (simple circles or icons if available) */}
                {team.members &&
                  team.members.slice(0, 6).map((member, idx) => (
                    <div
                      key={idx}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-600 bg-slate-700"
                    >
                      {member ? (
                        // Assuming member object has an icon or sprite URL, otherwise just a dot
                        <img
                          src={
                            member.sprite ||
                            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.dexId || 0}.png`
                          }
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-xs text-slate-500">?</span>
                      )}
                    </div>
                  ))}
                {[...Array(Math.max(0, 6 - (team.members?.length || 0)))].map(
                  (_, idx) => (
                    <div
                      key={`empty-${idx}`}
                      className="h-8 w-8 rounded-full border border-dashed border-slate-700 bg-slate-800 opacity-50"
                    ></div>
                  )
                )}
              </div>

              <div className="mt-4 flex justify-end border-t border-slate-700 pt-4">
                <span className="flex items-center gap-1 text-sm font-medium text-pink-400 group-hover:underline">
                  <Edit size={14} />
                  Edit Strategies
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-2xl">
            <div className="p-6">
              <h2 className="mb-4 text-2xl font-bold text-white">
                Create New Team
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-400">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="e.g. My Kanto Farm Team"
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 p-3 text-white outline-none focus:border-transparent focus:ring-2 focus:ring-pink-500"
                    autoFocus
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg px-4 py-2 font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTeam}
                  disabled={!newTeamName.trim() || creating}
                  className="rounded-lg bg-pink-600 px-6 py-2 font-bold text-white shadow-lg transition-all hover:bg-pink-700 hover:shadow-pink-900/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Team"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTeamsPage;
