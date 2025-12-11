const TurnsSlider = ({ value, onChange }) => {
  const maxTurns = 11;
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm font-bold text-slate-300">
        <span>Turns Passed</span>
        <span>{value >= maxTurns ? `${maxTurns}+` : value}</span>
      </div>
      <div className="relative h-6 overflow-hidden rounded-full border border-slate-600 bg-slate-800 shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-200"
          style={{ width: `${Math.min(100, (value / maxTurns) * 100)}%` }}
        />
        <input
          type="range"
          min="1"
          max={maxTurns}
          value={Math.min(value, maxTurns)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
};
export default TurnsSlider;
