import { Plus, User } from "lucide-react";
import { useState } from "react";
import { useLoaderData, useNavigate, useRevalidator } from "react-router-dom";

import Button from "@/components/atoms/Button";
import CreateTeamModal from "@/components/organisms/CreateTeamModal";
import TeamList from "@/components/organisms/TeamList";
import PageLayout from "@/components/templates/PageLayout";
import { useConfirm } from "@/context/ConfirmationContext";
import { useToast } from "@/context/ToastContext";
import { updateTeamStatus } from "@/firebase/services/teamsService";
import { useUserTeams } from "@/hooks/useUserTeams";
import { FEATURE_CONFIG } from "@/utils/featureConfig";

import { MyTeamsLoaderData } from "./myTeamsLoader";

const MyTeamsPage = () => {
  const accentColor = FEATURE_CONFIG["my-teams"].color;
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const { teams: initialTeams, user: currentUser } =
    useLoaderData() as MyTeamsLoaderData;

  const { createTeam, deleteTeam } = useUserTeams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const confirm = useConfirm();
  const showToast = useToast();

  const handleCreateTeam = async (formData: FormData) => {
    const name = formData.get("teamName") as string;
    if (!name || !name.trim()) return;

    try {
      const teamId = await createTeam(name);
      if (teamId) {
        setShowCreateModal(false);
        navigate(`/my-teams/${teamId}`);
      }
    } catch (error) {
      showToast("Failed to create team. Please try again.", "error");
    }
  };

  const handleSubmitTeam = async (teamId: string) => {
    if (!currentUser) return;
    const confirmed = await confirm({
      message:
        "Submit this team for admin approval? You won't be able to edit it while pending.",
      title: "Submit Team",
      confirmText: "Submit",
    });
    if (confirmed) {
      try {
        await updateTeamStatus(currentUser.uid, teamId, "pending");
        revalidator.revalidate();
        showToast("Team submitted for approval!", "success");
      } catch (error) {
        showToast("Failed to submit team. Please try again.", "error");
      }
    }
  };

  const handleCancelSubmission = async (teamId: string) => {
    if (!currentUser) return;
    const confirmed = await confirm({
      message: "Cancel this team's submission? It will return to draft status.",
      title: "Cancel Submission",
      confirmText: "Yes, Cancel",
    });
    if (confirmed) {
      try {
        await updateTeamStatus(currentUser.uid, teamId, "draft");
        revalidator.revalidate();
        showToast("Team submission cancelled.", "info");
      } catch (error) {
        showToast("Failed to cancel submission. Please try again.", "error");
      }
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    const confirmed = await confirm({
      message:
        "Are you sure you want to delete this team? This action cannot be undone.",
      title: "Delete Team",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (confirmed) {
      try {
        await deleteTeam(teamId);
        revalidator.revalidate();
        showToast("Team deleted successfully.", "success");
      } catch (error) {
        showToast("Failed to delete team. Please try again.", "error");
      }
    }
  };

  return (
    <PageLayout title="My Teams" accentColor={accentColor}>
      {/* Header */}
      <div className="mb-8 flex flex-col items-center space-y-4 text-center text-white">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <User style={{ color: accentColor }} size={32} />
          My Teams
        </h1>
        <p className="max-w-2xl text-slate-400">
          Create and manage your own custom strategies for the Elite Four.
        </p>

        <Button
          onClick={() => setShowCreateModal(true)}
          variant="primary"
          size="md"
          icon={Plus}
        >
          Create New Team
        </Button>
      </div>

      {initialTeams.length === 0 ? (
        <div className="animate-fade-in flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#1a1b20] py-20 text-center text-white">
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
          teams={initialTeams}
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
          onSubmit={handleCreateTeam}
          isLoading={revalidator.state === "loading"}
        />
      )}
    </PageLayout>
  );
};

export default MyTeamsPage;
