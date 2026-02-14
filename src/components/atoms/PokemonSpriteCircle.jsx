const PokemonSpriteCircle = ({ spriteUrl, pokemonName }) => {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
      {" "}
      {spriteUrl ? (
        <img
          src={spriteUrl}
          alt={pokemonName || "Pokemon"}
          className="h-full w-full object-contain"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
          {" "}
          ?{" "}
        </div>
      )}{" "}
    </div>
  );
};
export default PokemonSpriteCircle;
