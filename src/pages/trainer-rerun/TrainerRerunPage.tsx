import { RefreshCw } from "lucide-react";

import BulletList from "@/components/molecules/BulletList";
import RegionRoutes from "@/components/organisms/RegionRoutes";
import PageLayout from "@/components/templates/PageLayout";
import { useTrainerRerunData } from "@/hooks/useTrainerRerunData";
import { RegionRoute } from "@/types/trainerRerun";
import { FEATURE_CONFIG } from "@/utils/featureConfig";

const TrainerRerunPage = () => {
  const accentColor = FEATURE_CONFIG["trainer-rerun"].color;
  const { trainerRerunData, isLoading } = useTrainerRerunData();

  if (isLoading || !trainerRerunData) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        <p>Loading Trainer Rerun data...</p>
      </div>
    );
  }

  const { intro, requirements, tips_tricks, regions } = trainerRerunData;

  // Adapt regions to match RegionRoute interface if needed
  const adaptedRegions: RegionRoute[] = regions.map((region) => ({
    name: region.name,
    routes: region.routes.map((route) => {
      const r: Record<string, unknown> = {
        name: route.name,
      };
      if (route.notes) r["notes"] = route.notes;
      if (route.trainers) r["trainers"] = route.trainers;
      if (route.pp_cost !== undefined) r["pp_cost"] = route.pp_cost;
      if (route.type !== undefined) r["type"] = route.type;
      return r as unknown as RegionRoute["routes"][0];
    }),
  }));

  return (
    <PageLayout title={intro.title}>
      {/* Header */}
      <div className="flex flex-col items-center space-y-2 text-center text-white">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <RefreshCw style={{ color: accentColor }} size={32} />
          {intro.title}
        </h1>
        {intro.description.length > 0 && (
          <p className="max-w-2xl text-slate-400">{intro.description[0]}</p>
        )}
      </div>

      {intro.description.length > 1 && (
        <section className="mt-4 mb-8 text-white">
          {intro.description.slice(1).map((paragraph, index) => (
            <p key={index} className="mb-2 text-slate-300">
              {paragraph}
            </p>
          ))}
        </section>
      )}

      <BulletList title={requirements.title} items={requirements.items} />

      <BulletList title={tips_tricks.title} items={tips_tricks.items} />

      <RegionRoutes regions={adaptedRegions} />
    </PageLayout>
  );
};

export default TrainerRerunPage;
