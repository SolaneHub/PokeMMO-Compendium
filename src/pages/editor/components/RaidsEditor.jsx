import { Activity, useState } from "react";

import UniversalJsonEditor from "@/pages/editor/components/UniversalJsonEditor";

const RAID_TEMPLATE = {
  drops: [],
  moves: [],
  mechanics: { ability: "", heldItem: "", thresholds: { 100: { effect: "" } } },
  teamStrategies: [],
  locations: { kanto: {}, johto: {}, hoenn: {}, sinnoh: {}, unova: {} },
};

const POKEMON_BUILD_KEYS = [
  "name",
  "player",
  "order",
  "item",
  "ability",
  "nature",
  "evs",
  "ivs",
  "moves",
  "variants",
];

const RaidsEditor = ({ data, onChange }) => {
  const [idx, setIdx] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  const handleRaidChange = (field, value) => {
    if (idx === null) return;
    const newData = [...data];
    newData[idx] = { ...newData[idx], [field]: value };
    onChange(newData);
  };

  const ensureField = (field) => {
    if (!data[idx][field]) handleRaidChange(field, RAID_TEMPLATE[field]);
  };

  const raid = idx !== null ? data[idx] : null;

  return (
    <div>
      <title>Editor: Raids</title>
      <h3 className="border-b-2 border-[#00bcd4] pb-2.5 mb-5 font-bold text-xl text-white">
        👹 Editor Raid
      </h3>

      <div className="mb-5">
        <select
          className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
          value={idx ?? ""}
          onChange={(e) =>
            setIdx(e.target.value !== "" ? parseInt(e.target.value) : null)
          }
        >
          <option value="">-- Seleziona un Raid Boss --</option>
          {data.map((r, i) => (
            <option key={i} value={i}>
              {r.name} ({r.stars}★)
            </option>
          ))}
        </select>
      </div>

      {raid ? (
        <div className="bg-[#1e1e1e] border border-[#333] rounded-md shadow-sm p-0 overflow-hidden">
          <div className="flex border-b border-[#333] bg-[#1e1e1e]">
            {["info", "locations", "mechanics", "strategies"].map((t) => (
              <div
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-5 py-2.5 cursor-pointer border-b-[3px] rounded-t-md transition-colors
                  ${activeTab === t 
                    ? "border-blue-500 text-white font-bold bg-[#252526]" 
                    : "border-transparent text-[#888] font-normal bg-transparent hover:bg-[#252526]"
                  }`}
              >
                {t === "info"
                  ? "📝 Info"
                  : t === "locations"
                    ? "🌍 Loc"
                    : t === "mechanics"
                      ? "⚙️ Mech"
                      : "⚔️ Strat"}
              </div>
            ))}
          </div>

          <div className="p-5">
            <Activity mode={activeTab === "info" ? "visible" : "hidden"}>
              <div className="animate-[fade-in_0.3s_ease-out] grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#aaa] text-xs font-bold block mb-1.5 uppercase">Nome</label>
                  <input
                    className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                    value={raid.name}
                    onChange={(e) => handleRaidChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[#aaa] text-xs font-bold block mb-1.5 uppercase">Stelle</label>
                  <input
                    type="number"
                    className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
                    value={raid.stars}
                    onChange={(e) =>
                      handleRaidChange("stars", parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <h5 className="text-[#88c0d0] border-b border-[#333] pb-1.5 mb-2.5 font-semibold">Drops</h5>
                  <UniversalJsonEditor
                    data={raid.drops || []}
                    onChange={(v) => handleRaidChange("drops", v)}
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <h5 className="text-[#88c0d0] border-b border-[#333] pb-1.5 mb-2.5 font-semibold">Moveset</h5>
                  <UniversalJsonEditor
                    data={raid.moves || []}
                    onChange={(v) => handleRaidChange("moves", v)}
                  />
                </div>
              </div>
            </Activity>

            <Activity mode={activeTab === "locations" ? "visible" : "hidden"}>
              <div className="animate-[fade-in_0.3s_ease-out]">
                {!raid.locations ? (
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white border-none rounded px-4 py-2 text-sm font-medium cursor-pointer transition-all"
                    onClick={() => ensureField("locations")}
                  >
                    Inizializza
                  </button>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5">
                    {Object.keys(RAID_TEMPLATE.locations).map((reg) => (
                      <div
                        key={reg}
                        className="bg-[#252526] p-2.5 rounded"
                      >
                        <strong className="capitalize text-[#88c0d0] block mb-1.5">
                          {reg}
                        </strong>
                        <input
                          className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-2 w-full transition-colors focus:border-blue-500 focus:bg-[#222] outline-none mt-1.5"
                          value={raid.locations?.[reg]?.area || ""}
                          onChange={(e) => {
                            const locs = {
                              ...raid.locations,
                              [reg]: {
                                ...raid.locations[reg],
                                area: e.target.value,
                              },
                            };
                            handleRaidChange("locations", locs);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Activity>

            <Activity mode={activeTab === "mechanics" ? "visible" : "hidden"}>
              <div className="animate-[fade-in_0.3s_ease-out]">
                <UniversalJsonEditor
                  data={raid.mechanics || {}}
                  onChange={(v) => handleRaidChange("mechanics", v)}
                />
              </div>
            </Activity>

            <Activity mode={activeTab === "strategies" ? "visible" : "hidden"}>
              <div className="animate-[fade-in_0.3s_ease-out]">
                <UniversalJsonEditor
                  data={raid.teamStrategies || []}
                  onChange={(v) => handleRaidChange("teamStrategies", v)}
                  suggestedKeys={POKEMON_BUILD_KEYS}
                />
              </div>
            </Activity>
          </div>
        </div>
      ) : (
        <p className="text-center mt-10 text-gray-500">Seleziona un raid.</p>
      )}
    </div>
  );
};
export default RaidsEditor;