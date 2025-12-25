import { Package } from "lucide-react";
import React, { useState } from "react";

import TeamBuildModal from "@/pages/elite-four/TeamBuildModal";
import PickupInfoSection from "@/pages/pickup/components/PickupInfoSection";
import PickupRegionSection from "@/pages/pickup/components/PickupRegionSection";
import { pickupPokemonBuilds } from "@/pages/pickup/data/pickupBuilds";
import PageTitle from "@/shared/components/PageTitle";
import { usePickupData } from "@/shared/hooks/usePickupData";
import { usePokedexData } from "@/shared/hooks/usePokedexData"; // Import usePokedexData

function PickupPage() {
  const [isPickupPokemonModalOpen, setIsPickupPokemonModalOpen] =
    useState(false);

  const { pokemonMap, isLoading: isLoadingPokedex } = usePokedexData(); // Destructure pokemonMap and isLoading
  const { regions, isLoading: isLoadingPickup } = usePickupData();

  if (isLoadingPokedex || isLoadingPickup) {
    // Handle loading state for Pokedex data
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 pb-24">
      <PageTitle title="PokéMMO Compendium: Pickup" />

      {/* Header */}
      <div className="flex flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <Package className="text-blue-400" size={32} />
          Pickup
        </h1>
        <p className="text-slate-400">
          Find items after battling wild Pokémon.
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
          pokemonMap={pokemonMap} // Pass pokemonMap
        />
      )}
    </div>
  );
}

export default PickupPage;
