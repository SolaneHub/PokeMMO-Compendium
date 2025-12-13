import { Plus, User } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { updateTeamStatus } from "@/firebase/firestoreService";
import CreateTeamModal from "@/pages/my-teams/components/CreateTeamModal";
import TeamList from "@/pages/my-teams/components/TeamList";
import { useUserTeams } from "@/pages/my-teams/hooks/useUserTeams";
import { useConfirm } from "@/shared/components/ConfirmationModal"; // Import useConfirm
import PageTitle from "@/shared/components/PageTitle";
import { useToast } from "@/shared/components/ToastNotification"; // Import useToast

const MyTeamsPage = () => {
  const navigate = useNavigate();
  const {
    teams,
    loading,
    createTeam,
    deleteTeam,
    authLoading,
    currentUser,
    refreshTeams,
  } = useUserTeams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const confirm = useConfirm();
  const showToast = useToast(); // Initialize useToast

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, authLoading, navigate]);

  const createTeamAction = async (prevState, formData) => {
    const name = formData.get("teamName");
    if (!name || !name.trim()) return;

    const teamId = await createTeam(name);
    if (teamId) {
      setShowCreateModal(false);
      navigate(`/my-teams/${teamId}`);
    }
  };

  const [, submitAction] = useActionState(createTeamAction, null);

  const handleSubmitTeam = async (teamId) => {
    const confirmed = await confirm(
      "Submit this team for admin approval? You won't be able to edit it while pending.",
      "Submit Team"
    );
    if (confirmed) {
      try {
        await updateTeamStatus(currentUser.uid, teamId, "pending");
        await refreshTeams(); // Explicitly refresh teams
        showToast("Team submitted for approval!", "success");
      } catch (error) {
        console.error("Error submitting team:", error);
        showToast("Failed to submit team. Please try again.", "error");
      }
    }
  };

  const handleCancelSubmission = async (teamId) => {
    const confirmed = await confirm(
      "Cancel this team's submission? It will return to draft status.",
      "Cancel Submission"
    );
    if (confirmed) {
      try {
        await updateTeamStatus(currentUser.uid, teamId, "draft");
        await refreshTeams(); // Explicitly refresh teams
        showToast("Team submission cancelled.", "info");
      } catch (error) {
        console.error("Error cancelling submission:", error);
        showToast("Failed to cancel submission. Please try again.", "error");
      }
    }
  };

  const handleDeleteTeam = async (teamId) => {
    const confirmed = await confirm(
      "Are you sure you want to delete this team? This action cannot be undone.",
      "Delete Team"
    );
    if (confirmed) {
      await deleteTeam(teamId);
    }
  };

  if (authLoading || loading)
    return (
      <div className="animate-fade-in p-8 text-center text-slate-400">
        Loading...
      </div>
    );

  return (
    <div className="animate-fade-in mx-auto max-w-7xl space-y-8 pb-24">
      <PageTitle title="My Elite Four Teams" />

      {/* Header */}
      <div className="mb-8 flex flex-col items-center space-y-4 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <User className="text-blue-500" size={32} />
          My Teams
        </h1>
        <p className="max-w-2xl text-slate-400">
          Create and manage your own custom strategies for the Elite Four.
        </p>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-900/40 active:scale-95"
        >
          <Plus size={20} />
          Create New Team
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="animate-fade-in flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#1a1b20] py-20 text-center">
          <p className="mb-4 text-xl text-slate-400">
            You haven&apos;t created any teams yet.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            Create your first team now
          </button>
        </div>
      ) : (
        <TeamList
          teams={teams}
          onTeamClick={(id) => navigate(`/my-teams/${id}`)}
          onDeleteTeam={handleDeleteTeam}
          onSubmitTeam={handleSubmitTeam}
          onCancelSubmission={handleCancelSubmission}
        />
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <CreateTeamModal
          onClose={() => setShowCreateModal(false)}
          action={submitAction}
        />
      )}
    </div>
  );
};

export default MyTeamsPage;
