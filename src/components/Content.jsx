import EditorPage from "../pages/EditorPage";
import BreedingPage from "../pages/BreedingPage";
import EliteFourPage from "../pages/EliteFourPage";
import RedPage from "../pages/RedPage";

function Content({ linkName }) {
    const componentsMap = {
        EliteFour: EliteFourPage,
        Editor: EditorPage,
        Breeding: BreedingPage,
        "Ho-Oh": null,
        Pickup: null,
        Pokédex: null,
        Raids: null,
        Red: RedPage,
    };

    const ComponentToRender = componentsMap[linkName];

    if (!ComponentToRender) {
        return (
            <div className="container">
                <div className="credits-content">
                    <p>
                        This compendium was inspired by and draws content from the excellent
                        resource created by Team Porygon:
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
                        Special thanks to the PokéMMO community for their valuable insights
                        and strategies.
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
    }

    return <ComponentToRender />;
}

export default Content;
