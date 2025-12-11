const RepeatCapturesSlider = ({ value, onChange }) => {
  const maxCaptures = 15;
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm font-bold text-slate-300">
        <span>Previous Captures</span>
        <span>{value >= maxCaptures ? `${maxCaptures}+` : value}</span>
      </div>
      <div className="relative h-6 overflow-hidden rounded-full border border-slate-600 bg-slate-800 shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-purple-500 transition-all duration-200"
          style={{ width: `${Math.min(100, (value / maxCaptures) * 100)}%` }}
        />
        <input
          type="range"
          min="0"
          max={maxCaptures}
          value={Math.min(value, maxCaptures)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
};
export default RepeatCapturesSlider;
