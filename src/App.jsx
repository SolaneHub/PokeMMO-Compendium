import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";
import { eliteFourMembers } from "./data/eliteFourData";
import EliteMemberCard from "./components/EliteMemberCard";
import { pokemonRegions } from "./data/regionData";
import RegionCard from "./components/RegionCard";
import PokemonCard from "./components/PokemonCard";
import { pokemonImages } from "./data/pokemonImages";
import {
  typeBackgrounds,
  generateDualTypeGradient,
  getPrimaryColor,
} from "./data/pokemonColors";
import { pokemonData } from "./data/pokemonData";

// Image caching utility optimized for pokemonImages.js structure
const imageCache = {
  memoryCache: new Map(),
  STORAGE_KEY: "pokedex_image_cache",

  init() {
    try {
      const cachedData = localStorage.getItem(this.STORAGE_KEY);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        parsedData.cachedUrls.forEach((url) => {
          this.memoryCache.set(url, true);
        });
        console.log(
          `🔄 Loaded ${this.memoryCache.size} cached image references`
        );
      }
    } catch (error) {
      console.warn("Failed to load image cache from storage:", error);
    }
  },

  persist() {
    try {
      const dataToStore = {
        cachedUrls: Array.from(this.memoryCache.keys()),
        timestamp: Date.now(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.warn("Failed to persist image cache:", error);
    }
  },

  async preloadImage(src) {
    if (this.memoryCache.has(src)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.memoryCache.set(src, true);
        this.persist();
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        reject();
      };
      img.src = src;
    });
  },

  isCached(src) {
    return this.memoryCache.has(src);
  },

  // Preload images for specific Pokémon names
  async preloadPokemonByName(pokemonNames) {
    const urlsToPreload = pokemonNames
      .map((name) => pokemonImages[name])
      .filter((url) => url && !this.isCached(url));

    if (urlsToPreload.length === 0) return;

    await Promise.allSettled(
      urlsToPreload.map((url) => this.preloadImage(url))
    );
  },
};

// Initialize the cache
imageCache.init();

// Function to analyze which Pokémon are actually most common in your data
const getMostCommonPokemon = (count = 20) => {
  const pokemonFrequency = {};

  // Count frequency across all teams and all members
  eliteFourMembers.forEach((member) => {
    Object.values(member.teams).forEach((team) => {
      if (team.pokemonNames) {
        team.pokemonNames.forEach((pokemonName) => {
          pokemonFrequency[pokemonName] =
            (pokemonFrequency[pokemonName] || 0) + 1;
        });
      }
    });
  });

  // Sort by frequency (most common first) and return top N
  return Object.entries(pokemonFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([name]) => name);
};

