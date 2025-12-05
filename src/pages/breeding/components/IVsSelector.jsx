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
            key={option}
            className={`ivs-selector-button ${option === selectedIvCount ? "selected" : ""}`}
            onClick={() => setSelectedIvCount(option)}
          >
            {option}
            <span className="iv-symbol">×</span>
          </button>
        ))}
      </div>

      <div className="nature-container">
        <label
          htmlFor="nature-toggle"
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <p style={{ margin: 0 }}>Nature</p>
          <input
            id="nature-toggle"
            type="checkbox"
            checked={nature}
            onChange={() => setNature(!nature)}
          />
        </label>
      </div>
    </div>
  );
}
export default IVsSelector;
