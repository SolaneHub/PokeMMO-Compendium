const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mb-8 w-full max-w-[400px] rounded-full border-2 border-white/5 bg-[#0f1014] px-5 py-3 text-base text-slate-200 transition-all duration-200 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:shadow-[0_0_8px_rgba(59,130,246,0.4)]"
    />
  );
};
export default SearchBar;