function App() {
  const teamLinks = {
    Reckless: "https://pokepast.es/c463b3ad2c4e4d41",
    "Wild Taste": "https://pokepast.es/581535bd31234626",
    "Zanpaku v2": "https://pokepast.es/a55cff69c1e1019d",
    "Double Star": "https://pokepast.es/0a1b6cd8b30b98d7",
    Dragonstar: "https://pokepast.es/236623c9e2da289f",
  };

  // Navigation state
  const [currentSection, setCurrentSection] = useState("elitefour");

  // State management for Elite4 section
  const [selectedTeam, setSelectedTeam] = useState("Reckless");
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPokemonDetailsVisible, setIsPokemonDetailsVisible] = useState(false);
  const [currentStrategyView, setCurrentStrategyView] = useState([]);
  const [strategyHistory, setStrategyHistory] = useState([]);
  const [loadingImages, setLoadingImages] = useState(new Set());

  // Memoized filtered elite four members based on selected region
  const filteredEliteFour = useMemo(() => {
    return selectedRegion
      ? eliteFourMembers.filter(
          (member) => member.region === selectedRegion.name
        )
      : [];
  }, [selectedRegion]);

  // Memoized current team data
  const currentTeamData = useMemo(
    () => selectedMember?.teams?.[selectedTeam],
    [selectedMember, selectedTeam]
  );

  // Memoized pokemon names for selected team
  const pokemonNamesForSelectedTeam = useMemo(
    () => currentTeamData?.pokemonNames || [],
    [currentTeamData]
  );

  // Preload images for the current team
  useEffect(() => {
    if (
      currentSection === "elitefour" &&
      pokemonNamesForSelectedTeam.length > 0
    ) {
      const loadTeamImages = async () => {
        const newLoadingImages = new Set();

        // Identify images that need loading
        pokemonNamesForSelectedTeam.forEach((name) => {
          const imgSrc = pokemonImages[name];
          if (imgSrc && !imageCache.isCached(imgSrc)) {
            newLoadingImages.add(imgSrc);
          }
        });

        setLoadingImages(newLoadingImages);

        if (newLoadingImages.size === 0) return;

        // Preload uncached images
        await imageCache.preloadPokemonByName(pokemonNamesForSelectedTeam);

        setLoadingImages(new Set());
      };

      loadTeamImages();
    }
  }, [pokemonNamesForSelectedTeam, currentSection]);

  // Preload ACTUAL most common Pokémon from your data on app startup
  useEffect(() => {
    const preloadCommonImages = async () => {
      try {
        // Get the actual most common Pokémon from YOUR data
        const commonPokemon = getMostCommonPokemon(25);
        console.log(
          "🔍 Preloading most common Pokémon from your data:",
          commonPokemon
        );

        await imageCache.preloadPokemonByName(commonPokemon);
      } catch (error) {
        console.warn("Failed to preload common images:", error);
      }
    };

    preloadCommonImages();
  }, []);

  // Preload region and elite four images
  useEffect(() => {
    const preloadStaticImages = async () => {
      try {
        const regionImageUrls = pokemonRegions.map((region) => region.image);
        const eliteFourImageUrls = eliteFourMembers.map(
          (member) => member.image
        );

        const allUrls = [
          ...new Set([...regionImageUrls, ...eliteFourImageUrls]),
        ];
        const urlsToPreload = allUrls.filter(
          (url) => url && !imageCache.isCached(url)
        );

        if (urlsToPreload.length === 0) return;

        await Promise.allSettled(
          urlsToPreload.map((url) => imageCache.preloadImage(url))
        );
      } catch (error) {
        console.warn("Failed to preload static images:", error);
      }
    };

    preloadStaticImages();
  }, []);

  // Memoized selected pokemon data
  const selectedPokemonData = useMemo(
    () => pokemonData.find((p) => p.name === selectedPokemon?.name),
    [selectedPokemon]
  );

  // Memoized selected pokemon types
  const selectedPokemonTypes = useMemo(
    () => selectedPokemonData?.types || [],
    [selectedPokemonData]
  );

  // Memoized background for details title
  const detailsTitleBackground = useMemo(() => {
    if (typeBackgrounds[selectedPokemon?.name]) {
      return typeBackgrounds[selectedPokemon.name];
    }

    if (selectedPokemonTypes.length >= 2) {
      return generateDualTypeGradient(
        selectedPokemonTypes[0],
        selectedPokemonTypes[1]
      );
    }

    if (selectedPokemonTypes.length === 1) {
      return typeBackgrounds[selectedPokemonTypes[0]] || typeBackgrounds[""];
    }

    return typeBackgrounds[""];
  }, [selectedPokemon, selectedPokemonTypes]);

  // Reset strategy states
  const resetStrategyStates = useCallback(() => {
    setCurrentStrategyView([]);
    setStrategyHistory([]);
  }, []);

  // Event handlers
  const handleMemberClick = useCallback(
    (member) => {
      setSelectedMember((prev) => (prev === member ? null : member));
      setSelectedPokemon(null);
      setIsPokemonDetailsVisible(false);
      resetStrategyStates();
    },
    [resetStrategyStates]
  );

  const handleRegionClick = useCallback((region) => {
    setSelectedRegion((prev) => (prev === region ? null : region));
  }, []);

  const handleTeamClick = useCallback(
    (teamName) => {
      setSelectedTeam(teamName);
      setSelectedRegion(null);
      setSelectedMember(null);
      setSelectedPokemon(null);
      setIsPokemonDetailsVisible(false);
      resetStrategyStates();
    },
    [resetStrategyStates]
  );

  const handlePokemonCardClick = useCallback(
    (pokemon) => {
      setSelectedPokemon(pokemon);
      setIsPokemonDetailsVisible(true);

      const pokemonStrategy =
        selectedMember?.teams?.[selectedTeam]?.pokemonStrategies?.[
          pokemon?.name
        ] || [];
      setCurrentStrategyView(pokemonStrategy);
      setStrategyHistory([]);
    },
    [selectedMember, selectedTeam]
  );

  const closePokemonDetails = useCallback(() => {
    setSelectedPokemon(null);
    setIsPokemonDetailsVisible(false);
    resetStrategyStates();
  }, [resetStrategyStates]);

  const handleStepClick = useCallback(
    (item) => {
      if (item?.steps && Array.isArray(item.steps)) {
        setStrategyHistory((prev) => [...prev, currentStrategyView]);
        setCurrentStrategyView(item.steps);
      }
    },
    [currentStrategyView]
  );

  const handleBackClick = useCallback(() => {
    if (strategyHistory.length > 0) {
      setCurrentStrategyView(strategyHistory[strategyHistory.length - 1]);
      setStrategyHistory((prev) => prev.slice(0, -1));
    }
  }, [strategyHistory]);

  // Effect to reset states when region changes
  useEffect(() => {
    if (currentSection === "elitefour") {
      setSelectedMember(null);
      setSelectedPokemon(null);
      setIsPokemonDetailsVisible(false);
      resetStrategyStates();
    }
  }, [selectedRegion, resetStrategyStates, currentSection]);

  // Improved strategy rendering
  const renderStrategyContent = useCallback(
    (content) => {
      if (!content || content.length === 0) {
        return <p>No strategy available</p>;
      }

      return content.map((item, index) => {
        // Pure variation container (like Lapras case)
        if (!item.type && item.variations) {
          return (
            <div key={index} className="variation-group">
              {item.variations.map((variation, varIndex) => (
                <div
                  key={varIndex}
                  className="strategy-variation-as-button"
                  onClick={() => handleStepClick(variation)}
                >
                  <p>{variation.name}</p>
                </div>
              ))}
            </div>
          );
        }

        // Main strategy
        if (item.type === "main") {
          return (
            <React.Fragment key={index}>
              {item.player && (
                <div className="strategy-step-main">
                  <p>{item.player}</p>
                </div>
              )}
              {item.variations && (
                <div className="variation-group">
                  {item.variations.map((variation, varIndex) => (
                    <div
                      key={varIndex}
                      className="strategy-variation-as-button"
                      onClick={() => handleStepClick(variation)}
                    >
                      <p>{variation.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </React.Fragment>
          );
        }

        // Regular step
        if (item.type === "step") {
          return (
            <div key={index} className="strategy-step">
              {item.player && <p>{item.player}</p>}
              {item.variations && (
                <div className="variation-group">
                  {item.variations.map((variation, varIndex) => (
                    <div
                      key={varIndex}
                      className="strategy-variation-as-button"
                      onClick={() => handleStepClick(variation)}
                    >
                      <p>{variation.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return null;
      });
    },
    [handleStepClick]
  );

  // Render helper for Pokemon cards
  const renderPokemonCards = useMemo(() => {
    if (!pokemonNamesForSelectedTeam.length) {
      return (
        <p>
          No pokemon defined for {selectedTeam} of {selectedMember?.name}.
        </p>
      );
    }

    return pokemonNamesForSelectedTeam.map((pokemonName, index) => {
      const pokemon = pokemonData.find((p) => p.name === pokemonName) || {
        name: pokemonName,
        types: [],
      };
      const pokemonTypes = pokemon.types || [];

      let nameBackground = typeBackgrounds[pokemon.name] || typeBackgrounds[""];

      if (!typeBackgrounds[pokemon.name] && pokemonTypes.length >= 2) {
        nameBackground = generateDualTypeGradient(
          pokemonTypes[0],
          pokemonTypes[1]
        );
      } else if (!typeBackgrounds[pokemon.name] && pokemonTypes.length === 1) {
        nameBackground =
          typeBackgrounds[pokemonTypes[0]] || typeBackgrounds[""];
      }

      const imgSrc = pokemonImages[pokemonName];
      const isImageLoaded = imgSrc ? imageCache.isCached(imgSrc) : false;
      const isLoading = imgSrc ? loadingImages.has(imgSrc) : false;

      return (
        <PokemonCard
          key={index}
          pokemonName={pokemon.name}
          pokemonImageSrc={imgSrc}
          onClick={() => handlePokemonCardClick(pokemon)}
          nameBackground={nameBackground}
          isLoaded={isImageLoaded}
          isLoading={isLoading}
        />
      );
    });
  }, [
    pokemonNamesForSelectedTeam,
    selectedMember,
    selectedTeam,
    handlePokemonCardClick,
    loadingImages,
  ]);

  // Navigation handler
  const handleNavigation = (section) => {
    setCurrentSection(section);
    // Reset all Elite4 states when navigating away
    if (section !== "elitefour") {
      setSelectedTeam("Reckless");
      setSelectedMember(null);
      setSelectedRegion(null);
      setSelectedPokemon(null);
      setIsPokemonDetailsVisible(false);
      resetStrategyStates();
    }
  };

  // Render content based on current section
  const renderContent = () => {
    switch (currentSection) {
      case "elitefour":
        return (
          <div className="container">
            {/* Team Selector */}
            <div className="cards-container">
              {Object.keys(eliteFourMembers[0]?.teams || {}).map((teamName) => (
                <div
                  key={teamName}
                  className={`card team-card ${
                    selectedTeam === teamName ? "selected" : ""
                  }`}
                  onClick={() => handleTeamClick(teamName)}
                >
                  {teamLinks[teamName] ? (
                    <a
                      href={teamLinks[teamName]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p>{teamName}</p>
                    </a>
                  ) : (
                    <p>{teamName}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Regions */}
            <div className="cards-container">
              {pokemonRegions.map((region) => (
                <RegionCard
                  key={region.id}
                  region={region}
                  onRegionClick={handleRegionClick}
                  isSelected={selectedRegion === region}
                />
              ))}
            </div>

            {/* Elite Four Members */}
            {selectedRegion && filteredEliteFour.length > 0 && (
              <div className="cards-container">
                {filteredEliteFour.map((member, i) => {
                  const memberBackground =
                    typeBackgrounds[member.type] || typeBackgrounds[""];
                  const memberShadowColor = getPrimaryColor(memberBackground);

                  return (
                    <EliteMemberCard
                      key={i}
                      member={member}
                      onMemberClick={handleMemberClick}
                      isSelected={selectedMember === member}
                      background={memberBackground}
                      shadowColor={memberShadowColor}
                    />
                  );
                })}
              </div>
            )}

            {/* Pokemon Cards */}
            {selectedMember && (
              <div className="pokemon-cards-display">{renderPokemonCards}</div>
            )}

            {/* Pokemon Details Modal */}
            {isPokemonDetailsVisible && selectedPokemon && (
              <div className="overlay" onClick={closePokemonDetails}>
                <div
                  className="pokemon-details-card"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="pokemon-details-title-wrapper"
                    style={{ background: detailsTitleBackground }}
                  >
                    <h2>{selectedPokemon.name}</h2>
                  </div>

                  <div className="menu-content">
                    {strategyHistory.length > 0 && (
                      <button className="back-button" onClick={handleBackClick}>
                        Back
                      </button>
                    )}
                    {renderStrategyContent(currentStrategyView)}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "red":
        return (
          <div className="container">
            <h2>Red Battle Strategies</h2>
            <p>Content for Red battle strategies coming soon...</p>
          </div>
        );

      case "hooh":
        return (
          <div className="container">
            <h2>Ho-oh Battle Strategies</h2>
            <p>Content for Ho-oh battle strategies coming soon...</p>
          </div>
        );

      case "credits":
        return (
          <div className="container">
            <div className="credits-content">
              <p>
                This compendium was inspired by and draws content from the
                excellent resource created by Team Porygon:
              </p>
              <div className="credit-link">
                <a
                  href="https://team-porygon-pokemmo.pages.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Team Porygon PokéMMO Guide
                </a>
              </div>
              <p>
                Special thanks to the PokéMMO community for their valuable
                insights and strategies.
              </p>
              <div className="additional-credits">
                <h3>Additional Resources</h3>
                <ul>
                  <li>
                    <a
                      href="https://pokemmo.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Official PokéMMO Website
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://forums.pokemmo.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PokéMMO Forums
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://pokepast.es/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PokéPast.es (for team sharing)
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="container">
            <h2>Welcome to PokéMMO Compendium</h2>
            <p>Select a section from the navigation menu above.</p>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <header>PokéMMO Compendium</header>
      <nav className="navbar">
        <ul className="nav-links">
          <li>
            <a
              href="#elitefour"
              className={currentSection === "elitefour" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("elitefour");
              }}
            >
              Elite Four
            </a>
          </li>
          <li>
            <a
              href="#red"
              className={currentSection === "red" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("red");
              }}
            >
              Red
            </a>
          </li>
          <li>
            <a
              href="#hooh"
              className={currentSection === "hooh" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("hooh");
              }}
            >
              Ho-oh
            </a>
          </li>
          <li>
            <a
              href="#credits"
              className={currentSection === "credits" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("credits");
              }}
            >
              Credits
            </a>
          </li>
        </ul>
      </nav>

      {renderContent()}
    </div>
  );
}

export default App;
