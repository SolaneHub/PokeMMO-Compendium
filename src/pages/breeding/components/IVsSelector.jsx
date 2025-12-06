function IVsSelector({
  ivOptions,
  selectedIvCount,
  setSelectedIvCount,
  nature,
  setNature,
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap gap-2.5 justify-center mt-5">
        {ivOptions.map((option) => (
          <button
            key={option}
            className={`flex items-center justify-center gap-0.5 w-[100px] h-[50px] bg-slate-800 border-2 border-transparent rounded-lg shadow-md text-slate-200 text-xl font-bold cursor-pointer transition-all duration-200 hover:bg-slate-700 hover:shadow-lg hover:-translate-y-0.5
              ${option === selectedIvCount ? "bg-slate-700 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] -translate-y-0.5" : ""}
            `}
            onClick={() => setSelectedIvCount(option)}
          >
            {option}
            <span className={`text-base mt-0.5 opacity-80 ${option === selectedIvCount ? "text-white" : "text-blue-400"}`}>×</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 my-4 mb-6">
        <label
          htmlFor="nature-toggle"
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <p className="m-0 text-slate-200 text-lg font-semibold group-hover:text-white transition-colors">Nature</p>
          <div className="relative flex items-center">
             <input
              id="nature-toggle"
              type="checkbox"
              checked={nature}
              onChange={() => setNature(!nature)}
              className="appearance-none w-7 h-7 bg-slate-800 border-2 border-transparent rounded-md shadow-md cursor-pointer grid place-content-center transition-all duration-200 hover:border-blue-400 hover:-translate-y-0.5 checked:bg-blue-500 checked:border-blue-500 checked:shadow-[0_0_10px_rgba(59,130,246,0.4)]
                before:content-[''] before:w-4 before:h-4 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjIwIDYgOSAxNyA0IDEyIj48L3BvbHlsaW5lPjwvc3ZnPg==')] before:bg-center before:bg-no-repeat before:bg-contain before:scale-0 checked:before:scale-100 before:transition-transform before:duration-200
              "
            />
          </div>
        </label>
      </div>
    </div>
  );
}
export default IVsSelector;