import { RefreshCw } from "lucide-react";
import React from "react";

import BulletList from "@/components/molecules/BulletList";
import RegionRoutes from "@/components/organisms/RegionRoutes";
import PageLayout from "@/components/templates/PageLayout";
import { getTrainerRerunData } from "@/services/trainerRerunService";
import { FEATURE_CONFIG } from "@/utils/featureConfig";

const TrainerRerunPage = () => {
  const accentColor = FEATURE_CONFIG["trainer-rerun"].color;
  const { intro, requirements, tips_tricks, regions } = getTrainerRerunData();

  return (
    <PageLayout title={intro.title} accentColor={accentColor}>
      {/* Header */}
      <div className="flex flex-col items-center space-y-2 text-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <RefreshCw style={{ color: accentColor }} size={32} />
          {intro.title}
        </h1>
        {intro.description.length > 0 && (
          <p className="max-w-2xl text-slate-400">{intro.description[0]}</p>
        )}
      </div>

      {intro.description.length > 1 && (
        <section className="mb-8 mt-4">
          {intro.description.slice(1).map((paragraph, index) => (
            <p key={index} className="mb-2 text-slate-300">
              {paragraph}
            </p>
          ))}
        </section>
      )}

      <BulletList title={requirements.title} items={requirements.items} />

      <BulletList title={tips_tricks.title} items={tips_tricks.items} />

      <RegionRoutes regions={regions} />
    </PageLayout>
  );
};

export default TrainerRerunPage;
