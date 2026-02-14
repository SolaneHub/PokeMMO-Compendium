import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
function FeatureCard({ title, link, description, icon: Icon, color }) {
  return (
    <Link
      to={link}
      className="group relative rounded-2xl border border-white/5 bg-[#1a1b20] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-xl"
    >
      {" "}
      {/* Hover Gradient Background using inline style for color */}{" "}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(to bottom right, ${color}1a, transparent)`,
        }}
      />{" "}
      <div className="relative z-10 flex h-full flex-col">
        {" "}
        <div className="mb-4 flex items-center justify-between">
          {" "}
          <div
            className="rounded-xl p-3 shadow-lg"
            style={{ backgroundColor: color }}
          >
            {" "}
            <Icon size={24} />{" "}
          </div>{" "}
          <ExternalLink
            size={16}
            className="group-hover: text-slate-600 transition-colors"
          />{" "}
        </div>{" "}
        <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-white">
          {title}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
          {description}
        </p>
      </div>{" "}
    </Link>
  );
}
export default FeatureCard;
