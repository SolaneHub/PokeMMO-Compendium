interface Location {
  region: string;
  area: string;
  rarity?: string;
  method?: string;
  type?: string;
  levels?: string | number;
}

interface PokemonLocationsProps {
  locations: Location[];
}

const PokemonLocations = ({ locations }: PokemonLocationsProps) => {
  // Define a consistent grid template for both header and rows
  const gridTemplate = "grid-cols-[70px_70px_1fr_60px_70px]";

  return (
    <div className="flex flex-col gap-2.5 text-white">
      <h4 className="border-b border-white/5 pb-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
        Wild Locations
      </h4>
      {locations && locations.length > 0 ? (
        <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0f1014]">
          {/* Header */}
          <div
            className={`grid ${gridTemplate} border-b border-white/5 bg-white/5 p-2.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase`}
          >
            <div className="text-center">Method</div>
            <div className="text-center">Region</div>
            <div className="text-center">Location</div>
            <div className="text-center">Levels</div>
            <div className="text-center">Rarity</div>
          </div>

          {/* Rows */}
          {locations.map((loc, i) => (
            <div
              key={i}
              className={`grid ${gridTemplate} items-center border-b border-white/5 p-2 transition-colors last:border-b-0 hover:bg-white/10`}
            >
              <div className="flex justify-center">
                <span className="w-14.5 truncate rounded bg-white/10 px-1.5 py-1 text-center text-[10px] capitalize">
                  {loc.method || loc.type || "-"}
                </span>
              </div>
              <div className="text-center text-sm font-semibold">
                {loc.region}
              </div>
              <div className="truncate px-2 text-center text-sm font-medium">
                {loc.area}
              </div>
              <div className="text-center text-sm font-semibold">
                {loc.levels || "-"}
              </div>
              <div className="text-center text-xs font-bold text-amber-500 uppercase">
                {loc.rarity || "-"}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="p-5 text-center text-slate-400 italic">
          No wild locations found.
        </p>
      )}
    </div>
  );
};

export default PokemonLocations;
