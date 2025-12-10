import { useState } from "react";

const UniversalJsonEditor = ({ data, onChange, label, suggestedKeys = [] }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  if (Array.isArray(data)) {
    return (
      <div className="mt-2.5 rounded-r-md border-l-[3px] border-blue-500 bg-blue-500/5 p-2.5 pl-4 font-mono text-sm">
        <div className="flex items-center justify-between">
          {label && (
            <h4
              className="mb-2.5 cursor-pointer text-xs tracking-widest text-white uppercase opacity-70"
              onClick={toggleCollapse}
            >
              {label} (List){" "}
              <span className="ml-2">{isCollapsed ? "▶" : "▼"}</span>
            </h4>
          )}
          <button
            className="cursor-pointer rounded border-none bg-green-600 px-2 py-1 text-xs text-white transition-colors hover:bg-green-700"
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

        {!isCollapsed &&
          (data.length === 0 ? (
            <p className="py-2 text-[#888] italic">Empty List</p>
          ) : (
            <>
              {data.map((item, index) => (
                <div
                  key={index}
                  className="mr-2.5 mb-2.5 rounded-md border border-[#333] bg-[#242424] p-2.5"
                >
                  <div className="-m-2.5 mb-2.5 flex items-center justify-between rounded-t-md border-b border-[#333] bg-[#2a2a2a] p-1.5 px-2.5">
                    <strong className="text-[#fab1a0]">Item {index + 1}</strong>
                    <button
                      className="cursor-pointer rounded border-none bg-red-600 px-2 py-1 text-xs text-white transition-colors hover:bg-red-700"
                      onClick={() =>
                        onChange(data.filter((_, i) => i !== index))
                      }
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
            </>
          ))}
      </div>
    );
  }

  if (typeof data === "object" && data !== null) {
    const missingSuggestions = suggestedKeys.filter(
      (key) => !Object.keys(data).includes(key)
    );

    const handleAddField = (fieldName, initialValue = "") => {
      if (fieldName && !Object.hasOwn(data, fieldName)) {
        onChange({ ...data, [fieldName]: initialValue });
      } else if (fieldName) {
        alert("Key already exists or is invalid.");
      }
    };

    return (
      <div className="flex w-full flex-col gap-[2px] font-mono text-sm">
        <div className="flex items-center justify-between">
          {label && (
            <h5
              className="my-2.5 mb-1.5 cursor-pointer font-semibold text-[#aaa]"
              onClick={toggleCollapse}
            >
              {label} <span className="ml-2">{isCollapsed ? "▶" : "▼"}</span>
            </h5>
          )}
          {!isCollapsed && (
            <div className="flex gap-2">
              {missingSuggestions.length > 0 && (
                <button
                  className="cursor-pointer rounded border-none bg-blue-600 px-2 py-1 text-xs text-white transition-colors hover:bg-blue-700"
                  onClick={() => {
                    if (missingSuggestions.length > 0) {
                      handleAddField(missingSuggestions[0], "");
                    }
                  }}
                >
                  + Suggested Field
                </button>
              )}
              <button
                className="cursor-pointer rounded border-none bg-green-600 px-2 py-1 text-xs text-white transition-colors hover:bg-green-700"
                onClick={() => {
                  const fieldName = window.prompt(
                    "New field name (e.g., 'ability'):"
                  );
                  if (fieldName) {
                    handleAddField(fieldName, "");
                  }
                }}
              >
                + Custom Field
              </button>
            </div>
          )}
        </div>
        {!isCollapsed &&
          (Object.keys(data).length === 0 ? (
            <p className="py-2 text-[#888] italic">Empty Object</p>
          ) : (
            <>
              {Object.entries(data).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-start border-b border-[#2a2a2a] py-2"
                >
                  <div className="flex flex-[0_0_160px] items-center justify-between pt-1.5 pr-4">
                    <div
                      className="max-w-[130px] overflow-hidden font-semibold text-ellipsis whitespace-nowrap text-[#88c0d0]"
                      title={key}
                    >
                      {key}:
                    </div>
                    <button
                      className="cursor-pointer rounded border-none bg-transparent px-1.5 text-lg leading-none text-[#555] transition-colors hover:bg-red-500/10 hover:text-[#ff6b6b]"
                      title="Delete"
                      onClick={() => {
                        if (window.confirm(`Delete field "${key}"?`)) {
                          const newData = { ...data };
                          delete newData[key];
                          onChange(newData);
                        }
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div className="min-w-0 flex-1 [&>.flex-col]:my-1.5 [&>.flex-col]:border-l-2 [&>.flex-col]:border-[#444] [&>.flex-col]:pl-4">
                    <UniversalJsonEditor
                      data={value}
                      suggestedKeys={suggestedKeys}
                      onChange={(newVal) =>
                        onChange({ ...data, [key]: newVal })
                      }
                    />
                  </div>
                </div>
              ))}
            </>
          ))}
      </div>
    );
  }

  if (typeof data === "boolean") {
    return (
      <input
        type="checkbox"
        checked={data}
        className="mt-1.5 h-5 w-5 cursor-pointer accent-blue-500"
        onChange={(e) => onChange(e.target.checked)}
      />
    );
  }

  return (
    <input
      type={typeof data === "number" ? "number" : "text"}
      value={data ?? ""}
      className="font-inherit w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
      onChange={(e) => {
        const val = e.target.value;
        onChange(typeof data === "number" ? Number(val) : val);
      }}
    />
  );
};

export default UniversalJsonEditor;
