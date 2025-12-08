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
    <div className="bg-[#1e1e1e] border border-[#333] rounded-md shadow-sm border-l-[5px] border-l-blue-500 p-0 overflow-hidden mb-4">
      <div className="bg-[#252526] px-5 py-2.5 flex justify-between items-center border-b border-[#333]">
        <div className="flex items-center gap-2">
          <strong className="text-blue-400 text-[1.1em]">Region:</strong>
          <input
            type="text"
            className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-1 w-48 transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
            value={region.name || ""}
            onChange={(e) => onChange({ ...region, name: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
          {region.note && (
            <span className="text-yellow-300 text-sm">({region.note})</span>
          )}
          <button
            className="bg-red-600 hover:bg-red-700 text-white border-none rounded px-2 py-1 text-xs font-medium cursor-pointer transition-all"
            onClick={onRemove}
          >
            Remove Region
          </button>
        </div>
      </div>
      <div className="p-5">
        <h5 className="text-[#88c0d0] border-b border-[#333] pb-1.5 mb-2.5 font-semibold">
          Locations
        </h5>
        <div className="space-y-4 mb-4">
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
          className="bg-green-600 hover:bg-green-700 text-white border-none rounded px-3 py-1.5 text-sm font-medium cursor-pointer transition-all"
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
    <div className="bg-[#2a2c30] border border-[#444] rounded-md p-4">
      <div className="flex justify-between items-center mb-3 border-b border-gray-600 pb-2">
        <label className="text-slate-300 text-sm font-bold block uppercase">
          Location Name:
        </label>
        <input
          type="text"
          className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-1 w-2/3 transition-colors focus:border-blue-500 focus:bg-[#222] outline-none"
          value={location.name || ""}
          onChange={(e) => onChange({ ...location, name: e.target.value })}
        />
        <button
          className="bg-red-600 hover:bg-red-700 text-white border-none rounded px-2 py-1 text-xs font-medium cursor-pointer transition-all"
          onClick={onRemove}
        >
          Remove Location
        </button>
      </div>

      {Object.entries(location.items || {}).map(([category, items]) => (
        <div key={category} className="mb-3">
          <h6 className="text-sm font-bold text-pink-400 mb-1 capitalize">
            {category.replace(/([A-Z])/g, " $1").trim()}:
          </h6>
          <div className="space-y-1">
            {items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center gap-2">
                <input
                  type="text"
                  className="bg-[#1a1a1a] border border-[#3a3b3d] rounded text-slate-200 px-2.5 py-1 w-full text-sm"
                  value={item}
                  onChange={(e) =>
                    handleItemChange(category, itemIndex, e.target.value)
                  }
                />
                <button
                  className="bg-red-500 hover:bg-red-600 text-white rounded px-2 py-1 text-xs"
                  onClick={() => handleRemoveItem(category, itemIndex)}
                >
                  −
                </button>
              </div>
            ))}
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded px-2 py-1 text-xs mt-1"
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
      locations: newRegions[regionIndex].locations.filter((_, i) => i !== locIndex),
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
      <div className="flex justify-between items-center border-b-2 border-[#ebcb8b] pb-4 mb-5">
        <div>
          <h3 className="m-0 text-lg font-bold text-white">
            🎒 Editor Pickup (Regions)
          </h3>
          <span className="text-[#888] text-sm">
            Gestisci le tabelle di drop per regione e categoria.
          </span>
        </div>
        <button
          className="bg-green-600 hover:bg-green-700 text-white border-none rounded px-4 py-2 text-sm font-medium cursor-pointer transition-all active:translate-y-[1px]"
          onClick={handleAddRegion}
        >
          ➕ Add Region
        </button>
      </div>

      <div className="space-y-6">
        {safeData.regions.map((region, regionIndex) => (
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
