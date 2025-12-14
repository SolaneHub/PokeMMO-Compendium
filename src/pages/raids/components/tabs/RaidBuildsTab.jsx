import BuildCard from "../BuildCard";

const RaidBuildsTab = ({
  recommendedList,
  buildGroups,
  effectiveBuildGroupKey,
  setSelectedBuildGroup,
  pokemonMap, // Accept pokemonMap here
}) => {
  return (
    <section className="rounded-lg bg-neutral-800 p-3">
      {recommendedList.length > 0 ? (
        <>
          <h3 className="mb-3 text-xs font-bold tracking-widest text-slate-200 uppercase">
            Recommended Setup
          </h3>
          {buildGroups ? (
            <>
              <div className="mb-3 flex flex-wrap gap-2">
                {Object.keys(buildGroups)
                  .sort()
                  .map((groupName) => (
                    <button
                      key={groupName}
                      className={`min-w-[80px] flex-1 cursor-pointer rounded-md border border-slate-700 bg-neutral-900 px-1.5 py-2.5 text-sm font-semibold text-slate-400 transition-all hover:bg-slate-700 hover:text-slate-200 ${effectiveBuildGroupKey === groupName ? "border-blue-500 bg-blue-500/15 text-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]" : ""} `}
                      onClick={() => setSelectedBuildGroup(groupName)}
                    >
                      {groupName}
                    </button>
                  ))}
              </div>

              {effectiveBuildGroupKey &&
                buildGroups[effectiveBuildGroupKey] && (
                  <div className="flex animate-[fade-in_0.3s_ease-out] flex-col gap-2.5">
                    {buildGroups[effectiveBuildGroupKey].map((build, i) => (
                      <BuildCard
                        key={i}
                        buildData={build}
                        pokemonMap={pokemonMap}
                      /> // Pass pokemonMap here
                    ))}
                  </div>
                )}
            </>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {recommendedList.map((rec, i) => (
                <li
                  key={i}
                  className="rounded border border-slate-700 bg-neutral-900 p-2 text-sm text-slate-300"
                >
                  {rec}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p className="p-4 text-center text-slate-500 italic">
          No recommended builds available.
        </p>
      )}
    </section>
  );
};
export default RaidBuildsTab;
