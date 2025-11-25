import "./StepForm.css";

import VariationForm from "./VariationForm";

const StepForm = ({ step, onChange }) => {
  // ? Update basic fields of the step
  const handleFieldChange = (field, value) => {
    onChange({ ...step, [field]: value });
  };

  // ? Update a specific variation within the step
  const handleVariationChange = (index, updatedVariation) => {
    const newVariations = [...(step.variations || [])];
    newVariations[index] = updatedVariation;
    onChange({ ...step, variations: newVariations });
  };

  // * Add a new empty variation
  const addVariation = () => {
    const newVariations = [
      ...(step.variations || []),
      { type: "", name: "", steps: [] },
    ];
    onChange({ ...step, variations: newVariations });
  };

  // ! Remove a variation by index
  const removeVariation = (index) => {
    const newVariations = step.variations.filter((_, i) => i !== index);
    onChange({ ...step, variations: newVariations });
  };

  return (
    <div className="step-form-container">
      <label>
        Type:
        <input
          type="text"
          value={step.type || ""}
          placeholder="e.g. main, step, warning..."
          onChange={(e) => handleFieldChange("type", e.target.value)}
        />
      </label>

      <label>
        Player Action:
        <input
          type="text"
          value={step.player || ""}
          placeholder="Describe the action..."
          onChange={(e) => handleFieldChange("player", e.target.value)}
        />
      </label>

      <label>
        Warning / Note:
        <input
          type="text"
          value={step.warning || ""}
          placeholder="Optional warning..."
          onChange={(e) => handleFieldChange("warning", e.target.value)}
        />
      </label>

      {/* Sezione Variazioni */}
      <div className="variation-list">
        <h4>Variations</h4>
        {step.variations?.map((variation, i) => (
          <div key={i}>
            <VariationForm
              variation={variation}
              onChange={(updated) => handleVariationChange(i, updated)}
            />
            <div className="form-actions" style={{ marginBottom: "15px" }}>
              <button
                className="btn btn-danger"
                onClick={() => removeVariation(i)}
              >
                ❌ Remove Variation
              </button>
            </div>
          </div>
        ))}

        <div className="form-actions">
          <button className="btn btn-success" onClick={addVariation}>
            ➕ Add Variation
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepForm;
