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
      className={`relative w-40 h-36 bg-slate-800 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 transform 
        ${isSelected ? "ring-2 ring-yellow-400 -translate-y-1 shadow-2xl" : "hover:-translate-y-1 hover:shadow-xl"}
      `}
      onClick={onClick}
    >
      {pokemonName && (
        <p
          className="text-slate-900 font-bold text-sm text-center py-1 px-2 m-0"
          style={{ background: nameBackground }}
        >
          {pokemonName}
        </p>
      )}

      <div className="w-full h-full flex items-center justify-center p-2 bg-slate-700/50">
        {pokemonImageSrc ? (
          <img
            src={pokemonImageSrc}
            alt={pokemonName || "Pokemon"}
            className="w-full h-auto object-contain max-h-24 drop-shadow-md"
            onError={handleImageError}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-4xl text-slate-500 font-bold opacity-30">
            ?
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;
