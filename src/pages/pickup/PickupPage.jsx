import { Package } from "lucide-react";
import React, { useState } from "react";

import pickupData from "@/data/pickupData.json";
import TeamBuildModal from "@/pages/elite-four/TeamBuildModal";
import ItemImage from "@/shared/components/ItemImage";
import PageTitle from "@/shared/components/PageTitle";

function PickupPage() {
  const [isPickupPokemonModalOpen, setIsPickupPokemonModalOpen] =
    useState(false);

  const pickupPokemonBuilds = [
    {
      name: "Teddiursa",
      item: "Choice Specs or Choice Band",
      ability: "Pickup",
      nature: "Mild",
      evs: "126 Atk / 252 SpA / 132 Spe",
      ivs: "6x31",
      moves: ["Earthquake", "Hyper Voice", "Sweet Scent"],
    },
    {
      name: "Meowth",
      item: "Silk Scarf",
      ability: "Pickup",
      nature: "Brave",
      evs: "6 HP / 252 Atk / 252 Spe",
      ivs: "6x31",
      moves: ["Pay Day", "Covet", "Hyper Voice", "Fake Out"],
    },
    {
      name: "Munchlax",
      item: "Choice Scarf or Choice Band",
      ability: "Pickup",
      nature: "Adamant",
      evs: "6 HP / 252 Atk / 252 Spe",
      ivs: "5x31",
      moves: ["Pay Day", "Covet", "Earthquake", "Rock Slide"],
    },
    { name: "Pachirisu" },
  ];

  return (
    <div className="container mx-auto space-y-8 pb-24">
      <PageTitle title="PokéMMO Compendium: Pickup" />

      {/* Header */}
      <div className="flex flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <Package className="text-pink-400" size={32} />
          Pickup
        </h1>
        <p className="text-slate-400">
          Find items after battling wild Pokémon.
        </p>
      </div>

      <div className="mb-8 rounded-lg bg-[#1a1b20] p-6 leading-relaxed text-slate-300 shadow-lg">
        <p className="mb-4">
          The <strong className="text-pink-400">Pickup</strong> ability allows a
          Pokémon to randomly find items after defeating wild Pokémon. The items
          found depend on the location and are categorized below.
        </p>
        <p className="mb-4">
          <strong className="text-yellow-400">Note:</strong> The Pokémon with
          Pickup must not be holding an item to pick up a new one. The ability
          activates after any battle where at least one Pokémon on your team has
          Pickup and is not holding an item. Item chances are not explicitly
          provided by the wiki.
        </p>
        <button
          onClick={() => setIsPickupPokemonModalOpen(true)}
          className="mt-4 rounded bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-700"
        >
          Show Pickup Pokémon
        </button>
      </div>

      <div className="space-y-8">
        {pickupData.regions?.map((region, regionIndex) => (
          <div
            key={regionIndex}
            className="rounded-lg bg-[#1a1b20] p-6 shadow-lg"
          >
            <h4 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-bold text-slate-200">
              Region: <span className="text-blue-400">{region.name}</span>
            </h4>
            {region.note && (
              <p className="mb-4 text-yellow-300">{region.note}</p>
            )}

            {region.locations?.length > 0 ? (
              <div className="space-y-6">
                {region.locations?.map((location, locationIndex) => (
                  <div
                    key={locationIndex}
                    className="rounded-md bg-[#1e2025] p-4"
                  >
                    <h5 className="mb-3 border-b border-gray-600 pb-1 text-xl font-semibold text-slate-200">
                      Location:{" "}
                      <span className="text-green-400">{location.name}</span>
                    </h5>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {Object.entries(location.items || {}).map(
                        ([category, items], categoryIndex) =>
                          items?.length > 0 && (
                            <div
                              key={categoryIndex}
                              className="rounded-md bg-[#2a2c30] p-3"
                            >
                              <h6 className="text-md mb-2 font-bold text-pink-400 capitalize">
                                {category.replace(/([A-Z])/g, " $1").trim()}:
                              </h6>
                              <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
                                {items?.map((item, itemIdx) => (
                                  <li
                                    key={itemIdx}
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
        ))}
      </div>

      {isPickupPokemonModalOpen && (
        <TeamBuildModal
          teamName="Pickup Pokémon"
          builds={pickupPokemonBuilds}
          onClose={() => setIsPickupPokemonModalOpen(false)}
        />
      )}
    </div>
  );
}

export default PickupPage;
