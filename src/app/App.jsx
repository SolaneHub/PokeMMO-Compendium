import { Activity } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Home from "@/app/layout/Home";
import Navbar from "@/app/layout/Navbar";
import BreedingPage from "@/pages/breeding/BreedingPage";
import EditorPage from "@/pages/editor/EditorPage";
import EliteFourPage from "@/pages/elite-four/EliteFourPage";
import HoOhPage from "@/pages/ho-oh/HoOhPage";
import PickupPage from "@/pages/pickup/PickupPage";
import PokedexPage from "@/pages/pokedex/PokedexPage";
import RaidsPage from "@/pages/raids/RaidsPage";
import RedPage from "@/pages/red/RedPage";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const pages = [
    { path: "/", Component: Home, key: "home" },
    { path: "/elite-four", Component: EliteFourPage, key: "e4" },
    { path: "/ho-oh", Component: HoOhPage, key: "hooh" },
    { path: "/red", Component: RedPage, key: "red" },
    { path: "/raids", Component: RaidsPage, key: "raids" },
    { path: "/pokedex", Component: PokedexPage, key: "pokedex" },
    { path: "/pickup", Component: PickupPage, key: "pickup" },
    { path: "/breeding", Component: BreedingPage, key: "breeding" },
    { path: "/editor", Component: EditorPage, key: "editor" },
  ];

  return (
    <div className="min-h-screen bg-black text-slate-200 flex flex-col font-sans">
      <header
        className="bg-[#24252a] text-white text-2xl font-bold py-2 text-center cursor-pointer select-none w-full transition-colors hover:text-[#a1a6ff] active:translate-y-[1px]"
        onClick={() => navigate("/")}
        title="Torna alla Home"
      >
        PokéMMO Compendium
      </header>

      <Navbar />

      <main className="w-full flex-1">
        {pages.map(({ path, Component, key }) => {
          const isActive = currentPath === path;

          return (
            <Activity key={key} mode={isActive ? "visible" : "hidden"}>
              <div
                className="w-full"
                style={{ display: isActive ? "block" : "none" }}
              >
                <Component />
              </div>
            </Activity>
          );
        })}
      </main>
    </div>
  );
}

export default App;
