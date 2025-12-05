import "./UniversalJsonEditor.css";

const UniversalJsonEditor = ({ data, onChange, label, suggestedKeys = [] }) => {
  if (Array.isArray(data)) {
    return (
      <div className="universal-array-container">
        {label && <h4 className="universal-array-header">{label} (List)</h4>}

        {data.map((item, index) => (
          <div key={index} className="universal-array-item">
            <div className="universal-item-header">
              <strong>Item {index + 1}</strong>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onChange(data.filter((_, i) => i !== index))}
              >
                🗑️ Remove
              </button>
            </div>
            <UniversalJsonEditor
              data={item}
              label={null}
              suggestedKeys={suggestedKeys}
              onChange={(updatedItem) => {
                const newData = [...data];
                newData[index] = updatedItem;
                onChange(newData);
              }}
            />
          </div>
        ))}

        <div style={{ marginTop: "10px" }}>
          <button
            className="btn btn-success btn-sm"
            onClick={() => {
              let newItem = {};
              if (data.length > 0) {
                try {
                  newItem = JSON.parse(JSON.stringify(data[0]));
                  const cleanValues = (obj) => {
                    for (let k in obj) {
                      if (obj[k] && typeof obj[k] === "object")
                        cleanValues(obj[k]);
                      else if (typeof obj[k] === "string") obj[k] = "";
                      else if (typeof obj[k] === "number") obj[k] = 0;
                      else if (typeof obj[k] === "boolean") obj[k] = false;
                    }
                  };
                  if (typeof newItem === "object") cleanValues(newItem);
                } catch {
                  newItem = {};
                }
              }
              onChange([...data, newItem]);
            }}
          >
            ➕ Add Item
          </button>
        </div>
      </div>
    );
  }

  if (typeof data === "object" && data !== null) {
    const missingSuggestions = suggestedKeys.filter(
      (key) => !Object.keys(data).includes(key)
    );

    const handleAddFieldSelection = (e) => {
      const value = e.target.value;
      if (!value) return;

      let fieldName =
        value === "__custom__"
          ? window.prompt("Nome del nuovo campo (es. 'ability'):")
          : value;

      if (fieldName && !Object.hasOwn(data, fieldName)) {
        const initialValue =
          fieldName === "moves" || fieldName === "variants" ? [] : "";
        onChange({ ...data, [fieldName]: initialValue });
      } else if (fieldName) {
        alert("Chiave esistente o non valida.");
      }
      e.target.value = "";
    };

    return (
      <div className="universal-object-container">
        {label && (
          <h5 style={{ color: "#aaa", margin: "10px 0 5px" }}>{label}</h5>
        )}

        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="universal-field-row">
            <div className="universal-field-label-wrapper">
              <div className="universal-field-label" title={key}>
                {key}:
              </div>
              <button
                className="delete-key-btn"
                title="Elimina"
                onClick={() => {
                  if (window.confirm(`Eliminare campo "${key}"?`)) {
                    const newData = { ...data };
                    delete newData[key];
                    onChange(newData);
                  }
                }}
              >
                ×
              </button>
            </div>
            <div className="universal-field-value">
              <UniversalJsonEditor
                data={value}
                suggestedKeys={suggestedKeys}
                onChange={(newVal) => onChange({ ...data, [key]: newVal })}
              />
            </div>
          </div>
        ))}

        <div style={{ marginTop: "8px" }}>
          <select
            className="add-field-select"
            onChange={handleAddFieldSelection}
            defaultValue=""
          >
            <option value="" disabled>
              + Aggiungi Campo...
            </option>
            {missingSuggestions.length > 0 && (
              <optgroup label="Suggeriti">
                {missingSuggestions.map((key) => (
                  <option key={key} value={key}>
                    + {key}
                  </option>
                ))}
              </optgroup>
            )}
            <optgroup label="Altro">
              <option value="__custom__">Scrivi a mano...</option>
            </optgroup>
          </select>
        </div>
      </div>
    );
  }

  if (typeof data === "boolean") {
    return (
      <input
        type="checkbox"
        checked={data}
        onChange={(e) => onChange(e.target.checked)}
      />
    );
  }

  return (
    <input
      type={typeof data === "number" ? "number" : "text"}
      value={data ?? ""}
      className="universal-input"
      onChange={(e) => {
        const val = e.target.value;
        onChange(typeof data === "number" ? Number(val) : val);
      }}
    />
  );
};

export default UniversalJsonEditor;
