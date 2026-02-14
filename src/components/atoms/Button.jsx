const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  icon: Icon,
  fullWidth = false,
}) => {
  const baseStyles =
    "relative flex items-center justify-center gap-2 font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary:
      "bg-blue-600 shadow-lg shadow-blue-900/20 hover:bg-blue-500 hover:scale-105",
    special:
      "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-900/20 hover:from-blue-400 hover:to-purple-400 hover:scale-105",
    secondary:
      "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20",
    danger:
      "bg-red-600 shadow-lg shadow-red-900/20 hover:bg-red-500 hover:scale-105",
    ghost: "bg-transparent hover:bg-white/5",
    outline:
      "bg-transparent border-2 border-blue-400 text-blue-400 hover:bg-blue-400/10 hover:border-blue-300",
  };
  const sizes = {
    xs: "px-2 py-1 text-xs rounded-md",
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-6 py-2.5 text-sm rounded-full",
    lg: "px-8 py-3 text-base rounded-2xl",
  };
  const widthStyle = fullWidth ? "w-full" : "";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
    >
      {" "}
      {Icon && <Icon size={18} />} {children}{" "}
    </button>
  );
};
export default Button;
