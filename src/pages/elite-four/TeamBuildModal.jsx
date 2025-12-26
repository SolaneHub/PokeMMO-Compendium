import React from "react";

import { getPokemonCardData } from "@/pages/pokedex/data/pokemonService";
import ItemImage from "@/shared/components/ItemImage";

function PlayerBuildCard({ build, pokemonMap }) {
  // Accept pokemonMap here
  const { sprite } = getPokemonCardData(build.name, pokemonMap); // Pass pokemonMap here

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-white/5 bg-[#0f1014] shadow-sm transition-colors hover:border-white/20">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/5 p-2.5">
        <div className="flex items-center gap-3">
          <img
            src={sprite}
            alt={build.name}
            className="h-10 w-10 object-contain drop-shadow-md"
          />
          <span className="text-sm font-bold text-slate-200">{build.name}</span>
        </div>

        {build.item && (
          <span className="flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300">
            <ItemImage
              item={build.item}
              className="mr-1.5 h-5 w-5 object-contain"
            />
            {build.item}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-b border-white/5 bg-white/[0.02] px-2.5 py-1.5 text-xs">
        {build.ability && (
          <span className="text-slate-400">
            Ability:{" "}
            <strong className="ml-1 text-slate-200">{build.ability}</strong>
          </span>
        )}
        {build.nature && (
          <span className="text-slate-400">
            Nature:{" "}
            <strong className="ml-1 text-slate-200">{build.nature}</strong>
          </span>
        )}
        {build.evs && (
          <span className="text-slate-400">
            EVs: <strong className="ml-1 text-slate-200">{build.evs}</strong>
          </span>
        )}
      </div>

      {build.moves && (
        <div className="flex flex-wrap gap-1.5 bg-[#0f1014] p-2.5">
          {build.moves.map((m, k) => (
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
}

export default function TeamBuildModal({
  teamName,
  builds,
  onClose,
  pokemonMap,
}) {
  // Accept pokemonMap here
  if (!builds || builds.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex animate-[fade-in_0.3s_ease-out_forwards] items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-[480px] animate-[scale-in_0.4s_ease-out_forwards] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1a1b20] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="z-10 flex flex-col border-b border-white/5 bg-white/5 p-4 shadow-md">
          <h2 className="m-0 text-xl font-bold text-slate-100 drop-shadow-md">
            {teamName} Setup
          </h2>
          <p className="m-0 text-sm text-slate-400 opacity-80">
            Player Team Configuration
          </p>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#1a1b20] p-4">
          <div className="flex animate-[fade-in_0.3s_ease-out_forwards] flex-col gap-3">
            {builds.map((build, idx) => (
              <PlayerBuildCard
                key={idx}
                build={build}
                pokemonMap={pokemonMap}
              /> // Pass pokemonMap here
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
