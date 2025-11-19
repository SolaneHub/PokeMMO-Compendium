import "./IVsSelector.css";

function IVsSelector({
  ivOptions,
  selectedIvCount,
  setSelectedIvCount,
  nature,
  setNature,
}) {
  return (
    <div className="container">
      <div className="ivs-container">
        {/* ? Render buttons for each available IV count option (e.g., 2, 3, 4, 5, 6) */}
        {ivOptions.map((option) => (
          <button
            className={`ivs-selector-button ${
              option === selectedIvCount ? "selected" : ""
            }`}
            key={option}
            onClick={() => setSelectedIvCount(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="nature-container">
        <p>Nature</p>
        {/* * Checkbox to toggle Nature breeding logic */}
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
