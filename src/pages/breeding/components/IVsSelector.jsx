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
        {ivOptions.map((option) => (
          <button
            className={`ivs-selector-button ${
              option === selectedIvCount ? "selected" : ""
            }`}
            key={option}
            onClick={() => setSelectedIvCount(option)}
          >
            {option}
            <span className="iv-symbol">×</span>
          </button>
        ))}
      </div>
      <div className="nature-container">
        <p>Nature</p>
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
