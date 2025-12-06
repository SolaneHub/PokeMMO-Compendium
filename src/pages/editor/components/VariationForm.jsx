import StepForm from "@/pages/editor/components/StepForm";

const VariationForm = ({ variation, onChange }) => {
  const handleFieldChange = (field, value) => {
    onChange({ ...variation, [field]: value });
  };

  const handleStepChange = (index, updatedStep) => {
    const newSteps = [...variation.steps];
    newSteps[index] = updatedStep;
    onChange({ ...variation, steps: newSteps });
  };

  const addStep = () => {
    const newSteps = [...(variation.steps || []), { type: "", player: "" }];
    onChange({ ...variation, steps: newSteps });
  };

  const removeStep = (index) => {
    const newSteps = variation.steps.filter((_, i) => i !== index);
    onChange({ ...variation, steps: newSteps });
  };

  return (
    <div className="bg-[#252526] border-l-[3px] border-pink-500 rounded-r-md my-4 p-4 relative">
      <h4 className="text-pink-500 mt-0 text-sm uppercase tracking-wide font-semibold mb-2.5">Variation Details</h4>

      <label className="text-[#b0b0b0] text-xs font-bold mt-4 block">
        Type:
        <input
          type="text"
          value={variation.type || ""}
          placeholder="e.g. item, switch..."
          onChange={(e) => handleFieldChange("type", e.target.value)}
          className="bg-[#2c2c2c] border border-[#444] rounded text-white text-[0.95rem] px-3 py-2 w-full mt-1.5 transition-all focus:bg-[#333] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
        />
      </label>

      <label className="text-[#b0b0b0] text-xs font-bold mt-4 block">
        Name / Trigger:
        <input
          type="text"
          value={variation.name || ""}
          placeholder="e.g. Leftovers, Earthquake..."
          onChange={(e) => handleFieldChange("name", e.target.value)}
          className="bg-[#2c2c2c] border border-[#444] rounded text-white text-[0.95rem] px-3 py-2 w-full mt-1.5 transition-all focus:bg-[#333] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
        />
      </label>

      <div className="mt-4">
        <h5 className="mb-2.5 font-semibold text-white">Nested Steps:</h5>
        {variation.steps?.map((step, i) => (
          <div key={i} className="mb-4">
            <StepForm
              step={step}
              onChange={(updated) => handleStepChange(i, updated)}
            />
            <div className="flex justify-end gap-2.5 mt-2.5">
              <button 
                className="bg-red-600 hover:bg-red-700 text-white border-none rounded px-4 py-2.5 text-sm font-medium cursor-pointer flex items-center justify-center gap-2 transition-all active:translate-y-[1px]" 
                onClick={() => removeStep(i)}
              >
                ❌ Remove Step
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-2.5 mt-2.5">
          <button 
            className="bg-green-600 hover:bg-green-700 text-white border-none rounded px-4 py-2.5 text-sm font-medium cursor-pointer flex items-center justify-center gap-2 transition-all active:translate-y-[1px]" 
            onClick={addStep}
          >
            ➕ Add Step
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariationForm;