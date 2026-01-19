import ItemImage from "@/shared/components/ItemImage";

const PickupRegionSection = ({ region }) => {
  return (
    <div className="rounded-lg border border-white/5 bg-[#1a1b20] p-6 shadow-lg">
      <h4 className="mb-4 border-b border-white/5 pb-2 text-2xl font-bold text-slate-200">
        Region: <span className="text-blue-400">{region.name}</span>
      </h4>
      {region.note && (
        <p className="mb-4 font-medium text-yellow-500/90">{region.note}</p>
      )}

      {region.locations?.length > 0 ? (
        <div className="space-y-6">
          {region.locations?.map((location, locationIndex) => (
            <div
              key={location.name}
              className="rounded-md border border-white/5 bg-[#0f1014] p-4"
            >
              <h5 className="mb-3 border-b border-white/5 pb-1 text-xl font-semibold text-slate-200">
                Location:{" "}
                <span className="text-green-400">{location.name}</span>
              </h5>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Object.entries(location.items || {})
                  .sort(([a], [b]) => {
                    // Define the order with aliases for broader matching
                    const categoryGroups = [
                      ["pokeball", "ball"], // 1. Pokeballs
                      ["potion", "pozion", "medicine", "healing"], // 2. Potions
                      ["repel"], // 3. Repels
                      ["misc", "other"], // 4. Misc
                    ];

                    const getCategoryIndex = (key) => {
                      const lowerKey = key.toLowerCase();
                      return categoryGroups.findIndex((group) =>
                        group.some((alias) => lowerKey.includes(alias))
                      );
                    };

                    const indexA = getCategoryIndex(a);
                    const indexB = getCategoryIndex(b);

                    // If both are found in the predefined groups
                    if (indexA !== -1 && indexB !== -1) {
                      return indexA - indexB;
                    }

                    // If only A is found, it comes first (unless it's Misc which is last in our list anyway)
                    // Actually, if A is found (e.g. Repels) and B is not (Unknown), A should come first?
                    // The requirement implies everything else is likely Misc or handled.
                    // If 'misc' is in the group, it has index 3.
                    // If an unknown key appears, let's treat it as "after everything else" or "misc".

                    if (indexA !== -1) return -1; // A is a known category, B is unknown -> A first
                    if (indexB !== -1) return 1; // B is a known category, A is unknown -> B first

                    // Both unknown, sort alphabetically
                    return a.localeCompare(b);
                  })
                  .map(([category, items]) =>
                    items?.length > 0 && (
                      <div key={category} className="rounded-md bg-white/5 p-3">
                        <h6 className="text-md mb-2 font-bold text-blue-400 capitalize">
                          {category.replace(/([A-Z])/g, " $1").trim()}:
                        </h6>
                        <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
                          {items?.map((item, itemIdx) => (
                            <li
                              key={`${category}-${item}-${itemIdx}`}
                              className="flex items-center"
                            >
                              <ItemImage item={item} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400">
          No specific pickup data available for this region.
        </p>
      )}
    </div>
  );
};

export default PickupRegionSection;
