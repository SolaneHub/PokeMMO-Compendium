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
    <div className="mb-4 overflow-hidden rounded-md border border-l-[5px] border-[#333] border-l-blue-500 bg-[#1e1e1e] p-0 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#333] bg-[#252526] px-5 py-2.5">
        <div className="flex items-center gap-2">
          <strong className="text-[1.1em] text-blue-400">Region:</strong>
          <input
            type="text"
            className="w-48 rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-1 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
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
    <div className="rounded-md border border-[#444] bg-[#2a2c30] p-4">
      <div className="mb-3 flex items-center justify-between border-b border-gray-600 pb-2">
        <label className="block text-sm font-bold text-slate-300 uppercase">
          Location Name:
        </label>
        <input
          type="text"
          className="w-2/3 rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-1 text-slate-200 transition-colors outline-none focus:border-blue-500 focus:bg-[#222]"
          value={location.name || ""}
          onChange={(e) => onChange({ ...location, name: e.target.value })}
        />
        <button
          className="cursor-pointer rounded border-none bg-red-600 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-red-700"
          onClick={onRemove}
        >
          Remove Location
        </button>
      </div>

      {Object.entries(location.items || {}).map(([category, items]) => (
        <div key={category} className="mb-3">
          <h6 className="mb-1 text-sm font-bold text-pink-400 capitalize">
            {category.replace(/([A-Z])/g, " $1").trim()}:
          </h6>
          <div className="space-y-1">
            {items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center gap-2">
                <input
                  type="text"
                  className="w-full rounded border border-[#3a3b3d] bg-[#1a1a1a] px-2.5 py-1 text-sm text-slate-200"
                  value={item}
                  onChange={(e) =>
                    handleItemChange(category, itemIndex, e.target.value)
                  }
                />
                <button
                  className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                  onClick={() => handleRemoveItem(category, itemIndex)}
                >
                  −
                </button>
              </div>
            ))}
            <button
              className="mt-1 rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
              onClick={() => handleAddItem(category)}
            >
              Add Item
            </button>
          </div>
        </div>
      ))}
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
    const newRegions = safeData.regions.filter((_, i) => i !== regionIndex);
    onChange({ ...safeData, regions: newRegions });
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
          pokeballs: [],
          potions: [],
          repellents: [],
          berries: [],
          seeds: [],
          misc: [],
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
    <div>
      <title>Editor: Pickup</title>
      <div className="mb-5 flex items-center justify-between border-b-2 border-[#ebcb8b] pb-4">
        <div>
          <h3 className="m-0 text-lg font-bold text-white">
            🎒 Editor Pickup (Regions)
          </h3>
          <span className="text-sm text-[#888]">
            Manage drop tables by region and category.
          </span>
        </div>
        <button
          className="cursor-pointer rounded border-none bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 active:translate-y-[1px]"
          onClick={handleAddRegion}
        >
          ➕ Add Region
        </button>
      </div>

      <div className="space-y-6">
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
