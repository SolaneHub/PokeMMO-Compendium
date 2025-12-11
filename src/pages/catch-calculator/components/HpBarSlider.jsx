const HpBarSlider = ({ value, onChange }) => {
  let colorClass = "bg-green-500";
  if (value < 20) colorClass = "bg-red-500";
  else if (value < 50) colorClass = "bg-yellow-400";

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm font-bold text-slate-300">
        <span>HP Remaining</span>
        <span>{value}%</span>
      </div>
      <div className="relative h-6 overflow-hidden rounded-full border border-slate-600 bg-slate-800 shadow-inner">
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-200 ${colorClass}`}
          style={{ width: `${value}%` }}
        />
        <input
          type="range"
          min="1"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
};
export default HpBarSlider;
