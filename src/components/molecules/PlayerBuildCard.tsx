import ItemImage from "@/components/atoms/ItemImage";
import { getPokemonCardData } from "@/services/pokemonService";
import { Pokemon } from "@/types/pokemon";

interface Build {
  name: string;
  item?: string;
  ability?: string;
  nature?: string;
  evs?: string;
  ivs?: string;
  moves?: string[];
}

interface PlayerBuildCardProps {
  build: Build;
  pokemonMap: Map<string, Pokemon>;
}

const PlayerBuildCard = ({ build, pokemonMap }: PlayerBuildCardProps) => {
  const { sprite } = getPokemonCardData(build.name, pokemonMap);
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-white/5 bg-[#0f1014] text-white shadow-sm transition-colors hover:border-white/20">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/5 p-2.5">
        <div className="flex items-center gap-3">
          <img
            src={sprite || ""}
            alt={build.name}
            className="h-10 w-10 object-contain drop-shadow-md"
          />
          <span className="text-sm font-bold">{build.name}</span>
        </div>
        {build.item && (
          <span className="flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs">
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
          <span>
            Ability: <strong className="ml-1">{build.ability}</strong>
          </span>
        )}
        {build.nature && (
          <span>
            Nature: <strong className="ml-1">{build.nature}</strong>
          </span>
        )}
        {build.evs && (
          <span>
            EVs: <strong className="ml-1">{build.evs}</strong>
          </span>
        )}
        {build.ivs && (
          <span>
            IVs: <strong className="ml-1">{build.ivs}</strong>
          </span>
        )}
      </div>
      {build.moves && build.moves.length > 0 && (
        <div className="flex flex-wrap gap-1.5 bg-[#0f1014] p-2.5">
          {build.moves.map((m, k) => (
            <span
              key={k}
              className="rounded border border-white/5 bg-white/5 px-1.5 py-0.5 text-xs"
            >
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerBuildCard;
