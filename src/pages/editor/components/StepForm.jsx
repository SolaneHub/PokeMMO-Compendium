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
    <div className="border-l-[3px] border-[#00bcd4] bg-[#2a2b2e] p-2.5 px-4 mt-2.5">
      <label className="text-[#b0b0b0] text-xs font-bold mt-4 block first:mt-0">
        Type:{" "}
        <select
          value={step.type || ""}
          onChange={(e) => update("type", e.target.value)}
          className="bg-[#2c2c2c] border border-[#444] rounded text-white text-[0.95rem] px-3 py-2 w-full mt-1.5 transition-all focus:bg-[#333] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
        >
          <option value="">-- Select Type --</option>
          <option value="main">Main</option>
          <option value="step">Step</option>
          <option value="check">Check</option>
          <option value="condition">Condition</option>
        </select>
      </label>
      <label className="text-[#b0b0b0] text-xs font-bold mt-4 block">
        {actionLabel}{" "}
        <input
          type="text"
          list="action-suggestions"
          value={step.player || ""}
          onChange={(e) => update("player", e.target.value)}
          className="bg-[#2c2c2c] border border-[#444] rounded text-white text-[0.95rem] px-3 py-2 w-full mt-1.5 transition-all focus:bg-[#333] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
        />
        {/* Datalist for action suggestions */}
        <datalist id="action-suggestions">
          {combinedSuggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      </label>
      <label className="text-[#b0b0b0] text-xs font-bold mt-4 block">
        Note:{" "}
        <input
          type="text"
          value={step.warning || ""}
          onChange={(e) => update("warning", e.target.value)}
          className="bg-[#2c2c2c] border border-[#444] rounded text-white text-[0.95rem] px-3 py-2 w-full mt-1.5 transition-all focus:bg-[#333] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
        />
      </label>

      <div className="mt-5 pt-4 border-t border-[#333]">
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
              className="bg-red-600 hover:bg-red-700 text-white border-none rounded px-4 py-2.5 text-sm font-medium cursor-pointer mt-2 flex items-center justify-center gap-2 transition-all active:translate-y-[1px]"
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
          className="bg-green-600 hover:bg-green-700 text-white border-none rounded px-4 py-2.5 text-sm font-medium cursor-pointer mt-4 flex items-center justify-center gap-2 transition-all active:translate-y-[1px]"
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
