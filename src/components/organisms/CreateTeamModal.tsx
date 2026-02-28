import { useActionState, useEffect } from "react";

import Button from "@/components/atoms/Button";

interface ActionResult {
  success?: boolean;
  error?: string;
}

interface CreateTeamModalProps {
  onClose: () => void;
  onSubmit: (
    prevState: ActionResult | null,
    formData: FormData
  ) => Promise<ActionResult>;
}

const CreateTeamModal = ({ onClose, onSubmit }: CreateTeamModalProps) => {
  const [state, formAction] = useActionState(onSubmit, null);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="animate-fade-in w-full max-w-md overflow-hidden rounded-xl border border-white/5 bg-[#1a1b20] text-white shadow-2xl">
        <div className="p-6">
          <h2 className="mb-4 text-2xl font-bold"> Create New Team </h2>
          <form action={formAction}>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Team Name
                </label>
                <input
                  name="teamName"
                  type="text"
                  placeholder="e.g. My Kanto Farm Team"
                  className="w-full rounded-lg border border-white/10 bg-[#0f1014] p-3 text-white transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  autoFocus
                  required
                />
              </div>
              {state?.error && (
                <p className="text-sm text-red-500">{state.error}</p>
              )}
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <Button variant="ghost" size="md" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Create Team
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;
