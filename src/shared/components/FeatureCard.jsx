import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

function FeatureCard({
  title,
  path,
  desc,
  icon: Icon,
  gradient,
  border,
  text,
}) {
  return (
    <Link
      to={path}
      className={`group relative rounded-2xl border border-white/5 bg-[#1a1b20] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${border}`}
    >
      {/* Hover Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div className={`rounded-xl bg-white/5 p-3 backdrop-blur-sm ${text}`}>
            <Icon size={24} />
          </div>
          <ExternalLink
            size={16}
            className="text-slate-600 transition-colors group-hover:text-slate-400"
          />
        </div>

        <h3 className="mb-2 text-xl font-bold text-slate-100">{title}</h3>
        <p className="flex-1 text-sm leading-relaxed text-slate-400">{desc}</p>
      </div>
    </Link>
  );
}

export default FeatureCard;
