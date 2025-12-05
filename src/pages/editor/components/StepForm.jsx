import "./StepForm.css";

import VariationForm from "./VariationForm";

const StepForm = ({ step, onChange }) => {
  const update = (field, value) => onChange({ ...step, [field]: value });

  return (
    <div className="step-form-container">
      <label>
        Type:{" "}
        <input
          type="text"
          value={step.type || ""}
          onChange={(e) => update("type", e.target.value)}
        />
      </label>
      <label>
        Action:{" "}
        <input
          type="text"
          value={step.player || ""}
          onChange={(e) => update("player", e.target.value)}
        />
      </label>
      <label>
        Note:{" "}
        <input
          type="text"
          value={step.warning || ""}
          onChange={(e) => update("warning", e.target.value)}
        />
      </label>

      <div className="variation-list">
        <h4>Variations</h4>
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
              className="btn btn-danger mt-2"
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
          className="btn btn-success mt-4"
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
