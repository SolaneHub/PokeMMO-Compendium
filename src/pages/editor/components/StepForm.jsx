import VariationForm from "@/pages/editor/components/VariationForm";
import { usePokedexData } from "@/shared/hooks/usePokedexData";

const StepForm = ({ step, onChange }) => {
  usePokedexData();
  const update = (field, value) => onChange({ ...step, [field]: value });

  return (
    <div className="mt-2.5 border-l-[3px] border-[#00bcd4] bg-[#2a2b2e] p-2.5 px-4">
      <label className="mt-4 block text-xs font-bold text-[#b0b0b0] first:mt-0">
        Type:{" "}
        <select
          value={step.type || ""}
          onChange={(e) => update("type", e.target.value || undefined)}
          className="mt-1.5 w-full rounded border border-[#444] bg-[#2c2c2c] px-3 py-2 text-[0.95rem] text-white transition-all focus:border-blue-500 focus:bg-[#333] focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
        >
          <option value="">Default (Undefined)</option>
          <option value="main">Main</option>
        </select>
      </label>
      <label className="mt-4 block text-xs font-bold text-[#b0b0b0]">
        Player Action:{" "}
        <input
          type="text"
          value={step.player || ""}
          onChange={(e) => update("player", e.target.value)}
          className="mt-1.5 w-full rounded border border-[#444] bg-[#2c2c2c] px-3 py-2 text-[0.95rem] text-white transition-all focus:border-blue-500 focus:bg-[#333] focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
        />
        <p className="mt-1 text-xs text-slate-500">
          Use icons: <span className="font-mono text-pink-400">[SWITCH]</span>,{" "}
          <span className="font-mono text-pink-400">[ATTACK]</span>,{" "}
          <span className="font-mono text-pink-400">[STAY]</span>,{" "}
          <span className="font-mono text-pink-400">[LOCK]</span>,{" "}
          <span className="font-mono text-pink-400">[BAIT]</span>
        </p>
      </label>
      <label className="mt-4 block text-xs font-bold text-[#b0b0b0]">
        Warning (Optional):{" "}
        <input
          type="text"
          value={step.warning || ""}
          onChange={(e) => update("warning", e.target.value)}
          className="mt-1.5 w-full rounded border border-[#444] bg-[#2c2c2c] px-3 py-2 text-[0.95rem] text-white transition-all focus:border-blue-500 focus:bg-[#333] focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
        />
      </label>

      <div className="mt-5 border-t border-[#333] pt-4">
        <h4 className="mb-2.5 font-semibold text-white">Variations</h4>
        {step.variations?.map((variation, i) => (
          <div key={i}>
            <VariationForm
              variation={variation}
              onChange={(upd) => {
                const newVars = [...step.variations];
                newVars[i] = upd;
                update("variations", newVars);
              }}
            />
            <button
              className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded border-none bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-red-700 active:translate-y-[1px]"
              onClick={() =>
                update(
                  "variations",
                  step.variations.filter((_, idx) => idx !== i)
                )
              }
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded border-none bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-green-700 active:translate-y-[1px]"
          onClick={() =>
            update("variations", [
              ...(step.variations || []),
              { type: "", name: "", steps: [] },
            ])
          }
        >
          + Variation
        </button>
      </div>
    </div>
  );
};
export default StepForm;
