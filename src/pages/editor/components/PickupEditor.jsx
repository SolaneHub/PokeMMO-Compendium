import React from "react";

const RegionEditor = ({
  region,
  onChange,
  onRemove,
  onAddLocation,
  onRemoveLocation,
  onUpdateLocation,
}) => {
  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-l-[5px] border-white/5 border-l-blue-500 bg-[#1a1b20] p-0 shadow-lg">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-5 py-3">
        <div className="flex items-center gap-3">
          <strong className="text-sm font-bold tracking-wider text-blue-400 uppercase">
            Region:
          </strong>
          <input
            type="text"
            className="w-48 rounded-lg border border-white/10 bg-[#0f1014] px-3 py-1.5 text-slate-100 transition-colors outline-none focus:border-blue-500"
            value={region.name || ""}
            onChange={(e) => onChange({ ...region, name: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
          {region.note && (
            <span className="text-sm text-yellow-300">({region.note})</span>
          )}
          <button
            className="cursor-pointer rounded border-none bg-red-600 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-red-700"
            onClick={onRemove}
          >
            Remove Region
          </button>
        </div>
      </div>
      <div className="p-5">
        <h5 className="mb-2.5 border-b border-[#333] pb-1.5 font-semibold text-[#88c0d0]">
          Locations
        </h5>
        <div className="mb-4 space-y-4">
          {region.locations?.map((location, locIndex) => (
            <LocationEditor
              key={locIndex}
              location={location}
              onChange={(updatedLocation) =>
                onUpdateLocation(locIndex, updatedLocation)
              }
              onRemove={() => onRemoveLocation(locIndex)}
            />
          ))}
        </div>
        <button
          className="cursor-pointer rounded border-none bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-green-700"
          onClick={onAddLocation}
        >
          ➕ Add Location
        </button>
      </div>
    </div>
  );
};

const LocationEditor = ({ location, onChange, onRemove }) => {
  const handleItemChange = (category, itemIndex, newItemName) => {
    const newItems = { ...location.items };
    newItems[category] = newItems[category].map((item, i) =>
      i === itemIndex ? newItemName : item
    );
    onChange({ ...location, items: newItems });
  };

  const handleAddItem = (category) => {
    const newItems = { ...location.items };
    newItems[category] = [...(newItems[category] || []), ""];
    onChange({ ...location, items: newItems });
  };

  const handleRemoveItem = (category, itemIndex) => {
    const newItems = { ...location.items };
    newItems[category] = newItems[category].filter((_, i) => i !== itemIndex);
    onChange({ ...location, items: newItems });
  };

  return (
    <div className="rounded-xl border border-white/5 bg-[#0f1014]/50 p-5">
      <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-black tracking-widest text-slate-500 uppercase">
            Location Name
          </label>
          <input
            type="text"
            className="w-64 rounded-lg border border-white/10 bg-[#0f1014] px-3 py-1.5 text-sm font-bold text-slate-100 transition-colors outline-none focus:border-blue-500"
            value={location.name || ""}
            onChange={(e) => onChange({ ...location, name: e.target.value })}
          />
        </div>
        <button
          className="rounded-lg bg-red-600/10 px-3 py-1.5 text-xs font-bold text-red-400 transition-all hover:bg-red-600 hover:text-white"
          onClick={onRemove}
        >
          Remove Location
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(location.items || {}).map(([category, items]) => (
          <div
            key={category}
            className="flex flex-col gap-2 rounded-lg border border-white/5 bg-white/5 p-3"
          >
            <div className="flex items-center justify-between">
              <h6 className="text-[10px] font-black tracking-widest text-blue-400 uppercase">
                {category.replace(/([A-Z])/g, " $1").trim()}
              </h6>
              <span className="text-[10px] font-bold text-slate-500">
                {items.length} Items
              </span>
            </div>
            <div className="space-y-1.5">
              {items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    className="w-full rounded border border-white/10 bg-[#0f1014] px-2.5 py-1 text-xs text-slate-200 transition-colors outline-none focus:border-blue-500"
                    value={item}
                    onChange={(e) =>
                      handleItemChange(category, itemIndex, e.target.value)
                    }
                  />
                  <button
                    className="flex h-6 w-6 items-center justify-center rounded bg-red-600/20 text-red-400 transition-all hover:bg-red-600 hover:text-white"
                    onClick={() => handleRemoveItem(category, itemIndex)}
                  >
                    −
                  </button>
                </div>
              ))}
              <button
                className="mt-1 w-full rounded border border-dashed border-blue-500/30 bg-blue-600/5 py-1.5 text-[10px] font-black tracking-widest text-blue-400 uppercase transition-all hover:bg-blue-600/10"
                onClick={() => handleAddItem(category)}
              >
                + Add Item
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PickupEditor = ({ data, onChange }) => {
  const safeData = data || { regions: [] };

  const handleUpdateRegion = (regionIndex, updatedRegion) => {
    const newRegions = [...safeData.regions];
    newRegions[regionIndex] = updatedRegion;
    onChange({ ...safeData, regions: newRegions });
  };

  const handleRemoveRegion = (regionIndex) => {
    if (window.confirm("Are you sure you want to remove this region?")) {
      const newRegions = safeData.regions.filter((_, i) => i !== regionIndex);
      onChange({ ...safeData, regions: newRegions });
    }
  };

  const handleAddRegion = () => {
    onChange({
      ...safeData,
      regions: [
        ...safeData.regions,
        {
          name: "New Region",
          locations: [],
        },
      ],
    });
  };

  const handleAddLocation = (regionIndex) => {
    const newRegions = [...safeData.regions];
    const newLocations = [
      ...newRegions[regionIndex].locations,
      {
        name: "New Location",
        items: {
          common: [],
          uncommon: [],
          rare: [],
          veryRare: [],
        },
      },
    ];
    newRegions[regionIndex] = {
      ...newRegions[regionIndex],
      locations: newLocations,
    };
    onChange({ ...safeData, regions: newRegions });
  };

  const handleRemoveLocation = (regionIndex, locIndex) => {
    const newRegions = [...safeData.regions];
    newRegions[regionIndex] = {
      ...newRegions[regionIndex],
      locations: newRegions[regionIndex].locations.filter(
        (_, i) => i !== locIndex
      ),
    };
    onChange({ ...safeData, regions: newRegions });
  };

  const handleUpdateLocation = (regionIndex, locIndex, updatedLocation) => {
    const newRegions = [...safeData.regions];
    newRegions[regionIndex].locations[locIndex] = updatedLocation;
    onChange({ ...safeData, regions: newRegions });
  };

  return (
    <div className="flex animate-[fade-in_0.3s_ease-out] flex-col gap-8">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-100 uppercase">
            Pickup Data Editor
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500 italic">
            Configure pickup loot tables across all regions.
          </p>
        </div>
        <button
          className="rounded-xl bg-blue-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-500 active:scale-95"
          onClick={handleAddRegion}
        >
          + Add New Region
        </button>
      </div>

      <div className="space-y-8">
        {safeData?.regions?.map((region, regionIndex) => (
          <RegionEditor
            key={regionIndex}
            region={region}
            onChange={(updatedRegion) =>
              handleUpdateRegion(regionIndex, updatedRegion)
            }
            onRemove={() => handleRemoveRegion(regionIndex)}
            onAddLocation={() => handleAddLocation(regionIndex)}
            onRemoveLocation={(locIndex) =>
              handleRemoveLocation(regionIndex, locIndex)
            }
            onUpdateLocation={(locIndex, updatedLocation) =>
              handleUpdateLocation(regionIndex, locIndex, updatedLocation)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default PickupEditor;
