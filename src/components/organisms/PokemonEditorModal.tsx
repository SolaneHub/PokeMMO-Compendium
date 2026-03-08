import { Save, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import Button from "@/components/atoms/Button";
import { useMoves } from "@/context/MovesContext";
import { usePokedexData } from "@/hooks/usePokedexData";
import { TeamMember } from "@/types/teams";

interface PokemonEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: TeamMember) => void;
  initialData?: TeamMember | null;
}

const DEFAULT_FORM_DATA: TeamMember = {
  name: "",
  item: "",
  ability: "",
  nature: "",
  evs: "",
  ivs: "",
  moves: ["", "", "", ""],
};

const PokemonEditorModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}: PokemonEditorModalProps) => {
  const { allPokemonData } = usePokedexData();
  const { allMoves } = useMoves();
  const dialogRef = useRef<HTMLDialogElement>(null);

  // ✅ React Best Practice: Use lazy state initialization.
  // To reset this form when initialData changes, the parent should use the 'key' prop.
  // Example: <PokemonEditorModal key={initialData?.id || 'new'} ... />
  const [formData, setFormData] = useState<TeamMember>(() => {
    if (initialData) {
      return {
        ...initialData,
        moves: initialData.moves || ["", "", "", ""],
      };
    }
    return DEFAULT_FORM_DATA;
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen) {
      if (dialog && !dialog.open) {
        dialog.showModal();
      }
    } else {
      dialog?.close();
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMoveChange = (index: number, value: string) => {
    const newMoves = [...(formData.moves || ["", "", "", ""])];
    newMoves[index] = value;
    setFormData((prev) => ({ ...prev, moves: newMoves }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

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
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl animate-[scale-in_0.3s_ease-out] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a1b20] text-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-black/20 p-6">
          <div>
            <h2 className="text-2xl font-bold">
              {initialData ? "Edit Pokémon" : "Add Pokémon"}
            </h2>
            <p className="text-xs tracking-widest text-slate-500 uppercase">
              Member Details
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full bg-white/5 p-2 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left Column: Basic Info */}
            <div className="space-y-4">
              <div className="group">
                <label
                  htmlFor="pokemon-name-select"
                  className="mb-1 block text-sm font-medium"
                >
                  Pokémon Name
                </label>
                <div className="relative">
                  <input
                    id="pokemon-name-select"
                    list="pokemon-list"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-white/5 bg-[#0f1014] py-2.5 pr-4 pl-10 text-white transition-all focus:border-blue-500 focus:outline-none"
                    placeholder="Search Pokémon..."
                  />
                  <Search
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                </div>
                <datalist id="pokemon-list">
                  {allPokemonData.map((p) => (
                    <option key={p.id} value={p.name} />
                  ))}
                </datalist>
              </div>

              <div className="group">
                <label
                  htmlFor="item-select"
                  className="mb-1 block text-sm font-medium"
                >
                  Held Item
                </label>
                <input
                  id="item-select"
                  type="text"
                  name="item"
                  value={formData.item}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-white/5 bg-[#0f1014] px-4 py-2.5 text-white transition-all focus:border-blue-500 focus:outline-none"
                  placeholder="None"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label
                    htmlFor="ability-input"
                    className="mb-1 block text-sm font-medium"
                  >
                    Ability
                  </label>
                  <input
                    id="ability-input"
                    type="text"
                    name="ability"
                    value={formData.ability}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-white/5 bg-[#0f1014] px-4 py-2.5 text-white transition-all focus:border-blue-500 focus:outline-none"
                    placeholder="Standard"
                  />
                </div>
                <div className="group">
                  <label
                    htmlFor="nature-input"
                    className="mb-1 block text-sm font-medium"
                  >
                    Nature
                  </label>
                  <input
                    id="nature-input"
                    type="text"
                    name="nature"
                    value={formData.nature}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-white/5 bg-[#0f1014] px-4 py-2.5 text-white transition-all focus:border-blue-500 focus:outline-none"
                    placeholder="Serious"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label
                    htmlFor="evs-input"
                    className="mb-1 block text-sm font-medium"
                  >
                    EVs
                  </label>
                  <input
                    id="evs-input"
                    type="text"
                    name="evs"
                    value={formData.evs}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-white/5 bg-[#0f1014] px-4 py-2.5 text-white transition-all focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. 252 Atk / 252 Spe"
                  />
                </div>
                <div className="group">
                  <label
                    htmlFor="ivs-input"
                    className="mb-1 block text-sm font-medium"
                  >
                    IVs
                  </label>
                  <input
                    id="ivs-input"
                    type="text"
                    name="ivs"
                    value={formData.ivs}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-white/5 bg-[#0f1014] px-4 py-2.5 text-white transition-all focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. 31/31/31/x/31/31"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Moves */}
            <div className="space-y-4">
              <label
                htmlFor="move-input-0"
                className="mb-1 block text-sm font-medium"
              >
                Moveset
              </label>
              <div className="grid grid-cols-1 gap-3">
                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx} className="relative">
                    <input
                      id={`move-input-${idx}`}
                      list="moves-list"
                      value={formData.moves?.[idx] || ""}
                      onChange={(e) => handleMoveChange(idx, e.target.value)}
                      className="w-full rounded-lg border border-white/5 bg-[#0f1014] px-4 py-2.5 text-sm text-white transition-all focus:border-blue-500 focus:outline-none"
                      placeholder={`Move ${idx + 1}`}
                    />
                  </div>
                ))}
                <datalist id="moves-list">
                  {allMoves.map((m) => (
                    <option key={m.id} value={m.name} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-white/5 bg-black/20 p-6">
          <Button onClick={handleSave} variant="primary" size="md" icon={Save}>
            Save Pokémon
          </Button>
        </div>
      </div>
    </dialog>
  );
};

export default PokemonEditorModal;
