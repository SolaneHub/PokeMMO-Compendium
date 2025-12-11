const RegionRoutes = ({ regions }) => {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold text-slate-200">Trainer Routes</h2>
      {regions.map((region, regionIndex) => (
        <div key={regionIndex} className="mb-6 border-b border-gray-700 pb-4">
          <h3 className="mb-3 text-xl font-semibold text-slate-200">
            {region.name}
          </h3>
          {region.routes.map((route, routeIndex) => (
            <div
              key={routeIndex}
              className="mb-4 rounded-lg border border-white/5 bg-[#1e2025] p-3 shadow"
            >
              <h4 className="mb-2 text-lg font-medium text-slate-200">
                {route.name}
              </h4>
              {route.notes && route.notes.length > 0 && (
                <ul className="mb-2 list-disc pl-5 text-sm text-slate-400">
                  {route.notes.map((note, noteIndex) => (
                    <li key={noteIndex}>{note}</li>
                  ))}
                </ul>
              )}
              {route.trainers && route.trainers.length > 0 && (
                <div className="mb-2">
                  <p className="font-semibold text-slate-300">Trainers:</p>
                  <ul className="list-disc pl-5 text-sm text-slate-400">
                    {route.trainers.map((trainer, trainerIndex) => (
                      <li key={trainerIndex}>
                        {trainer.name} (${trainer.money})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {route.pp_cost !== undefined && (
                <p className="text-sm text-slate-400">
                  PP Cost: {route.pp_cost}
                </p>
              )}
              {route.type === "action" && (
                <p className="text-sm font-bold text-blue-400">
                  Action: {route.name}
                </p>
              )}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
};

export default RegionRoutes;
