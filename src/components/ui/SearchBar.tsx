interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  ariaLabel,
  className = "",
}: SearchBarProps) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel || placeholder}
      className={`mb-8 w-full ${className.includes("max-w-") ? "" : "max-w-[400px]"} rounded-full border-2 border-white/5 bg-[#0f1014] px-5 py-3 text-base text-white transition-all duration-200 outline-none placeholder:text-slate-500 focus:border-blue-600 focus:shadow-[0_0_8px_rgba(37,99,235,0.4)] ${className}`}
    />
  );
};

export default SearchBar;
