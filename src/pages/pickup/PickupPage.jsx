import { Package } from "lucide-react";
import { useState } from "react";

import PickupInfoSection from "@/components/molecules/PickupInfoSection";
import PickupRegionSection from "@/components/organisms/PickupRegionSection";
import TeamBuildModal from "@/components/organisms/TeamBuildModal";
import PageTitle from "@/components/atoms/PageTitle";
import { pickupPokemonBuilds } from "@/constants/pickupBuilds";
import { usePickupData } from "@/hooks/usePickupData";
import { usePokedexData } from "@/hooks/usePokedexData";
import { FEATURE_CONFIG } from "@/utils/featureConfig";

function PickupPage() {
  const accentColor = FEATURE_CONFIG.pickup.color;
  const [isPickupPokemonModalOpen, setIsPickupPokemonModalOpen] =
    useState(false);

  const { pokemonMap, isLoading: isLoadingPokedex } = usePokedexData();
  const { regions, isLoading: isLoadingPickup } = usePickupData();

  if (isLoadingPokedex || isLoadingPickup) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 animate-[fade-in_0.3s_ease-out] flex-col overflow-x-hidden overflow-y-auto scroll-smooth p-4 lg:p-8">
      <div className="container mx-auto w-full flex-1 space-y-8 pb-24">
        <PageTitle title="PokéMMO Compendium: Pickup" />

        {/* Header Section */}
        <div className="mb-8 flex flex-col items-center space-y-2 text-center">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-100">
            <Package style={{ color: accentColor }} size={32} />
            Pickup Guide
          </h1>
          <p className="text-slate-400">
            Find items after battling wild Pokémon across all regions.
          </p>
        </div>

        <PickupInfoSection
          onOpenModal={() => setIsPickupPokemonModalOpen(true)}
        />

        <div className="space-y-8">
          {regions?.map((region, regionIndex) => (
            <PickupRegionSection key={regionIndex} region={region} />
          ))}
        </div>

        {isPickupPokemonModalOpen && pokemonMap && (
          <TeamBuildModal
            teamName="Pickup Pokémon"
            builds={pickupPokemonBuilds}
            onClose={() => setIsPickupPokemonModalOpen(false)}
            pokemonMap={pokemonMap}
          />
        )}
      </div>
    </div>
  );
}

export default PickupPage;
