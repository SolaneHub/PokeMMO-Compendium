import { RefreshCw } from "lucide-react";
import React from "react";

import PageTitle from "../../shared/components/PageTitle";
import RegionRoutes from "./components/RegionRoutes";
import RequirementsSection from "./components/RequirementsSection";
import TipsSection from "./components/TipsSection";
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

      <RequirementsSection
        title={requirements.title}
        items={requirements.items}
      />

      <TipsSection title={tips_tricks.title} items={tips_tricks.items} />

      <RegionRoutes regions={regions} />
    </div>
  );
};

export default TrainerRerunPage;
