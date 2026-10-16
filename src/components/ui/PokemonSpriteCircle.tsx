import { useEffect, useState } from "react";

import { getSpriteUrlByName } from "@/utils/pokemonImageHelper";

interface PokemonSpriteCircleProps {
  spriteUrl?: string | null | undefined;
  pokemonName: string | null | undefined;
}

const PokemonSpriteCircle = ({
  spriteUrl,
  pokemonName,
}: PokemonSpriteCircleProps) => {
  const [hasError, setHasError] = useState(false);
  const finalSpriteUrl =
    spriteUrl || (pokemonName ? getSpriteUrlByName(pokemonName) : null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasError(false);
  }, [finalSpriteUrl]);

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
      {finalSpriteUrl && !hasError ? (
        <img
          src={finalSpriteUrl}
          alt={pokemonName || "Pokemon"}
          className="h-full w-full object-contain"
          onError={() => setHasError(true)}
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
