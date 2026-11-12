import { RefreshCw } from "lucide-react";

import PageLayout from "@/components/PageLayout";
import RegionRoutes from "@/pages/trainer-rerun/components/RegionRoutes";
import { useTrainerRerunData } from "@/pages/trainer-rerun/hooks/useTrainerRerunData";
import { FEATURE_CONFIG } from "@/utils/featureConfig";

const TrainerRerunPage = () => {
  const accentColor = FEATURE_CONFIG["trainer-rerun"].color;
  const { trainerRerunData, isLoading, error } = useTrainerRerunData();

  if (error || (!isLoading && !trainerRerunData)) {
    return (
      <div className="flex h-screen items-center justify-center p-4 text-center text-red-400">
        <p>
          Failed to load Trainer Rerun data: {error?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  if (isLoading || !trainerRerunData) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        <p>Loading Trainer Rerun data...</p>
      </div>
    );
  }

  const { intro, requirements, tips_tricks } = trainerRerunData;

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
            <p
              key={`intro-p-${paragraph.substring(0, 20)}-${index}`}
              className="mb-2 text-slate-300"
            >
              {paragraph}
            </p>
          ))}
        </section>
      )}

      {requirements.items && requirements.items.length > 0 && (
        <section className="mb-8">
          {requirements.title && (
            <h2 className="mb-3 text-2xl font-bold">{requirements.title}</h2>
          )}
          <ul className="list-disc space-y-2 pl-5">
            {requirements.items.map((item, index) => (
              <li
                key={
                  typeof item === "string"
                    ? `${index}-${item.substring(0, 10)}`
                    : index
                }
                className="leading-relaxed"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {tips_tricks.items && tips_tricks.items.length > 0 && (
        <section className="mb-8">
          {tips_tricks.title && (
            <h2 className="mb-3 text-2xl font-bold">{tips_tricks.title}</h2>
          )}
          <ul className="list-disc space-y-2 pl-5">
            {tips_tricks.items.map((item, index) => (
              <li
                key={
                  typeof item === "string"
                    ? `${index}-${item.substring(0, 10)}`
                    : index
                }
                className="leading-relaxed"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <RegionRoutes regions={trainerRerunData.regions} />
    </PageLayout>
  );
};

export default TrainerRerunPage;
