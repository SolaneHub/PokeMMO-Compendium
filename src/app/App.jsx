import { Activity } from "react";
import { useLocation } from "react-router-dom";

import Home from "@/app/layout/Home";
import Shell from "@/app/layout/Shell";
import BossFightsPage from "@/pages/boss-fights/BossFightsPage";
import BreedingPage from "@/pages/breeding/BreedingPage";
import EditorPage from "@/pages/editor/EditorPage";
import EliteFourPage from "@/pages/elite-four/EliteFourPage";
import PickupPage from "@/pages/pickup/PickupPage";
import PokedexPage from "@/pages/pokedex/PokedexPage";
import RaidsPage from "@/pages/raids/RaidsPage";
import SuperTrainersPage from "@/pages/super-trainers/SuperTrainersPage";

function App() {
  const location = useLocation();
  const currentPath = location.pathname;

  const pages = [
    { path: "/", Component: Home, key: "home" },
    { path: "/elite-four", Component: EliteFourPage, key: "e4" },
    { path: "/boss-fights", Component: BossFightsPage, key: "boss-fights" },
    {
      path: "/super-trainers",
      Component: SuperTrainersPage,
      key: "super-trainers",
    },
    { path: "/raids", Component: RaidsPage, key: "raids" },
    { path: "/pokedex", Component: PokedexPage, key: "pokedex" },
    { path: "/pickup", Component: PickupPage, key: "pickup" },
    { path: "/breeding", Component: BreedingPage, key: "breeding" },
  ];

  if (!import.meta.env.PROD) {
    pages.push({ path: "/editor", Component: EditorPage, key: "editor" });
  }

  return (
    <Shell>
      {pages.map(({ path, Component, key }) => {
        const isActive = currentPath === path;

        return (
          <Activity key={key} mode={isActive ? "visible" : "hidden"}>
            <div
              className="w-full h-full"
              style={{ display: isActive ? "block" : "none" }}
            >
              <Component />
            </div>
          </Activity>
        );
      })}
    </Shell>
  );
}

export default App;
