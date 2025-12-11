import RegionCard from "@/shared/components/RegionCard";
import { pokemonRegions } from "@/shared/utils/regionData";

function RegionSelection({ selectedRegion, onRegionClick }) {
  return (
    <div className="animate-[fade-in_0.4s_ease-out] space-y-4">
      <h2 className="text-center text-xl font-semibold text-slate-300">
        Select Region
      </h2>
      <div className="flex flex-wrap justify-center gap-5">
        {pokemonRegions.map((region) => (
          <RegionCard
            key={region.id}
            region={region}
            onRegionClick={() => onRegionClick(region.name)}
            isSelected={selectedRegion === region.name}
          />
        ))}
      </div>
    </div>
  );
}

export default RegionSelection;
