import "./StepForm.css"; // Usa lo stesso CSS di StepForm per coerenza

import StepForm from "./StepForm";

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
    <div className="variation-form-container">
      <h4>Variation Details</h4>

      <label>
        Type:
        <input
          type="text"
          value={variation.type || ""}
          placeholder="e.g. item, switch..."
          onChange={(e) => handleFieldChange("type", e.target.value)}
        />
      </label>

      <label>
        Name / Trigger:
        <input
          type="text"
          value={variation.name || ""}
          placeholder="e.g. Leftovers, Earthquake..."
          onChange={(e) => handleFieldChange("name", e.target.value)}
        />
      </label>

      <div style={{ marginTop: "15px" }}>
        <h5>Nested Steps:</h5>
        {variation.steps?.map((step, i) => (
          <div key={i} style={{ marginBottom: "15px" }}>
            <StepForm
              step={step}
              onChange={(updated) => handleStepChange(i, updated)}
            />
            <div className="form-actions">
              <button className="btn btn-danger" onClick={() => removeStep(i)}>
                ❌ Remove Step
              </button>
            </div>
          </div>
        ))}

        <div className="form-actions">
          <button className="btn btn-success" onClick={addStep}>
            ➕ Add Step
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariationForm;
