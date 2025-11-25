import "./UniversalJsonEditor.css";

const UniversalJsonEditor = ({ data, onChange, label, suggestedKeys = [] }) => {
  // --- 1. GESTIONE ARRAY ---
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
                onClick={() => {
                  const newData = data.filter((_, i) => i !== index);
                  onChange(newData);
                }}
              >
                🗑️ Remove
              </button>
            </div>
            {/* Passiamo suggestedKeys ricorsivamente agli item della lista */}
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
              // Clona la struttura del primo elemento
              let newItem = {};
              if (data.length > 0) {
                try {
                  newItem = JSON.parse(JSON.stringify(data[0]));
                  const cleanValues = (obj) => {
                    for (let k in obj) {
                      if (typeof obj[k] === "object" && obj[k] !== null)
                        cleanValues(obj[k]);
                      else if (typeof obj[k] === "string") obj[k] = "";
                      else if (typeof obj[k] === "number") obj[k] = 0;
                    }
                  };
                  if (typeof newItem === "object") cleanValues(newItem);
                } catch (e) {
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

  // --- 2. GESTIONE OGGETTI ---
  if (typeof data === "object" && data !== null) {
    // Calcola quali chiavi suggerite mancano ancora in questo oggetto
    const missingSuggestions = suggestedKeys.filter(
      (key) => !Object.keys(data).includes(key)
    );

    const handleAddFieldSelection = (e) => {
      const value = e.target.value;
      if (!value) return;

      let fieldName = value;

      // Se l'utente sceglie "Custom...", apre il prompt classico
      if (value === "__custom__") {
        fieldName = window.prompt("Nome del nuovo campo (es. 'ability'):");
      }

      if (fieldName) {
        if (Object.prototype.hasOwnProperty.call(data, fieldName)) {
          alert("Questa chiave esiste già!");
          return;
        }
        // Se il campo è 'moves' o 'variants', inizializzalo come array vuoto per comodità
        const initialValue =
          fieldName === "moves" || fieldName === "variants" ? [] : "";
        onChange({ ...data, [fieldName]: initialValue });
      }

      // Resetta la select
      e.target.value = "";
    };

    const handleDeleteField = (keyToDelete) => {
      if (window.confirm(`Eliminare campo "${keyToDelete}"?`)) {
        const newData = { ...data };
        delete newData[keyToDelete];
        onChange(newData);
      }
    };

    return (
      <div className="universal-object-container">
        {label && (
          <h5 style={{ color: "#aaa", margin: "10px 0 5px" }}>{label}</h5>
        )}

        {Object.keys(data).map((key) => (
          <div key={key} className="universal-field-row">
            <div className="universal-field-label-wrapper">
              <div className="universal-field-label" title={key}>
                {key}:
              </div>
              <button
                className="delete-key-btn"
                title="Elimina"
                onClick={() => handleDeleteField(key)}
              >
                ×
              </button>
            </div>
            <div className="universal-field-value">
              <UniversalJsonEditor
                data={data[key]}
                suggestedKeys={suggestedKeys} // Propaga i suggerimenti
                onChange={(newVal) => onChange({ ...data, [key]: newVal })}
              />
            </div>
          </div>
        ))}

        {/* --- MENU A TENDINA PER AGGIUNGERE CAMPI --- */}
        <div style={{ marginTop: "8px" }}>
          <select
            className="add-field-select"
            onChange={handleAddFieldSelection}
            defaultValue=""
          >
            <option value="" disabled>
              + Aggiungi Campo...
            </option>

            {/* Mostra i suggerimenti mancanti */}
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

  // --- 3. PRIMITIVI ---
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
      value={data === null ? "" : data}
      className="universal-input"
      onChange={(e) => {
        const val = e.target.value;
        onChange(typeof data === "number" ? Number(val) : val);
      }}
    />
  );
};

export default UniversalJsonEditor;
