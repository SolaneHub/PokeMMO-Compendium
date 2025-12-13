import { useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-blue-600 px-6 py-2 font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-900/30 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Creating..." : "Create Team"}
    </button>
  );
};

const CreateTeamModal = ({ onClose, action }) => {
  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="animate-fade-in w-full max-w-md overflow-hidden rounded-xl border border-white/5 bg-[#1a1b20] shadow-2xl">
        <div className="p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Create New Team
          </h2>

          <form action={action}>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-400">
                  Team Name
                </label>
                <input
                  name="teamName"
                  type="text"
                  placeholder="e.g. My Kanto Farm Team"
                  className="w-full rounded-lg border border-white/10 bg-[#1e2025] p-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreateTeamModal;
