import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import PlayerBuildCard from "@/components/molecules/PlayerBuildCard";
import { Pokemon } from "@/types/pokemon";

interface Build {
  name: string;
  item?: string;
  ability?: string;
  nature?: string;
  evs?: string;
  ivs?: string;
  moves?: string[];
  player?: string;
  variants?: Build[];
}

interface TeamBuildModalProps {
  onClose: () => void;
  teamName: string;
  builds: Build[];
  pokemonMap: Map<string, Pokemon>;
}

const TeamBuildModal = ({
  onClose,
  teamName,
  builds,
  pokemonMap,
}: TeamBuildModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  if (!builds || builds.length === 0) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={onClose}
      className="fixed inset-0 z-100 m-0 flex h-full max-h-none w-full max-w-none items-center justify-center border-none bg-transparent p-0"
    >
      <button
        type="button"
        className="fixed inset-0 h-full w-full animate-[fade-in_0.2s_ease-out] border-none bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close backdrop"
      />
      <div className="relative z-10 flex max-h-[85vh] w-180 max-w-[95vw] animate-[scale-in_0.3s_ease-out] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a1b20] shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-black/20 p-4 text-white">
          <div>
            <h2 className="text-xl font-bold">{teamName} Build</h2>
            <p className="text-xs tracking-widest text-slate-500 uppercase">
              Team Overview
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/5 p-2 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {builds.map((build, idx) => (
              <PlayerBuildCard
                key={`${build.name}-${idx}`}
                build={build}
                pokemonMap={pokemonMap}
              />
            ))}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default TeamBuildModal;
