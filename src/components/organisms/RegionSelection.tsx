import RegionCard from "@/components/molecules/RegionCard";
import { pokemonRegions } from "@/utils/regionData";

interface RegionSelectionProps {
  selectedRegion: string | null;
  onRegionClick: (regionName: string) => void;
}

function RegionSelection({
  selectedRegion,
  onRegionClick,
}: RegionSelectionProps) {
  return (
    <div className="animate-[fade-in_0.4s_ease-out] space-y-4">
      <h2 className="text-center text-xl font-semibold text-white">
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
