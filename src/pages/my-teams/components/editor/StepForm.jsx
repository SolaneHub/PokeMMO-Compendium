import { AlertTriangle, GitBranch, X } from "lucide-react";
import { useState } from "react";

import { usePokedexData } from "@/shared/hooks/usePokedexData";

import VariationForm from "./VariationForm";

const instructionTags = ["[SWITCH]", "[ATTACK]", "[STAY]", "[LOCK]", "[BAIT]"];

const StepForm = ({ step, onChange }) => {
  usePokedexData();
  const [showWarning, setShowWarning] = useState(!!step.warning);
  const [showAdvanced, setShowAdvanced] = useState(
    step.variations && step.variations.length > 0
  );

  const update = (field, value) => onChange({ ...step, [field]: value });

  const handleInsertTag = (tag) => {
    const currentText = step.player || "";
    const separator =
      currentText.length > 0 && !currentText.endsWith(" ") ? " " : "";
    update("player", currentText + separator + tag);
  };

  return (
    <div className="mt-2 space-y-4">
      {/* Main Instructions Area */}
      <div className="relative">
        <textarea
          rows={3}
          value={step.player || ""}
          onChange={(e) => update("player", e.target.value)}
          className="w-full resize-y rounded-xl border border-white/10 bg-[#0f1014] px-4 py-3 text-sm font-medium text-slate-200 transition-all outline-none focus:border-blue-500 focus:bg-[#0f1014]/50"
          placeholder="Describe your move... (e.g., Use Ice Beam, then switch to Chansey)"
        />

        {/* Quick Actions Bar */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {instructionTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleInsertTag(tag)}
                className="cursor-pointer rounded border border-blue-400/20 bg-blue-400/5 px-1.5 py-0.5 font-mono text-[9px] font-bold text-blue-400 transition-all hover:border-blue-400/40 hover:bg-blue-400/10"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-2">
            {!showWarning && (
              <button
                type="button"
                onClick={() => setShowWarning(true)}
                className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-[10px] font-bold text-slate-500 uppercase hover:bg-white/5 hover:text-red-400"
              >
                <AlertTriangle size={12} />
                Add Warning
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-[10px] font-bold uppercase transition-colors ${
                showAdvanced
                  ? "bg-purple-500/10 text-purple-400"
                  : "text-slate-500 hover:bg-white/5 hover:text-purple-400"
              }`}
            >
              <GitBranch size={12} />
              {showAdvanced ? "Hide Advanced" : "Branching"}
            </button>
          </div>
        </div>
      </div>

      {/* Optional Warning Field */}
      {showWarning && (
        <div className="animate-fade-in flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-2">
          <AlertTriangle size={16} className="text-red-400" />
          <input
            type="text"
            placeholder="Warning note (e.g. Critical Hit risk)"
            value={step.warning || ""}
            onChange={(e) => update("warning", e.target.value || undefined)}
            className="w-full bg-transparent text-sm font-medium text-red-200 placeholder:text-red-400/50 focus:outline-none"
            autoFocus
          />
          <button
            type="button"
            onClick={() => {
              update("warning", undefined);
              setShowWarning(false);
            }}
            className="text-red-400 hover:text-red-300"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Advanced / Variations Section */}
      {showAdvanced && (
        <div className="animate-fade-in rounded-xl border border-dashed border-purple-500/20 bg-purple-500/5 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-purple-400 uppercase">
              <GitBranch size={12} />
              Branching Scenarios
            </h4>
            <button
              type="button"
              className="cursor-pointer rounded bg-purple-500/10 px-2 py-1 text-[10px] font-bold text-purple-400 hover:bg-purple-500/20"
              onClick={() => {
                const variations = step.variations || [];
                update("variations", [
                  ...variations,
                  {
                    id: crypto.randomUUID(),
                    type: "step",
                    name: "",
                    steps: [],
                  },
                ]);
              }}
            >
              + Add Branch
            </button>
          </div>

          <div className="space-y-4">
            {step.variations?.length === 0 && (
              <p className="py-2 text-center text-xs text-slate-500 italic">
                No branches added yet. Use this for "If X happens, do Y".
              </p>
            )}
            {step.variations?.map((variation, i) => (
              <div
                key={variation.id || `variation-${i}`}
                className="relative pl-3"
              >
                <div className="absolute top-0 bottom-0 left-0 w-px bg-purple-500/20" />
                <VariationForm
                  variation={variation}
                  onChange={(upd) => {
                    const nv = [...(step.variations || [])];
                    nv[i] = upd;
                    update("variations", nv);
                  }}
                  onRemove={() => {
                    update(
                      "variations",
                      step.variations.filter((_, idx) => idx !== i)
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepForm;
