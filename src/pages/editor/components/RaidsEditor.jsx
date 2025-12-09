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
      <h3 className="mb-5 border-b-2 border-[#00bcd4] pb-2.5 text-xl font-bold text-white">
        👹 Editor Raid
      </h3>

      <div className="mb-5">
        <select
          className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
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
        <div className="overflow-hidden rounded-md border border-[#333] bg-[#1e1e1e] p-0 shadow-sm">
          <div className="flex border-b border-[#333] bg-[#1e1e1e]">
            {["info", "locations", "mechanics", "strategies"].map((t) => (
              <div
                key={t}
                onClick={() => setActiveTab(t)}
                className={`cursor-pointer rounded-t-md border-b-[3px] px-5 py-2.5 transition-colors ${
                  activeTab === t
                    ? "border-blue-500 bg-[#252526] font-bold text-white"
                    : "border-transparent bg-transparent font-normal text-[#888] hover:bg-[#252526]"
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
              <div className="grid animate-[fade-in_0.3s_ease-out] grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#aaa] uppercase">
                    Nome
                  </label>
                  <input
                    className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                    value={raid.name}
                    onChange={(e) => handleRaidChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#aaa] uppercase">
                    Stelle
                  </label>
                  <input
                    type="number"
                    className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
                    value={raid.stars}
                    onChange={(e) =>
                      handleRaidChange("stars", parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <h5 className="mb-2.5 border-b border-[#333] pb-1.5 font-semibold text-[#88c0d0]">
                    Drops
                  </h5>
                  <UniversalJsonEditor
                    data={raid.drops || []}
                    onChange={(v) => handleRaidChange("drops", v)}
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <h5 className="mb-2.5 border-b border-[#333] pb-1.5 font-semibold text-[#88c0d0]">
                    Moveset
                  </h5>
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
                    className="cursor-pointer rounded border-none bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700"
                    onClick={() => ensureField("locations")}
                  >
                    Inizializza
                  </button>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5">
                    {Object.keys(RAID_TEMPLATE.locations).map((reg) => (
                      <div key={reg} className="rounded bg-[#252526] p-2.5">
                        <strong className="mb-1.5 block text-[#88c0d0] capitalize">
                          {reg}
                        </strong>
                        <input
                          className="mt-1.5 w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-2 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
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
        <p className="mt-10 text-center text-gray-500">Seleziona un raid.</p>
      )}
    </div>
  );
};
export default RaidsEditor;
