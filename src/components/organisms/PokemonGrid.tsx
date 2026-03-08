import { useEffect, useRef, useState } from "react";

import PokemonCard from "@/components/molecules/PokemonCard";
import { Pokemon } from "@/types/pokemon";
import { getPokemonBackgroundStyle } from "@/utils/pokemonColors";
import { getSpriteUrlByName } from "@/utils/pokemonImageHelper";

const PAGE_SIZE = 40;

interface PokemonGridProps {
  readonly pokemonList: Pokemon[];
  readonly selectedPokemon: Pokemon | null;
  readonly onSelectPokemon: (pokemon: Pokemon) => void;
  readonly isPending?: boolean;
}

const PokemonGrid = ({
  pokemonList = [],
  selectedPokemon,
  onSelectPokemon,
  isPending = false,
}: PokemonGridProps) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pokemonList || pokemonList.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, pokemonList.length)
          );
        }
      },
      { root: null, rootMargin: "400px", threshold: 0.1 }
    );

    const current = loadMoreRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [pokemonList]);

  if (pokemonList?.length === 0) {
    return (
      <p className="mt-10 text-center text-xl text-white">No Pokémon found.</p>
    );
  }

  const visiblePokemon = (pokemonList || []).slice(0, visibleCount);

  return (
    <div className="flex w-full flex-col items-center">
      <div
        className={`flex w-full flex-wrap justify-center gap-5 transition-opacity duration-200 ${
          isPending ? "opacity-50" : "opacity-100"
        }`}
      >
        {visiblePokemon.map((pokemon, index) => {
          const sprite = getSpriteUrlByName(pokemon.name);
          const background = getPokemonBackgroundStyle(pokemon.types || []);

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
