import { RefreshCw } from "lucide-react";
import React from "react";

import PageTitle from "../../shared/components/PageTitle";
import { getTrainerRerunData } from "./data/trainerRerunService";

const TrainerRerunPage = () => {
  const { intro, requirements, tips_tricks, regions } = getTrainerRerunData();

  return (
    <div className="container mx-auto space-y-8 pb-24">
      <PageTitle title={intro.title} />

      {/* Header */}
      <div className="flex flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <RefreshCw className="text-green-500" size={32} />
          {intro.title}
        </h1>
        {intro.description.length > 0 && (
          <p className="max-w-2xl text-slate-400">{intro.description[0]}</p>
        )}
      </div>

      {intro.description.length > 1 && (
        <section className="mb-8">
          {intro.description.slice(1).map((paragraph, index) => (
            <p key={index} className="mb-2 text-slate-300">
              {paragraph}
            </p>
          ))}
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-slate-200">
          {requirements.title}
        </h2>
        <ul className="list-disc pl-5 text-slate-300">
          {requirements.items.map((item, index) => (
            <li key={index} className="mb-1">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-slate-200">
          {tips_tricks.title}
        </h2>
        <ul className="list-disc pl-5 text-slate-300">
          {tips_tricks.items.map((item, index) => (
            <li key={index} className="mb-1">
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Placeholder for regions and routes */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-slate-200">
          Trainer Routes
        </h2>
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
    </div>
  );
};

export default TrainerRerunPage;
