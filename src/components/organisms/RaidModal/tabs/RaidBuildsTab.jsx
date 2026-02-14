import Button from "@/components/atoms/Button";
import PlayerBuildCard from "@/components/molecules/PlayerBuildCard";
const RaidBuildsTab = ({
  recommendedList,
  buildGroups,
  effectiveBuildGroupKey,
  setSelectedBuildGroup,
  pokemonMap,
}) => {
  return (
    <section className="rounded-lg bg-white/5 p-3">
      {" "}
      {recommendedList.length > 0 ? (
        <>
          {" "}
          <h3 className="mb-3 text-xs font-bold tracking-widest uppercase">
            {" "}
            Recommended Setup{" "}
          </h3>{" "}
          {buildGroups ? (
            <>
              {" "}
              <div className="mb-3 flex flex-wrap gap-2">
                {" "}
                {Object.keys(buildGroups)
                  .sort()
                  .map((groupName) => (
                    <button
                      key={groupName}
                      onClick={() => setSelectedBuildGroup(groupName)}
                      className={`min-w-[80px] flex-1 cursor-pointer rounded-md border px-1.5 py-2.5 text-sm font-semibold transition-all ${
                        effectiveBuildGroupKey === groupName
                          ? "border-blue-500/50 bg-blue-600/20 text-blue-400 shadow-[0_0_0_1px_rgba(59,130,246,0.1)]"
                          : "border-white/5 bg-[#0f1014] text-slate-400 hover:bg-white/10 hover:text-slate-200"
                      }`}
                    >
                      {" "}
                      {groupName}{" "}
                    </button>
                  ))}{" "}
              </div>{" "}
              {effectiveBuildGroupKey &&
                buildGroups[effectiveBuildGroupKey] && (
                  <div className="flex animate-[fade-in_0.3s_ease-out] flex-col gap-2.5">
                    {" "}
                    {buildGroups[effectiveBuildGroupKey].map((build, i) => (
                      <PlayerBuildCard
                        key={i}
                        build={build}
                        pokemonMap={pokemonMap}
                      />
                    ))}{" "}
                  </div>
                )}{" "}
            </>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {" "}
              {recommendedList.map((rec, i) => (
                <li
                  key={i}
                  className="rounded border border-white/5 bg-[#0f1014] p-2 text-sm"
                >
                  {" "}
                  {rec}{" "}
                </li>
              ))}{" "}
            </ul>
          )}{" "}
        </>
      ) : (
        <p className="p-4 text-center text-slate-500 italic">
          {" "}
          No recommended builds available.{" "}
        </p>
      )}{" "}
    </section>
  );
};
export default RaidBuildsTab;
