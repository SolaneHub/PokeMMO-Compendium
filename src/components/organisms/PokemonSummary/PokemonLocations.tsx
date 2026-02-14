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
  return (
    <div className="flex flex-col gap-2.5 text-white">
      <h4 className="border-b border-white/5 pb-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
        Wild Locations
      </h4>
      {locations && locations.length > 0 ? (
        <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0f1014]">
          <div className="flex border-b border-white/5 bg-white/5 p-2.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            <span className="w-[70px] text-center">Method</span>
            <span className="w-[70px] text-center">Region</span>
            <span className="flex-1 text-center">Location</span>
            <span className="w-[70px] text-center">Levels</span>
            <span className="w-[70px] text-center">Rarity</span>
          </div>
          {locations.map((loc, i) => (
            <div
              key={i}
              className="flex items-center border-b border-white/5 p-2 transition-colors last:border-b-0 hover:bg-white/10"
            >
              <span className="mx-auto w-[58px] shrink-0 truncate rounded bg-white/10 px-1.5 py-1 text-center text-[10px] capitalize">
                {loc.method || loc.type || "-"}
              </span>
              <span className="w-[70px] text-center text-sm font-semibold">
                {loc.region}
              </span>
              <span className="flex-1 text-center text-sm font-medium">
                {loc.area}
              </span>
              <span className="w-[70px] text-center text-sm font-semibold">
                {loc.levels}
              </span>
              <span className="w-[70px] text-center text-xs font-bold text-amber-500 uppercase">
                {loc.rarity}
              </span>
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
