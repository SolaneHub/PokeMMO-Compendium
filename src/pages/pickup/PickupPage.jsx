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
    { name: "Teddiursa" },
    { name: "Meowth" },
    { name: "Aipom" },
    { name: "Phanpy" },
    { name: "Zigzagoon" },
    { name: "Linoone" },
    { name: "Pachirisu" },
    { name: "Ambipom" },
    { name: "Munchlax" },
    { name: "Lillipup" },
  ];

  return (
    <div className="container mx-auto pb-24 space-y-8">
      <PageTitle title="PokéMMO Compendium: Pickup" />

      {/* Header */}
      <div className="flex flex-col items-center space-y-2 text-center">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Package className="text-pink-400" size={32} />
          Pickup
        </h1>
        <p className="text-slate-400">
          Find items after battling wild Pokémon.
        </p>
      </div>

      <div className="bg-[#1a1b20] p-6 rounded-lg shadow-lg mb-8 text-slate-300 leading-relaxed">
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
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Show Pickup Pokémon
        </button>
      </div>

      <div className="space-y-8">
        {pickupData.regions?.map((region, regionIndex) => (
          <div
            key={regionIndex}
            className="bg-[#1a1b20] p-6 rounded-lg shadow-lg"
          >
            <h4 className="text-2xl font-bold text-slate-200 mb-4 border-b border-gray-700 pb-2">
              Region: <span className="text-blue-400">{region.name}</span>
            </h4>
            {region.note && (
              <p className="text-yellow-300 mb-4">{region.note}</p>
            )}

            {region.locations?.length > 0 ? (
              <div className="space-y-6">
                {region.locations?.map((location, locationIndex) => (
                  <div
                    key={locationIndex}
                    className="bg-[#1e2025] p-4 rounded-md"
                  >
                    <h5 className="text-xl font-semibold text-slate-200 mb-3 border-b border-gray-600 pb-1">
                      Location:{" "}
                      <span className="text-green-400">{location.name}</span>
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Object.entries(location.items || {}).map(
                        ([category, items], categoryIndex) =>
                          items?.length > 0 && (
                            <div
                              key={categoryIndex}
                              className="bg-[#2a2c30] p-3 rounded-md"
                            >
                              <h6 className="text-md font-bold text-pink-400 mb-2 capitalize">
                                {category.replace(/([A-Z])/g, " $1").trim()}:
                              </h6>
                              <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
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
