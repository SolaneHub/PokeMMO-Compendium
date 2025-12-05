// * ============================================
// * STYLE IMPORTS
// * ============================================
import "@/pages/breeding/components/IVsDropdown.css";
import "@/pages/breeding/components/IVsSelector.css";
import "@/pages/breeding/components/StatCircle.css";
import "@/pages/breeding/components/TreeScheme.css";

import { useEffect, useState } from "react";

// * ============================================
// * COMPONENT IMPORTS
// * ============================================
import IVsDropdown from "@/pages/breeding/components/IVsDropdown";
import IVsSelector from "@/pages/breeding/components/IVsSelector";
import TreeScheme from "@/pages/breeding/components/TreeScheme";

// * ============================================
// * CONFIGURATION CONSTANTS
// * ============================================

const IV_OPTIONS = [2, 3, 4, 5, 6];

const IV_STATS = [
  "HP",
  "Attack",
  "Defense",
  "Sp. Attack",
  "Sp. Defense",
  "Speed",
];

// * ============================================
// * MAIN PAGE COMPONENT
// * ============================================
function BreedingPage() {
  // * 1. STATE MANAGEMENT CON PERSISTENZA (LocalStorage)

  // ? Controls how many IVs are currently selected
  const [selectedIvCount, setSelectedIvCount] = useState(() => {
    // ! Check LocalStorage on init
    const saved = localStorage.getItem("breeding_ivCount");
    return saved ? JSON.parse(saved) : IV_OPTIONS[0];
  });

  // ? Boolean toggle for Nature
  const [nature, setNature] = useState(() => {
    const saved = localStorage.getItem("breeding_nature");
    return saved ? JSON.parse(saved) : false;
  });

  // ! Critical State: Holds the current configuration of stats
  const [selectedIvStats, setSelectedIvStats] = useState(() => {
    const saved = localStorage.getItem("breeding_ivStats");
    return saved ? JSON.parse(saved) : IV_STATS;
  });

  // * 2. EFFECTS FOR SAVING DATA
  // Ogni volta che uno stato cambia, salviamo nel LocalStorage

  useEffect(() => {
    localStorage.setItem("breeding_ivCount", JSON.stringify(selectedIvCount));
  }, [selectedIvCount]);

  useEffect(() => {
    localStorage.setItem("breeding_nature", JSON.stringify(nature));
  }, [nature]);

  useEffect(() => {
    localStorage.setItem("breeding_ivStats", JSON.stringify(selectedIvStats));
  }, [selectedIvStats]);

  return (
    <div className="container">
      {/* * A. SELECTION PANEL */}
      <IVsSelector
        ivOptions={IV_OPTIONS}
        selectedIvCount={selectedIvCount}
        setSelectedIvCount={setSelectedIvCount}
        nature={nature}
        setNature={setNature}
      />

      {/* * B. CONFIGURATION DROPDOWNS */}
      <IVsDropdown
        ivStats={IV_STATS}
        selectedIvCount={selectedIvCount}
        selectedIvStats={selectedIvStats}
        setSelectedIvStats={setSelectedIvStats}
      />

      {/* * C. VISUALIZATION TREE */}
      <TreeScheme
        selectedIvCount={selectedIvCount}
        nature={nature}
        selectedIvStats={selectedIvStats}
      />
    </div>
  );
}

export default BreedingPage;
