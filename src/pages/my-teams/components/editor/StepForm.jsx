import VariationForm from "./VariationForm";
import { usePokedexData } from "@/shared/hooks/usePokedexData";

const StepForm = ({ step, onChange }) => {
  // Se usePokedexData serve a caricare dati in background, va bene lasciarlo così.
  // Se doveva restituire dati (es. elenco mosse), dovresti assegnarlo: const { moves } = usePokedexData();
  usePokedexData();

  const update = (field, value) => onChange({ ...step, [field]: value });

  // Funzione per inserire i tag nella textarea quando cliccati
  const handleInsertTag = (tag) => {
    const currentText = step.player || "";
    // Aggiunge uno spazio se il testo non è vuoto e non finisce già con uno spazio
    const separator =
      currentText.length > 0 && !currentText.endsWith(" ") ? " " : "";
    update("player", currentText + separator + tag);
  };

  const instructionTags = [
    "[SWITCH]",
    "[ATTACK]",
    "[STAY]",
    "[LOCK]",
    "[BAIT]",
  ];

  return (
    <div className="mt-2 rounded-xl border border-white/5 bg-[#0f1014]/30 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Step Type Selector */}
        <label className="block space-y-1.5">
          <span className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
            Step Type
          </span>
          <select
            value={step.type || ""}
            onChange={(e) => update("type", e.target.value || undefined)}
            className="w-full appearance-none rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2.5 text-sm font-bold text-slate-100 transition-all outline-none focus:border-blue-500"
          >
            <option value="">Default (Undefined)</option>
            <option value="main">Main Strategy</option>
          </select>
        </label>

        {/* Warning Input */}
        <label className="block space-y-1.5">
          <span className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
            Optional Warning
          </span>
          <input
            type="text"
            placeholder="e.g. Danger: Speed Tie"
            value={step.warning || ""}
            onChange={(e) => update("warning", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2.5 text-sm font-bold text-red-400 transition-all outline-none placeholder:text-slate-700 focus:border-red-500"
          />
        </label>
      </div>

      {/* Instructions Textarea */}
      <div className="mt-4 block space-y-1.5">
        <span className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
          Player Instructions
        </span>
        <textarea
          rows={2}
          value={step.player || ""}
          onChange={(e) => update("player", e.target.value)}
          className="w-full resize-y rounded-xl border border-white/10 bg-[#0f1014] px-4 py-3 text-sm font-medium text-slate-200 transition-all outline-none focus:border-blue-500"
          placeholder="Use [ATTACK] Waterfall, then [SWITCH] to Blissey..."
        />

        {/* Interactive Tags */}
        <div className="flex flex-wrap gap-2 px-1">
          {instructionTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleInsertTag(tag)}
              className="cursor-pointer rounded border border-blue-400/20 bg-blue-400/5 px-1.5 py-0.5 font-mono text-[9px] font-black text-blue-400 transition-all hover:border-blue-400/40 hover:bg-blue-400/10"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Nested Variations Section */}
      <div className="mt-6 space-y-4 border-t border-white/5 pt-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black tracking-[0.2em] text-purple-400 uppercase">
            Nested Variations
          </h4>
          <button
            type="button"
            className="cursor-pointer text-[10px] font-black tracking-widest text-blue-400 uppercase transition-colors hover:text-blue-300"
            onClick={() => {
              const variations = step.variations || [];
              update("variations", [
                ...variations,
                { type: "step", name: "", steps: [] },
              ]);
            }}
          >
            + Add Variation
          </button>
        </div>

        <div className="space-y-3">
          {step.variations?.map((variation, i) => (
            <div key={i} className="animate-[fade-in_0.3s_ease-out]">
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
    </div>
  );
};

export default StepForm;
