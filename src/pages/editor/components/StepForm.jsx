import VariationForm from "@/pages/editor/components/VariationForm";
import { usePokedexData } from "@/shared/hooks/usePokedexData";

const StepForm = ({ step, onChange }) => {
  const { pokemonNames, moveNames, itemNames } = usePokedexData();
  const update = (field, value) => onChange({ ...step, [field]: value });

  const combinedSuggestions = [
    ...new Set([...pokemonNames, ...moveNames, ...itemNames]),
  ].sort();

  const isConditionStep = step.type === "check" || step.type === "condition";
  const actionLabel = isConditionStep ? "Condition:" : "Action:";

  return (
    <div className="mt-2.5 border-l-[3px] border-[#00bcd4] bg-[#2a2b2e] p-2.5 px-4">
      <label className="mt-4 block text-xs font-bold text-[#b0b0b0] first:mt-0">
        Type:{" "}
        <select
          value={step.type || ""}
          onChange={(e) => update("type", e.target.value)}
          className="mt-1.5 w-full rounded border border-[#444] bg-[#2c2c2c] px-3 py-2 text-[0.95rem] text-white transition-all focus:border-blue-500 focus:bg-[#333] focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
        >
          <option value="">-- Select Type --</option>
          <option value="main">Main</option>
          <option value="step">Step</option>
          <option value="check">Check</option>
          <option value="condition">Condition</option>
        </select>
      </label>
      <label className="mt-4 block text-xs font-bold text-[#b0b0b0]">
        {actionLabel}{" "}
        <input
          type="text"
          list="action-suggestions"
          value={step.player || ""}
          onChange={(e) => update("player", e.target.value)}
          className="mt-1.5 w-full rounded border border-[#444] bg-[#2c2c2c] px-3 py-2 text-[0.95rem] text-white transition-all focus:border-blue-500 focus:bg-[#333] focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
        />
        {/* Datalist for action suggestions */}
        <datalist id="action-suggestions">
          {combinedSuggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      </label>
      <label className="mt-4 block text-xs font-bold text-[#b0b0b0]">
        Note:{" "}
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
