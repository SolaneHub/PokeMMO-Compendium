import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

import { Pokemon } from "@/types/pokemon";
import { getPokemonCardData } from "@/utils/pokemonHelpers";

interface PokemonEvolutionsProps {
  pokemon: Pokemon;
  allPokemon: Pokemon[];
  onSelectPokemon: (pokemon: Pokemon) => void;
  variants: string[];
}

interface EvolutionItemProps {
  name: string;
  method?: string | number;
  isCurrent: boolean;
}

const PokemonEvolutions = ({
  pokemon,
  allPokemon,
  onSelectPokemon,
  variants,
}: PokemonEvolutionsProps) => {
  const EvolutionItem = ({ name, method, isCurrent }: EvolutionItemProps) => {
    const evoObj = allPokemon.find((p) => p.name === name);
    if (!evoObj) return null;
    const cardData = getPokemonCardData(evoObj);

    return (
      <div
        className={`group flex min-w-[90px] flex-1 cursor-pointer flex-col items-center gap-2 rounded-xl p-2 transition-all ${
          isCurrent
            ? "bg-blue-600/10 ring-1 ring-blue-500/50"
            : "hover:bg-white/5"
        }`}
        onClick={() => !isCurrent && onSelectPokemon(evoObj)}
      >
        <div
          className={`relative flex h-20 w-20 items-center justify-center rounded-full border transition-transform group-hover:scale-110 ${
            isCurrent
              ? "border-blue-500 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              : "border-white/10 bg-black/40 shadow-inner"
          }`}
        >
          <img
            src={cardData.sprite || ""}
            alt={name}
            className="h-14 w-14 object-contain drop-shadow-md"
          />
          {isCurrent && (
            <div className="absolute -top-1 -right-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-lg">
              ★
            </div>
          )}
        </div>
        <div className="flex flex-col items-center text-center">
          <span
            className={`text-xs font-bold ${isCurrent ? "text-blue-400" : "text-slate-200"}`}
          >
            {name}
          </span>
          <span className="text-[10px] font-medium tracking-tighter text-slate-500 uppercase">
            {method || "Base"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 py-2 text-white">
      {/* Evolution Tree */}
      <div className="flex flex-col gap-2.5">
        <h4 className="border-b border-white/5 pb-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
          Evolution Tree
        </h4>
        {pokemon.evolutions && pokemon.evolutions.length > 0 ? (
          <div className="scrollbar-hide flex items-center justify-between gap-1 overflow-x-auto rounded-2xl border border-white/5 bg-black/20 p-4">
            {pokemon.evolutions.map((evo, index) => (
              <Fragment key={evo.name}>
                <EvolutionItem
                  name={evo.name}
                  method={evo.level}
                  isCurrent={evo.name === pokemon.name}
                />
                {index < pokemon.evolutions.length - 1 && (
                  <div className="flex shrink-0 items-center justify-center text-slate-700">
                    <ChevronRight size={18} strokeWidth={3} />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500 italic">
            No evolution data found for this Pokémon.
          </div>
        )}
      </div>

      {/* Alternative Forms */}
      {variants && variants.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <h4 className="border-b border-white/5 pb-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            Alternative Forms
          </h4>
          <div className="scrollbar-hide flex items-center gap-3 overflow-x-auto p-1">
            {variants.map((variantName) => {
              const variantObj = allPokemon.find((p) => p.name === variantName);
              if (!variantObj) return null;
              const cardData = getPokemonCardData(variantObj);
              return (
                <div
                  key={variantName}
                  className="group flex cursor-pointer flex-col items-center gap-2"
                  onClick={() => onSelectPokemon(variantObj)}
                >
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2 transition-all hover:border-purple-500 hover:bg-purple-500/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <img
                      src={cardData.sprite || ""}
                      alt={variantName}
                      className="h-12 w-12 object-contain transition-transform group-hover:scale-110"
                    />
                  </div>
                  <span className="max-w-[70px] truncate text-[10px] font-semibold text-slate-400 group-hover:text-slate-200">
                    {variantName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonEvolutions;
