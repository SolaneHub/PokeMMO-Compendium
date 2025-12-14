import { useEffect, useState } from "react";

import { getPokemonCardData } from "@/pages/pokedex/data/pokemonService";
import ItemImage from "@/shared/components/ItemImage";

const BuildCard = ({ buildData, pokemonMap }) => {
  // Accept pokemonMap here
  const [activeBuild, setActiveBuild] = useState(buildData);

  const allVariants = (() => {
    if (!buildData.variants) return [buildData];
    const inheritedVariants = buildData.variants.map((variant) => ({
      ...variant,
      player: variant.player || buildData.player,
      order: variant.order || buildData.order,
      turn: variant.turn || buildData.turn,
    }));
    return [buildData, ...inheritedVariants];
  })();

  if (activeBuild.name !== buildData.name && !buildData.variants) {
    setActiveBuild(buildData);
  }

  useEffect(() => {
    setActiveBuild(buildData);
  }, [buildData]);

  const { sprite } = pokemonMap
    ? getPokemonCardData(activeBuild.name, pokemonMap)
    : { sprite: "" }; // Pass pokemonMap here

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-slate-700 bg-neutral-900 shadow-sm transition-colors hover:border-slate-500">
      {allVariants.length > 1 && (
        <div className="scrollbar-hide flex overflow-x-auto border-b border-slate-700 bg-neutral-900">
          {allVariants.map((variant, idx) => (
            <button
              key={idx}
              className={`flex-1 cursor-pointer border-r border-none border-slate-700 bg-transparent px-2.5 py-2 text-xs font-bold whitespace-nowrap text-slate-500 uppercase transition-colors last:border-r-0 hover:bg-slate-800 hover:text-slate-300 ${activeBuild.name === variant.name ? "bg-slate-800 text-blue-500 shadow-[inset_0_-2px_0_#3b82f6]" : ""}`}
              onClick={() => setActiveBuild(variant)}
            >
              {variant.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 p-2.5">
        <div className="flex items-center gap-3">
          <img
            src={sprite}
            alt={activeBuild.name}
            className="h-10 w-10 object-contain drop-shadow-md"
          />
          <div className="flex flex-col">
            <span className="text-sm leading-tight font-bold text-white">
              {activeBuild.name}
            </span>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs font-bold uppercase">
              {activeBuild.order && (
                <span className="text-yellow-400">
                  Pokemon {activeBuild.order}
                </span>
              )}
            </div>
          </div>
        </div>

        {activeBuild.item && (
          <span className="ml-auto flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300">
            <ItemImage
              item={activeBuild.item}
              className="mr-1.5 h-5 w-5 object-contain"
            />
            {activeBuild.item}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5 border-b border-slate-700 bg-neutral-800 px-2.5 py-1.5 text-xs">
        {activeBuild.ability && (
          <span className="text-slate-400">
            Ability:{" "}
            <strong className="ml-1 text-slate-200">
              {activeBuild.ability}
            </strong>
          </span>
        )}
        {activeBuild.nature && (
          <span className="text-slate-400">
            Nature:{" "}
            <strong className="ml-1 text-slate-200">
              {activeBuild.nature}
            </strong>
          </span>
        )}
        {activeBuild.evs && (
          <span className="text-slate-400">
            EVs:{" "}
            <strong className="ml-1 text-slate-200">{activeBuild.evs}</strong>
          </span>
        )}
        {activeBuild.ivs && (
          <span className="text-slate-400">
            IVs:{" "}
            <strong className="ml-1 text-slate-200">{activeBuild.ivs}</strong>
          </span>
        )}
      </div>

      {activeBuild.moves && (
        <div className="flex flex-wrap gap-1.5 bg-neutral-900 p-2.5">
          {activeBuild.moves.map((m, k) => (
            <span
              key={k}
              className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-xs text-slate-300"
            >
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
export default BuildCard;
