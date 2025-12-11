const PickupInfoSection = ({ onOpenModal }) => {
  return (
    <div className="mb-8 rounded-lg bg-[#1a1b20] p-6 leading-relaxed text-slate-300 shadow-lg">
      <p className="mb-4">
        The <strong className="text-pink-400">Pickup</strong> ability allows a
        Pokémon to randomly find items after defeating wild Pokémon. The items
        found depend on the location and are categorized below.
      </p>
      <p className="mb-4">
        <strong className="text-yellow-400">Note:</strong> The Pokémon with
        Pickup must not be holding an item to pick up a new one. The ability
        activates after any battle where at least one Pokémon on your team has
        Pickup and is not holding an item. Item chances are not explicitly
        provided by the wiki.
      </p>
      <button
        onClick={onOpenModal}
        className="mt-4 rounded bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-700"
      >
        Show Pickup Pokémon
      </button>
    </div>
  );
};

export default PickupInfoSection;
