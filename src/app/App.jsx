import "./App.css";

import { useEffect, useState } from "react";

import Content from "@/app/layout/Content";
import Navbar from "@/app/layout/Navbar";

function App() {
  const getSectionFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("section");
  };

  const [currentSection, setCurrentSection] = useState(getSectionFromUrl());

  const handleNavigation = (section) => {
    const params = new URLSearchParams(window.location.search);

    if (section) {
      params.set("section", section);
    } else {
      params.delete("section");
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    const cleanUrl = section ? newUrl : window.location.pathname;

    window.history.pushState({}, "", cleanUrl);
    setCurrentSection(section);
  };

  useEffect(() => {
    const onPopState = () => {
      setCurrentSection(getSectionFromUrl());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const titleSection = currentSection ? `: ${currentSection}` : "";
    document.title = `PokéMMO Compendium${titleSection}`;
  }, [currentSection]);

  return (
    <div className="App">
      <header
        className="app-header"
        onClick={() => handleNavigation(null)}
        title="Torna alla Home"
      >
        PokéMMO Compendium
      </header>
      <Navbar onLinkClick={handleNavigation} currentActive={currentSection} />
      <Content linkName={currentSection} />
    </div>
  );
}

export default App;
