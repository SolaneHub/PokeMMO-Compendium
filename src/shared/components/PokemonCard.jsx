const PokemonCard = ({
  pokemonName,
  pokemonImageSrc,
  nameBackground,
  onClick,
  isSelected,
}) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = `https://placehold.co/80x80/cccccc/333333?text=?`;
  };

  return (
    <div
      className={`group relative w-40 cursor-pointer overflow-hidden rounded-2xl border bg-[#1a1b20] transition-all duration-300 ${
        isSelected
          ? "z-10 scale-105 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          : "border-white/5 hover:-translate-y-1 hover:border-white/20 hover:bg-white/5 hover:shadow-xl"
      } `}
      onClick={onClick}
    >
      {pokemonName && (
        <div
          className="px-2 py-1.5 text-center"
          style={{ background: nameBackground }}
        >
          <p className="m-0 truncate text-sm font-bold text-[#1a1b20]">
            {pokemonName}
          </p>
        </div>
      )}

      <div className="flex h-32 w-full items-center justify-center p-4">
        {pokemonImageSrc ? (
          <img
            src={pokemonImageSrc}
            alt={pokemonName || "Pokemon"}
            className="h-full w-full object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
            onError={handleImageError}
          />
        ) : (
          <div className="text-4xl font-bold text-slate-600 opacity-30">?</div>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;
