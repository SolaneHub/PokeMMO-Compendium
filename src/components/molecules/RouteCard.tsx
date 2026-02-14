interface Trainer {
  name: string;
  money: string | number;
}

interface Route {
  name: string;
  notes?: string[];
  trainers?: Trainer[];
  pp_cost?: number | string;
  type?: string;
}

interface RouteCardProps {
  route: Route;
}

const RouteCard = ({ route }: RouteCardProps) => {
  return (
    <div className="mb-4 rounded-xl border border-white/5 bg-[#1e2025] p-4 text-white shadow-sm transition-all hover:border-white/10">
      <h4 className="mb-2 text-lg font-bold">{route.name}</h4>
      {route.notes && route.notes.length > 0 && (
        <ul className="mb-3 list-disc space-y-1 pl-5 text-sm">
          {route.notes.map((note, noteIndex) => (
            <li key={noteIndex}>{note}</li>
          ))}
        </ul>
      )}
      {route.trainers && route.trainers.length > 0 && (
        <div className="mb-3">
          <p className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
            Trainers
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {route.trainers.map((trainer, trainerIndex) => (
              <li key={trainerIndex}>
                {trainer.name}
                <span className="ml-1 font-mono text-green-500">
                  (${trainer.money})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-2 flex items-center gap-4 border-t border-white/5 pt-2">
        {route.pp_cost !== undefined && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> PP Cost:{" "}
            <span className="">{route.pp_cost}</span>
          </div>
        )}
        {route.type === "action" && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
            Action Required
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteCard;
