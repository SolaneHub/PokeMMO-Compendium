import { typeBackgrounds } from "@/utils/pokemonColors";
const TypeBadge = ({ type, size = "md" }) => {
  const background = typeBackgrounds[type] || typeBackgrounds[""];
  const sizeClasses = {
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-2.5 py-1 text-[11px]",
    md: "px-4 py-1.5 text-xs",
    lg: "px-6 py-2 text-sm",
  };
  return (
    <span
      className={`rounded-full font-bold tracking-wide uppercase shadow-sm ${sizeClasses[size]}`}
      style={{ background }}
    >
      {" "}
      {type}{" "}
    </span>
  );
};
export default TypeBadge;
