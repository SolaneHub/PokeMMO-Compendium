const UniversalJsonEditor = ({ data, onChange, label, suggestedKeys = [] }) => {
  if (Array.isArray(data)) {
    return (
      <div className="mt-2.5 border-l-[3px] border-blue-500 bg-blue-500/5 p-2.5 pl-4 rounded-r-md font-mono text-sm">
        {label && (
          <h4 className="text-white text-xs mb-2.5 uppercase tracking-widest opacity-70">
            {label} (List)
          </h4>
        )}

        {data.map((item, index) => (
          <div
            key={index}
            className="bg-[#242424] border border-[#333] rounded-md mb-2.5 mr-2.5 p-2.5"
          >
            <div className="flex justify-between items-center bg-[#2a2a2a] p-1.5 px-2.5 -m-2.5 mb-2.5 border-b border-[#333] rounded-t-md">
              <strong className="text-[#fab1a0]">Item {index + 1}</strong>
              <button
                className="bg-red-600 hover:bg-red-700 text-white border-none rounded px-2 py-1 text-xs cursor-pointer transition-colors"
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

        <div className="mt-2.5">
          <button
            className="bg-green-600 hover:bg-green-700 text-white border-none rounded px-2 py-1 text-xs cursor-pointer transition-colors"
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
      <div className="flex flex-col gap-[2px] w-full font-mono text-sm">
        {label && (
          <h5 className="text-[#aaa] my-2.5 mb-1.5 font-semibold">{label}</h5>
        )}

        {Object.entries(data).map(([key, value]) => (
          <div
            key={key}
            className="flex items-start py-2 border-b border-[#2a2a2a]"
          >
            <div className="flex-[0_0_160px] flex justify-between items-center pr-4 pt-1.5">
              <div
                className="text-[#88c0d0] font-semibold overflow-hidden text-ellipsis whitespace-nowrap max-w-[130px]"
                title={key}
              >
                {key}:
              </div>
              <button
                className="bg-transparent border-none text-[#555] text-lg leading-none cursor-pointer px-1.5 rounded transition-colors hover:text-[#ff6b6b] hover:bg-red-500/10"
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
            <div className="flex-1 min-w-0 [&>.flex-col]:border-l-2 [&>.flex-col]:border-[#444] [&>.flex-col]:pl-4 [&>.flex-col]:my-1.5">
              <UniversalJsonEditor
                data={value}
                suggestedKeys={suggestedKeys}
                onChange={(newVal) => onChange({ ...data, [key]: newVal })}
              />
            </div>
          </div>
        ))}

        <div className="mt-2">
          <select
            className="bg-transparent border border-dashed border-[#555] text-[#888] p-1.5 w-full rounded cursor-pointer text-sm text-center appearance-none hover:border-blue-500 hover:text-blue-500 hover:bg-blue-500/5 transition-all [&>option]:bg-[#1e1e1e] [&>option]:text-white [&>optgroup]:bg-[#1e1e1e] [&>optgroup]:text-white"
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
        className="w-5 h-5 accent-blue-500 cursor-pointer mt-1.5"
        onChange={(e) => onChange(e.target.checked)}
      />
    );
  }

  return (
    <input
      type={typeof data === "number" ? "number" : "text"}
      value={data ?? ""}
      className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full font-inherit transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
      onChange={(e) => {
        const val = e.target.value;
        onChange(typeof data === "number" ? Number(val) : val);
      }}
    />
  );
};

export default UniversalJsonEditor;
