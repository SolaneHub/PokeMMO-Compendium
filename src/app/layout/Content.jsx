import BreedingPage from "@/pages/breeding/BreedingPage";
import EditorPage from "@/pages/editor/EditorPage";
import EliteFourPage from "@/pages/elite-four/EliteFourPage";
import HoOhPage from "@/pages/ho-oh/HoOhPage";
import PickupPage from "@/pages/pickup/PickupPage";
import PokedexPage from "@/pages/pokedex/PokedexPage";
import RaidsPage from "@/pages/raids/RaidsPage";
import RedPage from "@/pages/red/RedPage";
import './Content.css';

function Content({ linkName }) {
    const componentsMap = {
        EliteFour: EliteFourPage,
        Editor: EditorPage,
        Breeding: BreedingPage,
        "Ho-Oh": HoOhPage,
        Pickup: PickupPage,
        Pokédex: PokedexPage,
        Raids: RaidsPage,
        Red: RedPage,
    };

    const ComponentToRender = componentsMap[linkName];

    if (!ComponentToRender) {
        return (
            <div className="container">
                <div className="credits-content">
                    <p>
                        This compendium serves as a community-driven guide for{" "}
                        <strong>PokéMMO</strong> players — gathering essential data and
                        strategies to assist in breeding, team building, and late-game
                        encounters such as the Elite Four and Red.
                    </p>
                    <p>
                        It stands as a collaborative effort shaped by countless trainers,
                        creators, and guide writers across the PokéMMO community. Below are
                        the main sources that inspired and supported this project.
                    </p>

                    <div className="additional-credits">
                        <h3>Primary Resources Consulted</h3>
                        <ul>
                            <li>
                                <strong>Breeding & Pokédex:</strong> Inspired by{" "}
                                <a
                                    href="https://pokemmohub.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    PokéMMO Hub
                                </a>
                                .
                            </li>
                            <li>
                                <strong>Elite Four, Red & Ho-Oh:</strong> Strategies adapted
                                from{" "}
                                <a
                                    href="https://team-porygon-pokemmo.pages.dev/guides/EliteFour"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Team Porygon PokéMMO Guide
                                </a>{" "}
                                and{" "}
                                <a
                                    href="http://pokeking.icu/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    PokeKing
                                </a>
                                .
                            </li>
                            <li>
                                <strong>Raids:</strong> Based on the content from{" "}
                                <a
                                    href="https://www.youtube.com/@caav.pokemmo/videos"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Caav.PokéMMO YouTube Channel
                                </a>
                                .
                            </li>
                            <li>
                                <strong>Pickup:</strong> Mechanics sourced from{" "}
                                <a
                                    href="https://pokemmo.shoutwiki.com/wiki/Pickup"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    PokéMMO ShoutWiki
                                </a>
                                .
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return <ComponentToRender />;
}

export default Content;
