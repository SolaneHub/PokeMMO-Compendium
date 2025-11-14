import { raidsData } from "@/pages/raids/data/raidsData";
import { useCallback, useState } from "react";
import {
    generateDualTypeGradient,
    getPrimaryColor,
    typeBackgrounds,
} from "@/shared/utils/pokemonColors";
import { pokemonData } from "@/shared/utils/pokemonData";
import { pokemonImages } from "@/shared/utils/pokemonImages";
import PokemonCard from "@/shared/components/PokemonCard";

function RaidsPage() {
    const [selectedStar, setSelectedStar] = useState();
    const [selectedPokemon, setSelectedPokemon] = useState();

    const handleStarClick = useCallback((star) => {
        setSelectedStar(star);
        setSelectedPokemon(null);
    });

    const allStars = raidsData.map((r) => r.stars);
    const starLevels = [...new Set(allStars)].sort((a, b) => a - b);
    const filteredRaids =
        selectedStar == null
            ? raidsData
            : raidsData.filter((r) => r.stars === selectedStar);

    return (
        <div className="container">
            <div className="cards-container">
                {starLevels.map((star) => (
                    <div
                        key={star}
                        className={`card team-card ${selectedStar === star ? "selected" : ""
                            }`}
                        onClick={() => handleStarClick(star)}
                    >
                        <p>{star}</p>
                    </div>
                ))}
            </div>

            {selectedStar && (
                <div className="pokemon-cards-display">
                    {filteredRaids.map((pokemonName, index) => {
                        const pokemon = pokemonData.find((p) => p.name === pokemonName) || {
                            name: pokemonName,
                            types: [],
                        };
                        let nameBackground =
                            typeBackgrounds[pokemon.name] || typeBackgrounds[""];
                        if (!typeBackgrounds[pokemon.name] && pokemon.types.length >= 2) {
                            nameBackground = generateDualTypeGradient(
                                pokemon.types[0],
                                pokemon.types[1]
                            );
                        } else if (
                            !typeBackgrounds[pokemon.name] &&
                            pokemon.types.length === 1
                        ) {
                            nameBackground =
                                typeBackgrounds[pokemon.types[0]] || typeBackgrounds[""];
                        }
                        return (
                            <PokemonCard
                                key={index}
                                pokemonName={pokemon.name}
                                pokemonImageSrc={pokemonImages[pokemonName]}
                                onClick={() => handlePokemonCardClick(pokemon.name)}
                                nameBackground={nameBackground}
                                isSelected={selectedPokemon === pokemon.name}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default RaidsPage;
