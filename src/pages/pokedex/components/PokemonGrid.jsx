import { useEffect, useRef, useState } from "react";

import PokemonCard from "@/shared/components/PokemonCard";
import { getPokemonBackground } from "@/shared/utils/pokemonHelpers";
import { getSpriteUrlByName } from "@/shared/utils/pokemonImageHelper";

const PAGE_SIZE = 40;

const PokemonGrid = ({ pokemonList, selectedPokemon, onSelectPokemon }) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!pokemonList) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, pokemonList.length)
          );
        }
      },
      {
        root: null,
        rootMargin: "400px",
        threshold: 0.1,
      }
    );

    const current = loadMoreRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [pokemonList]);

  if (!pokemonList || pokemonList.length === 0) {
    return (
      <p className="mt-10 text-center text-xl text-slate-400">
        No Pokémon found.
      </p>
    );
  }

  const visiblePokemon = pokemonList.slice(0, visibleCount);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-[1400px] flex-wrap justify-center gap-5">
        {visiblePokemon.map((pokemon, index) => {
          const sprite = pokemon.sprite || getSpriteUrlByName(pokemon.name);
          const background = getPokemonBackground(pokemon);

          return (
            <PokemonCard
              key={`${pokemon.name}-${index}`}
              pokemonName={pokemon.name}
              pokemonImageSrc={sprite}
              nameBackground={background}
              onClick={() => onSelectPokemon(pokemon)}
              isSelected={selectedPokemon?.name === pokemon.name}
            />
          );
        })}
      </div>

      {visibleCount < pokemonList.length && (
        <div
          ref={loadMoreRef}
          className="mt-10 h-20 w-full text-center text-slate-500"
        >
          Loading more Pokémon...
        </div>
      )}
    </div>
  );
};

export default PokemonGrid;
