import TypeBadge from "@/components/atoms/TypeBadge";
const PokemonStats = ({ stats, defenses }) => {
  const statOrder = ["hp", "atk", "def", "spa", "spd", "spe"];
  const getTypesByMultiplier = (mult) => {
    if (!defenses) return [];
    return Object.entries(defenses)
      .filter(([, val]) => val === mult)
      .map(([type]) => type);
  };
  return (
    <div className="flex flex-col gap-5">
      {" "}
      {/* Base Stats */}{" "}
      <div className="flex flex-col gap-2.5">
        {" "}
        <h4 className="border-b border-white/5 pb-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
          {" "}
          Base Stats{" "}
        </h4>{" "}
        {stats &&
          statOrder.map((key) => {
            const val = stats[key];
            if (val === undefined) return null;
            return (
              <div key={key} className="mb-1 flex items-center">
                {" "}
                <span className="w-10 text-xs font-bold text-slate-400 uppercase">
                  {" "}
                  {key}{" "}
                </span>{" "}
                <span className="mr-2.5 w-9 text-right text-sm font-bold text-slate-100">
                  {" "}
                  {val}{" "}
                </span>{" "}
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#0f1014]">
                  {" "}
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((val / 255) * 100, 100)}%`,
                      background:
                        val > 100
                          ? "#00b894"
                          : val > 60
                            ? "#2563EB"
                            : "#f87171",
                    }}
                  />{" "}
                </div>{" "}
              </div>
            );
          })}{" "}
      </div>{" "}
      {/* Weakness & Resistance */}{" "}
      <div className="mt-5 flex flex-col gap-2.5">
        {" "}
        <h4 className="border-b border-white/5 pb-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
          {" "}
          Weakness & Resistance{" "}
        </h4>{" "}
        {!defenses ? (
          <p className="p-5 text-center text-slate-400 italic">
            {" "}
            Type data not available.{" "}
          </p>
        ) : (
          <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
            {" "}
            {[4, 2, 0.5, 0.25, 0].map((mult) => {
              const types = getTypesByMultiplier(mult);
              if (types.length === 0) return null;
              const label = mult === 0.25 ? "¼x" : `${mult}x`;
              const colorClass =
                mult > 1
                  ? "text-red-400"
                  : mult === 0
                    ? "text-purple-400"
                    : "text-emerald-400";
              return (
                <div key={mult} className="flex items-center gap-3">
                  {" "}
                  <span
                    className={`w-9 shrink-0 text-right text-sm font-bold ${colorClass}`}
                  >
                    {" "}
                    {label}{" "}
                  </span>{" "}
                  <div className="flex flex-wrap gap-1.5">
                    {" "}
                    {types.map((t) => (
                      <TypeBadge key={t} type={t} size="xs" />
                    ))}{" "}
                  </div>{" "}
                </div>
              );
            })}{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
};
export default PokemonStats;
