import UniversalJsonEditor from "./UniversalJsonEditor";

const PickupEditor = ({ data, onChange }) => {
  const handleItemChange = (index, newItem) => {
    const newData = [...data];
    newData[index] = newItem;
    onChange(newData);
  };

  const deleteItem = (index) => {
    if (window.confirm("Eliminare questa location?")) {
      const newData = data.filter((_, i) => i !== index);
      onChange(newData);
    }
  };

  const addItem = () => {
    const template = { location: "Nuova Area", levels: "1-100", items: [] };
    onChange([...data, template]);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #ebcb8b",
          paddingBottom: "15px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>🎒 Editor Pickup</h3>
          <span style={{ color: "#888", fontSize: "0.9rem" }}>
            Gestisci le tabelle di drop per l&apos;abilità Pickup.
          </span>
        </div>
        <button className="btn btn-success" onClick={addItem}>
          ➕ Nuova Area
        </button>
      </div>

      <div style={{ display: "grid", gap: "20px" }}>
        {data.map((entry, index) => (
          <div
            key={index}
            className="step-card"
            style={{ borderLeft: "5px solid #ebcb8b", padding: "0" }}
          >
            {/* HEADER CARD */}
            <div
              style={{
                background: "#252526",
                padding: "10px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #333",
              }}
            >
              <strong style={{ color: "#ebcb8b", fontSize: "1.1em" }}>
                #{index + 1} - {entry.location || "Area Sconosciuta"}
              </strong>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteItem(index)}
              >
                Elimina
              </button>
            </div>

            <div style={{ padding: "20px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <label>Location / Mappa:</label>
                  <input
                    type="text"
                    className="universal-input"
                    value={entry.location || ""}
                    onChange={(e) =>
                      handleItemChange(index, {
                        ...entry,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Range Livelli:</label>
                  <input
                    type="text"
                    className="universal-input"
                    value={entry.levels || ""}
                    placeholder="es. 1-100"
                    onChange={(e) =>
                      handleItemChange(index, {
                        ...entry,
                        levels: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <h5
                  style={{
                    color: "#88c0d0",
                    borderBottom: "1px solid #333",
                    paddingBottom: "5px",
                  }}
                >
                  Lista Oggetti (Items)
                </h5>
                <UniversalJsonEditor
                  data={entry.items || []}
                  onChange={(newItems) =>
                    handleItemChange(index, { ...entry, items: newItems })
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>
          Nessuna area configurata. Clicca &quot;Nuova Area&quot; in alto.
        </div>
      )}
    </div>
  );
};

export default PickupEditor;
