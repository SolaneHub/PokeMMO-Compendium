interface ButtonSelectProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
}

const ButtonSelect = <T extends string | number>({
  options,
  value,
  onChange,
  label,
}: ButtonSelectProps<T>) => {
  return (
    <div className="space-y-3">
      {label && (
        <label className="ml-1 text-sm font-medium text-slate-500">
          {label}
        </label>
      )}
      <div className="grid grid-cols-5 gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`relative flex h-12 flex-col items-center justify-center rounded-xl text-lg font-bold text-white transition-all duration-200 ${
              option === value
                ? "scale-105 bg-blue-600 shadow-lg shadow-blue-500/20"
                : "hover: border border-white/5 bg-[#0f1014] hover:border-white/10 hover:bg-white/5"
            }`}
          >
            <span className="leading-none">{option}</span>
            <span className="text-[10px] font-normal opacity-60">IV</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ButtonSelect;
