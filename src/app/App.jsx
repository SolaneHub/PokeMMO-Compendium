import "./App.css";
import Navbar from "@/app/layout/Navbar";
import Content from "@/app/layout/Content";
import { useEffect, useState } from "react";

function App() {
  const [currentSection, setCurrentSection] = useState(null);

  const handleNavigation = (section) => {
    setCurrentSection(section);
  };

  useEffect(() => {
    document.title = `PokéMMO Compendium: ${currentSection}`;
  }, [currentSection]);

  return (
    <div className="App">
      <header className="app-header">PokéMMO Compendium</header>
      <Navbar onLinkClick={handleNavigation} currentActive={currentSection} />
      <Content linkName={currentSection} />
    </div>
  );
}

export default App;
