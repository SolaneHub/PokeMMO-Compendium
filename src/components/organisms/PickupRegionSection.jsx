import ItemImage from "@/components/atoms/ItemImage";

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
          {region.locations?.map((location) => (
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
                    const categoryGroups = [
                      ["pokeball", "ball"],
                      ["potion", "pozion", "medicine", "healing"],
                      ["repel"],
                      ["misc", "other"],
                    ];
                    const getCategoryIndex = (key) => {
                      const lowerKey = key.toLowerCase();
                      return categoryGroups.findIndex((group) =>
                        group.some((alias) => lowerKey.includes(alias))
                      );
                    };
                    const indexA = getCategoryIndex(a);
                    const indexB = getCategoryIndex(b);
                    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                    if (indexA !== -1) return -1;
                    if (indexB !== -1) return 1;
                    return a.localeCompare(b);
                  })
                  .map(
                    ([category, items]) =>
                      items?.length > 0 && (
                        <div
                          key={category}
                          className="rounded-md bg-white/5 p-3"
                        >
                          <h6 className="text-md mb-2 font-bold text-blue-400 capitalize">
                            {category.replace(/([A-Z])/g, " $1").trim()}:
                          </h6>
                          <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
                            {items?.map((item, itemIdx) => (
                              <li
                                key={`${category}-${item}-${itemIdx}`}
                                className="flex items-center gap-2"
                              >
                                <ItemImage
                                  itemName={item}
                                  className="h-4 w-4"
                                />
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
