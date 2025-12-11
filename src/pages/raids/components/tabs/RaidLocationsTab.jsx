const RaidLocationsTab = ({ currentRaid }) => {
  return (
    <section className="rounded-lg bg-neutral-800 p-3">
      <h3 className="mb-3 text-xs font-bold tracking-widest text-slate-200 uppercase">
        Where to find
      </h3>
      {currentRaid.locations ? (
        <div className="flex flex-col gap-3">
          {Object.entries(currentRaid.locations).map(
            ([region, locationData]) => {
              const areaName = locationData.area || locationData;
              const reqs = locationData.requirements || [];
              return (
                <div
                  key={region}
                  className="overflow-hidden rounded-lg border border-slate-700 bg-neutral-900"
                >
                  <div className="border-b border-slate-700 bg-slate-700 p-2 px-3">
                    <span className="text-xs font-bold tracking-wider text-white uppercase">
                      {region}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 p-3">
                    <div className="flex flex-col gap-1">
                      <strong className="text-[10px] font-bold text-slate-500 uppercase">
                        Area
                      </strong>
                      <span className="text-sm font-medium text-slate-200">
                        {areaName}
                      </span>
                    </div>
                    {reqs.length > 0 && (
                      <div className="flex flex-col gap-1">
                        <strong className="text-[10px] font-bold text-slate-500 uppercase">
                          Requirements
                        </strong>
                        <div className="flex flex-wrap gap-1.5">
                          {reqs.map((req, k) => (
                            <span
                              key={k}
                              className="inline-flex items-center rounded border border-orange-500/40 bg-orange-500/15 px-2 py-1 text-xs font-semibold text-orange-500"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      ) : (
        <p className="p-4 text-center text-slate-500 italic">
          No location data available.
        </p>
      )}
    </section>
  );
};
export default RaidLocationsTab;
