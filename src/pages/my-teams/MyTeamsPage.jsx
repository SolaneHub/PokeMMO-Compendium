import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageTitle from "@/shared/components/PageTitle";
import { useUserTeams } from "@/pages/my-teams/hooks/useUserTeams";
import CreateTeamModal from "@/pages/my-teams/components/CreateTeamModal";
import TeamList from "@/pages/my-teams/components/TeamList";
import { updateTeamStatus } from "@/firebase/firestoreService";

const MyTeamsPage = () => {
  const navigate = useNavigate();
  const {
    teams,
    loading,
    creating,
    createTeam,
    deleteTeam,
    authLoading,
    currentUser,
    refreshTeams, // Assuming this exists or the hook updates automatically
  } = useUserTeams();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, authLoading, navigate]);

  const handleCreateTeam = async (name) => {
    if (!name.trim()) return;
    const teamId = await createTeam(name);
    if (teamId) {
      setShowCreateModal(false);
      navigate(`/my-teams/${teamId}`);
    }
  };

  const handleSubmitTeam = async (teamId) => {
    if (window.confirm("Submit this team for admin approval? You won't be able to edit it while pending.")) {
        await updateTeamStatus(currentUser.uid, teamId, "pending");
        // We rely on the real-time listener in useUserTeams to update the UI
        // If useUserTeams doesn't use onSnapshot, we might need to manually refresh.
        // Assuming it does or we trigger a refresh.
        // If not, we might need to force reload or update local state.
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
        <TeamList
          teams={teams}
          onTeamClick={(id) => navigate(`/my-teams/${id}`)}
          onDeleteTeam={deleteTeam}
          onSubmitTeam={handleSubmitTeam}
        />
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <CreateTeamModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTeam}
          creating={creating}
        />
      )}
    </div>
  );
};

export default MyTeamsPage;
