import UniversalJsonEditor from "@/pages/editor/components/UniversalJsonEditor";

const PickupEditor = ({ data, onChange }) => {
  const safeData = Array.isArray(data) ? data : [];

  const handleItemChange = (index, newItem) => {
    const newData = [...safeData];
    newData[index] = newItem;
    onChange(newData);
  };

  const addItem = () => {
    onChange([
      ...safeData,
      { location: "Nuova Area", levels: "1-100", items: [] },
    ]);
  };

  return (
    <div>
      <title>Editor: Pickup</title>
      <div className="flex justify-between items-center border-b-2 border-[#ebcb8b] pb-4 mb-5">
        <div>
          <h3 className="m-0 text-lg font-bold text-white">🎒 Editor Pickup</h3>
          <span className="text-[#888] text-sm">
            Gestisci le tabelle di drop.
          </span>
        </div>
        <button 
          className="bg-green-600 hover:bg-green-700 text-white border-none rounded px-4 py-2 text-sm font-medium cursor-pointer transition-all active:translate-y-[1px]" 
          onClick={addItem}
        >
          ➕ Nuova Area
        </button>
      </div>

      <div className="grid gap-5">
        {safeData.map((entry, index) => (
          <div
            key={index}
            className="bg-[#1e1e1e] border border-[#333] rounded-md shadow-sm border-l-[5px] border-l-[#ebcb8b] p-0 overflow-hidden"
          >
            <div className="bg-[#252526] px-5 py-2.5 flex justify-between items-center border-b border-[#333]">
              <strong className="text-[#ebcb8b] text-[1.1em]">
                #{index + 1} - {entry.location || "Area Sconosciuta"}
              </strong>
              <button
                className="bg-red-600 hover:bg-red-700 text-white border-none rounded px-2 py-1 text-xs font-medium cursor-pointer transition-all"
                onClick={() => onChange(safeData.filter((_, i) => i !== index))}
              >
                Elimina
              </button>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-[2fr_1fr] gap-5 mb-5">
                <div>
                  <label className="text-[#aaa] text-xs font-bold block mb-1.5 uppercase">Location:</label>
                  <input
                    type="text"
                    className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
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
                  <label className="text-[#aaa] text-xs font-bold block mb-1.5 uppercase">Livelli:</label>
                  <input
                    type="text"
                    className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                    value={entry.levels || ""}
                    placeholder="1-100"
                    onChange={(e) =>
                      handleItemChange(index, {
                        ...entry,
                        levels: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <h5 className="text-[#88c0d0] border-b border-[#333] pb-1.5 mb-2.5 font-semibold">
                Items
              </h5>
              <UniversalJsonEditor
                data={entry.items || []}
                onChange={(newItems) =>
                  handleItemChange(index, { ...entry, items: newItems })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PickupEditor;