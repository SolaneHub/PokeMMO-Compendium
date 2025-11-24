import "./IVsSelector.css";

// * Component: IVsSelector
// * Handles the selection of how many IVs to breed (2-6) and the Nature toggle.
function IVsSelector({
  ivOptions,
  selectedIvCount,
  setSelectedIvCount,
  nature,
  setNature,
}) {
  return (
    <div className="container">
      {/* * ============================================ */}
      {/* * 1. IV COUNT BUTTONS SECTION                  */}
      {/* * ============================================ */}
      <div className="ivs-container">
        {/* ? Map through available IV options (e.g., [2, 3, 4, 5, 6]) */}
        {ivOptions.map((option) => (
          <button
            // * Dynamic Class: Adds 'selected' if this is the active count
            className={`ivs-selector-button ${
              option === selectedIvCount ? "selected" : ""
            }`}
            key={option}
            // ! Critical: Updates the parent state to trigger tree re-render
            onClick={() => setSelectedIvCount(option)}
          >
            {option}
            <span className="iv-symbol">×</span>
          </button>
        ))}
      </div>

      {/* * ============================================ */}
      {/* * 2. NATURE TOGGLE SECTION                     */}
      {/* * ============================================ */}
      <div className="nature-container">
        <p>Nature</p>

        {/* ! Controlled Checkbox: Directly toggles boolean state */}
        <input
          type="checkbox"
          checked={nature}
          onChange={() => setNature(!nature)}
        />
      </div>
    </div>
  );
}
export default IVsSelector;
