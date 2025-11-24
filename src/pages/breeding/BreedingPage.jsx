// * ============================================
// * STYLE IMPORTS
// * Importing component-specific styles globally for the page
// * ============================================
import "@/pages/breeding/components/IVsDropdown.css";
import "@/pages/breeding/components/IVsSelector.css";
import "@/pages/breeding/components/StatCircle.css";
import "@/pages/breeding/components/TreeScheme.css";

import { useState } from "react";

// * ============================================
// * COMPONENT IMPORTS
// * ============================================
import IVsDropdown from "@/pages/breeding/components/IVsDropdown";
import IVsSelector from "@/pages/breeding/components/IVsSelector";
import TreeScheme from "@/pages/breeding/components/TreeScheme";

// * ============================================
// * CONFIGURATION CONSTANTS
// * ============================================

// ? Available options for the number of IVs to breed
const IV_OPTIONS = [2, 3, 4, 5, 6];

// ? The complete list of available Stats in the game
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
// * Orchestrates the state between the Selector, Dropdowns, and Tree.
// * ============================================
function BreedingPage() {
  // * 1. STATE MANAGEMENT

  // ? Controls how many IVs are currently selected (e.g., 3)
  const [selectedIvCount, setSelectedIvCount] = useState(IV_OPTIONS[0]);

  // ? Boolean toggle for whether Nature is included in breeding
  const [nature, setNature] = useState(false);

  // ! Critical State: Holds the current configuration of stats (e.g., ["HP", "Attack", ...])
  // Passed down to both Dropdowns (to change them) and Tree (to display them)
  const [selectedIvStats, setSelectedIvStats] = useState(IV_STATS);

  return (
    <div className="container">
      {/* * ============================================ */}
      {/* * A. SELECTION PANEL                           */}
      {/* * Buttons for 2x-6x IVs and Nature Toggle      */}
      {/* * ============================================ */}
      <IVsSelector
        ivOptions={IV_OPTIONS}
        selectedIvCount={selectedIvCount}
        setSelectedIvCount={setSelectedIvCount}
        nature={nature}
        setNature={setNature}
      />

      {/* * ============================================ */}
      {/* * B. CONFIGURATION DROPDOWNS                   */}
      {/* * Allows user to map specific stats to slots   */}
      {/* * ============================================ */}
      <IVsDropdown
        ivStats={IV_STATS}
        selectedIvCount={selectedIvCount}
        selectedIvStats={selectedIvStats}
        setSelectedIvStats={setSelectedIvStats}
      />

      {/* * ============================================ */}
      {/* * C. VISUALIZATION TREE                        */}
      {/* * Renders the interactive breeding path        */}
      {/* * ============================================ */}
      <TreeScheme
        selectedIvCount={selectedIvCount}
        nature={nature}
        selectedIvStats={selectedIvStats}
      />
    </div>
  );
}

export default BreedingPage;
