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
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <label>
        Type:{" "}
        <input
          type="text"
          value={step.type || ""}
          onChange={(e) => handleFieldChange("type", e.target.value)}
        />
      </label>
      <br />

      <label>
        Player Action:{" "}
        <input
          type="text"
          value={step.player || ""}
          onChange={(e) => handleFieldChange("player", e.target.value)}
        />
      </label>
      <br />

      <label>
        Warning:{" "}
        <input
          type="text"
          value={step.warning || ""}
          onChange={(e) => handleFieldChange("warning", e.target.value)}
        />
      </label>

      <div style={{ marginTop: "10px" }}>
        <h4>Variations:</h4>
        {step.variations?.map((variation, i) => (
          <div key={i}>
            <VariationForm
              variation={variation}
              onChange={(updated) => handleVariationChange(i, updated)}
            />
            <button
              className="btn btn-danger"
              onClick={() => removeVariation(i)}
            >
              ❌ Remove Variation
            </button>
          </div>
        ))}
        <button className="btn btn-success" onClick={addVariation}>
          ➕ Add Variation
        </button>
      </div>
    </div>
  );
};

export default StepForm;
