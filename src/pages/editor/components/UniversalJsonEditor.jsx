import { useState } from "react";

import { useConfirm } from "@/shared/components/ConfirmationModal"; // Import useConfirm

const UniversalJsonEditor = ({ data, onChange, label, suggestedKeys = [] }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const confirm = useConfirm(); // Initialize useConfirm

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  if (Array.isArray(data)) {
    return (
      <div className="mt-2.5 rounded-xl border border-l-[3px] border-white/5 border-l-blue-500 bg-[#0f1014]/20 p-4 font-mono text-sm shadow-inner">
        <div className="mb-4 flex items-center justify-between">
          {label && (
            <button
              className="flex cursor-pointer items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase transition-colors outline-none hover:text-slate-300"
              onClick={toggleCollapse}
            >
              <span className="text-blue-400">{isCollapsed ? "▶" : "▼"}</span>
              {label}{" "}
              <span className="font-normal opacity-50">
                ({data.length} items)
              </span>
            </button>
          )}
          <button
            className="cursor-pointer rounded-lg bg-green-600 px-3 py-1.5 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-green-700 active:scale-95"
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
            + Add New
          </button>
        </div>

        {!isCollapsed &&
          (data.length === 0 ? (
            <div className="rounded-lg border border-dashed border-white/10 py-6 text-center text-slate-600 italic">
              Empty List
            </div>
          ) : (
            <div className="space-y-4">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="animate-[fade-in_0.2s_ease-out] rounded-xl border border-white/5 bg-[#1a1b20] p-4 shadow-lg"
                >
                  <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-2">
                    <strong className="text-xs font-black tracking-widest text-orange-400 uppercase">
                      Entry #{index + 1}
                    </strong>
                    <button
                      className="cursor-pointer rounded-lg border border-red-600/20 bg-red-600/10 px-3 py-1 text-[10px] font-black tracking-widest text-red-400 uppercase transition-all hover:bg-red-600 hover:text-white"
                      onClick={() =>
                        onChange(data.filter((_, i) => i !== index))
                      }
                    >
                      🗑️ Delete
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
            </div>
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
      <div className="flex w-full flex-col gap-1 font-mono text-sm">
        <div className="mb-2 flex items-center justify-between">
          {label && (
            <button
              className="flex cursor-pointer items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors outline-none hover:text-slate-200"
              onClick={toggleCollapse}
            >
              <span className="text-blue-400">{isCollapsed ? "▶" : "▼"}</span>
              {label}
            </button>
          )}
          {!isCollapsed && (
            <div className="flex gap-2">
              {missingSuggestions.length > 0 && (
                <button
                  className="cursor-pointer rounded-lg border border-blue-600/20 bg-blue-600/10 px-3 py-1 text-[10px] font-black tracking-widest text-blue-400 uppercase transition-all hover:bg-blue-600 hover:text-white"
                  onClick={() => {
                    if (missingSuggestions.length > 0) {
                      handleAddField(missingSuggestions[0], "");
                    }
                  }}
                >
                  + Hint: {missingSuggestions[0]}
                </button>
              )}
              <button
                className="cursor-pointer rounded-lg border border-green-600/20 bg-green-600/10 px-3 py-1 text-[10px] font-black tracking-widest text-green-400 uppercase transition-all hover:bg-green-600 hover:text-white"
                onClick={() => {
                  const fieldName = window.prompt(
                    "New field name (e.g., 'ability'):"
                  );
                  if (fieldName) {
                    handleAddField(fieldName, "");
                  }
                }}
              >
                + New Property
              </button>
            </div>
          )}
        </div>
        {!isCollapsed &&
          (Object.keys(data).length === 0 ? (
            <div className="py-4 text-center text-slate-600 italic">
              Empty Object
            </div>
          ) : (
            <div className="space-y-1">
              {Object.entries(data).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-start rounded-lg border border-white/5 bg-white/[0.02] p-2 transition-colors hover:bg-white/[0.04]"
                >
                  <div className="flex flex-[0_0_180px] items-center justify-between pr-4">
                    <div
                      className="max-w-[150px] overflow-hidden text-[10px] font-black tracking-widest text-ellipsis whitespace-nowrap text-blue-400 uppercase"
                      title={key}
                    >
                      {key}
                    </div>
                    <button
                      className="flex h-6 w-6 items-center justify-center rounded text-slate-600 transition-all hover:bg-red-600/20 hover:text-red-400"
                      title="Delete property"
                      onClick={async () => {
                        const confirmed = await confirm({
                          message: `Delete field "${key}"?`,
                          title: "Delete Field",
                          confirmText: "Delete",
                          cancelText: "Cancel",
                        });
                        if (confirmed) {
                          const newData = { ...data };
                          delete newData[key];
                          onChange(newData);
                        }
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div className="min-w-0 flex-1 border-l-2 border-white/10 pl-4">
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
            </div>
          ))}
      </div>
    );
  }

  if (typeof data === "boolean") {
    return (
      <div className="flex h-10 items-center">
        <input
          type="checkbox"
          checked={data}
          className="h-5 w-5 cursor-pointer rounded border-white/10 bg-[#0f1014] accent-blue-500"
          onChange={(e) => onChange(e.target.checked)}
        />
      </div>
    );
  }

  return (
    <input
      type={typeof data === "number" ? "number" : "text"}
      value={data ?? ""}
      className="w-full rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2.5 text-sm font-bold text-slate-100 transition-colors outline-none focus:border-blue-500"
      onChange={(e) => {
        const val = e.target.value;
        onChange(typeof data === "number" ? Number(val) : val);
      }}
    />
  );
};

export default UniversalJsonEditor;
