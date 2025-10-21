import { useState } from "react";
import IVsDropdown from "../components/BreedingPage/IVsDropdown";
import IVsSelector from "../components/BreedingPage/IVsSelector";
import TreeScheme from "../components/BreedingPage/TreeScheme";

const IV_OPTIONS = [2, 3, 4, 5, 6];
const IV_STATS = [
    "HP",
    "Attack",
    "Defense",
    "Sp. Attack",
    "Sp. Defense",
    "Speed",
];

function BreedingPage() {
    const [selectedIvCount, setSelectedIvCount] = useState(IV_OPTIONS[0]);
    const [nature, setNature] = useState(false);
    const [selectedIvStats, setSelectedIvStats] = useState(IV_STATS);

    return (
        <div className="container">
            <IVsSelector
                ivOptions={IV_OPTIONS}
                selectedIvCount={selectedIvCount}
                setSelectedIvCount={setSelectedIvCount}
                nature={nature}
                setNature={setNature}
            />
            <IVsDropdown
                ivStats={IV_STATS}
                selectedIvCount={selectedIvCount}
                selectedIvStats={selectedIvStats}
                setSelectedIvStats={setSelectedIvStats}
            />
            <TreeScheme
                selectedIvCount={selectedIvCount}
                nature={nature}
                selectedIvStats={selectedIvStats}
            />
        </div>
    );
}

export default BreedingPage;
