import "./App.css";
import Navbar from "./components/Navbar";
import Content from "./components/Content";
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
      <header>PokéMMO Compendium</header>
      <Navbar onLinkClick={handleNavigation} currentActive={currentSection} />
      <Content linkName={currentSection} />
    </div>
  );
}

export default App;
