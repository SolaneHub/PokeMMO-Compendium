import { useEffect, useState } from "react";

import { getPokemonCardData } from "@/pages/pokedex/data/pokemonService";
import ItemImage from "@/shared/components/ItemImage";

const BuildCard = ({ buildData, pokemonMap }) => {
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
    : { sprite: "" };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-white/5 bg-[#0f1014] shadow-sm transition-colors hover:border-white/20">
      {allVariants.length > 1 && (
        <div className="scrollbar-hide flex overflow-x-auto border-b border-white/5 bg-[#0f1014]">
          {allVariants.map((variant, idx) => (
            <button
              key={idx}
              className={`flex-1 cursor-pointer border-r border-none border-white/5 bg-transparent px-2.5 py-2 text-xs font-bold whitespace-nowrap text-slate-500 uppercase transition-colors last:border-r-0 hover:bg-white/5 hover:text-slate-200 ${activeBuild.name === variant.name ? "bg-white/5 text-blue-400 shadow-[inset_0_-2px_0_#2563eb]" : ""}`}
              onClick={() => setActiveBuild(variant)}
            >
              {variant.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-b border-white/5 bg-white/5 p-2.5">
        <div className="flex items-center gap-3">
          <img
            src={sprite}
            alt={activeBuild.name}
            className="h-10 w-10 object-contain drop-shadow-md"
          />
          <div className="flex flex-col">
            <span className="text-sm leading-tight font-bold text-slate-200">
              {activeBuild.name}
            </span>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs font-bold uppercase">
              {activeBuild.order && (
                <span className="text-yellow-500/90">
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

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-b border-white/5 bg-white/[0.02] px-2.5 py-1.5 text-xs">
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
        <div className="flex flex-wrap gap-1.5 bg-[#0f1014] p-2.5">
          {activeBuild.moves.map((m, k) => (
            <span
              key={k}
              className="rounded border border-white/5 bg-white/5 px-1.5 py-0.5 text-xs text-slate-300"
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
