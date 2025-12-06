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
      className={`relative w-40 bg-[#1e2025] border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group
        ${
          isSelected
            ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-105 z-10"
            : "border-white/5 hover:border-white/20 hover:bg-[#25272e] hover:-translate-y-1 hover:shadow-xl"
        }
      `}
      onClick={onClick}
    >
      {pokemonName && (
        <div
          className="py-1.5 px-2 text-center"
          style={{ background: nameBackground }}
        >
          <p className="text-[#1a1b20] font-bold text-sm m-0 truncate">
            {pokemonName}
          </p>
        </div>
      )}

      <div className="w-full h-32 flex items-center justify-center p-4">
        {pokemonImageSrc ? (
          <img
            src={pokemonImageSrc}
            alt={pokemonName || "Pokemon"}
            className="w-full h-full object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
            onError={handleImageError}
          />
        ) : (
          <div className="text-4xl text-slate-600 font-bold opacity-30">?</div>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;
