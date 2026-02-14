import InfoCard from "@/components/molecules/InfoCard";
import { Pokemon } from "@/types/pokemon";

interface PokemonOverviewProps {
  pokemon: Pokemon;
}

const PokemonOverview = ({ pokemon }: PokemonOverviewProps) => {
  return (
    <div className="flex flex-col gap-5 text-white">
      <div className="flex flex-col gap-2.5">
        <p className="m-0 rounded-lg border-l-4 border-blue-600 bg-white/5 p-3 text-sm leading-relaxed text-slate-300 italic">
          {pokemon.description}
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <h4 className="border-b border-white/5 pb-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
          Abilities
        </h4>
        <div className="flex gap-2.5">
          {pokemon.abilities?.main?.map((a) => (
            <div
              key={a}
              className="flex-1 rounded-md border border-white/5 bg-[#0f1014] p-2 text-center text-sm"
            >
              {a}
            </div>
          ))}
          {pokemon.abilities?.hidden && (
            <div className="flex-1 rounded-md border border-red-500/50 bg-red-900/10 p-2 text-center text-sm">
              {pokemon.abilities.hidden}
              <small className="mt-0.5 block text-[10px] text-slate-400">
                Hidden
              </small>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <h4 className="border-b border-white/5 pb-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
          Breeding & Size
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <InfoCard label="Height" value={pokemon.height} />
          <InfoCard label="Weight" value={pokemon.weight} />
          <InfoCard
            label="Egg Group"
            value={
              Array.isArray(pokemon.eggGroups)
                ? pokemon.eggGroups.join(", ")
                : pokemon.eggGroups
            }
          />
          <div className="flex flex-col justify-center rounded-lg border border-white/10 bg-white/5 p-2.5">
            <span className="mb-1 text-[10px] font-bold text-slate-400 uppercase">
              Gender
            </span>
            <span className="flex gap-2 text-sm font-semibold">
              <span className="text-blue-400">{pokemon.genderRatio?.m}% ♂</span>
              <span className="text-red-400">{pokemon.genderRatio?.f}% ♀</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <h4 className="border-b border-white/5 pb-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
          Training
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <InfoCard label="Catch Rate" value={pokemon.catchRate} />
          <InfoCard label="Base Exp" value={pokemon.baseExp} />
          <InfoCard label="Growth Rate" value={pokemon.growthRate} />
          <InfoCard
            label="EV Yield"
            value={pokemon.evYield}
            valueClass="text-yellow-200"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <h4 className="border-b border-white/5 pb-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
          Other Details
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <InfoCard
            label="Held Item"
            value={
              Array.isArray(pokemon.heldItems) &&
              (pokemon.heldItems as string[]).length > 0
                ? (pokemon.heldItems as string[]).join(", ")
                : (pokemon.heldItems as string) || "None"
            }
          />
          <InfoCard label="PvP Tier" value={pokemon.tier} />
        </div>
      </div>
    </div>
  );
};

export default PokemonOverview;
