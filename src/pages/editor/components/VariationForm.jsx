import StepForm from "./StepForm";
import "./VariationForm.css";

const VariationForm = ({ variation, onChange }) => {
  // aggiorna i campi base (type, name)
  const handleFieldChange = (field, value) => {
    onChange({ ...variation, [field]: value });
  };

  // aggiorna uno step dentro variation.steps
  const handleStepChange = (index, updatedStep) => {
    const newSteps = [...variation.steps];
    newSteps[index] = updatedStep;
    onChange({ ...variation, steps: newSteps });
  };

  // aggiunge un nuovo step vuoto
  const addStep = () => {
    const newSteps = [...(variation.steps || []), { type: "", player: "" }];
    onChange({ ...variation, steps: newSteps });
  };

  // elimina step
  const removeStep = (index) => {
    const newSteps = variation.steps.filter((_, i) => i !== index);
    onChange({ ...variation, steps: newSteps });
  };

  return (
    <div
      style={{ border: "1px dashed #aaa", margin: "10px 0", padding: "10px" }}
    >
      <h4>Variation</h4>
      <label>
        Type:{" "}
        <input
          type="text"
          value={variation.type || ""}
          onChange={(e) => handleFieldChange("type", e.target.value)}
        />
      </label>
      <br />
      <label>
        Name:{" "}
        <input
          type="text"
          value={variation.name || ""}
          onChange={(e) => handleFieldChange("name", e.target.value)}
        />
      </label>

      <div style={{ marginTop: "10px" }}>
        <h5>Steps:</h5>
        {variation.steps?.map((step, i) => (
          <div key={i}>
            <StepForm
              step={step}
              onChange={(updated) => handleStepChange(i, updated)}
            />
            <button className="btn btn-danger" onClick={() => removeStep(i)}>
              ❌ Rimuovi Step
            </button>
          </div>
        ))}
        <button className="btn btn-success" onClick={addStep}>
          ➕ Aggiungi Step
        </button>
      </div>
    </div>
  );
};

export default VariationForm;
