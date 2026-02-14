const ToggleCard = ({
  icon: Icon,
  title,
  subtitle,
  isActive,
  onClick,
  activeColorClass = "bg-blue-600",
  activeTextClass = "text-blue-400",
  activeBorderClass = "border-blue-500/50",
  activeBgClass = "bg-blue-600/10",
}) => {
  return (
    <div
      className={`group relative cursor-pointer rounded-xl border p-4 transition-all duration-300 ${isActive ? `${activeBorderClass} ${activeBgClass}` : "border-white/5 bg-[#0f1014] hover:border-white/10 hover:bg-white/5"} `}
      onClick={onClick}
    >
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <div className="flex items-center gap-3">
          {" "}
          <div
            className={`rounded-lg p-2 transition-colors ${isActive ? `${activeColorClass} ` : "bg-white/10"}`}
          >
            {" "}
            {Icon && <Icon size={20} />}{" "}
          </div>{" "}
          <div className="flex flex-col">
            {" "}
            <span
              className={`font-semibold ${isActive ? activeTextClass : ""}`}
            >
              {" "}
              {title}{" "}
            </span>{" "}
            <span className="text-xs text-slate-500">{subtitle}</span>{" "}
          </div>{" "}
        </div>{" "}
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 ${isActive ? "rotate-0 bg-blue-600" : "-rotate-90 bg-white/10"} `}
        >
          {" "}
          {isActive ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <polyline points="20 6 9 17 4 12"></polyline>{" "}
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <line x1="18" y1="6" x2="6" y2="18"></line>{" "}
              <line x1="6" y1="6" x2="18" y2="18"></line>{" "}
            </svg>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default ToggleCard;
