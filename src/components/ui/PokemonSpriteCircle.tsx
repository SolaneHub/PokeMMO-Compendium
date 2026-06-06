import { getSpriteUrlByName } from "@/utils/pokemonImageHelper";

interface PokemonSpriteCircleProps {
  spriteUrl?: string | null | undefined;
  pokemonName: string | null | undefined;
}

const PokemonSpriteCircle = ({
  spriteUrl,
  pokemonName,
}: PokemonSpriteCircleProps) => {
  const finalSpriteUrl =
    spriteUrl || (pokemonName ? getSpriteUrlByName(pokemonName) : null);

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
      {finalSpriteUrl ? (
        <img
          src={finalSpriteUrl}
          alt={pokemonName || "Pokemon"}
          className="h-full w-full object-contain"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
          ?
        </div>
      )}
    </div>
  );
};

export default PokemonSpriteCircle;
