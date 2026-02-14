import FeatureCard from "@/components/molecules/FeatureCard";
import HomeFooter from "@/components/organisms/HomeFooter";
import HomeHero from "@/components/organisms/HomeHero";
import PageLayout from "@/components/templates/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { Feature, FEATURE_CONFIG } from "@/utils/featureConfig";

function Home() {
  const { currentUser } = useAuth();

  // Escludiamo "my-teams" dall'array principale per gestirlo separatamente
  const mainFeatures: Feature[] = Object.keys(FEATURE_CONFIG)
    .filter((key) => key !== "my-teams")
    .map((key) => FEATURE_CONFIG[key]);

  const teamsConfig = FEATURE_CONFIG["my-teams"];

  const authSection: Feature = {
    title: teamsConfig.title,
    description: currentUser
      ? teamsConfig.description
      : "Log in to create, save and manage your own custom strategic teams.",
    icon:
      (currentUser ? teamsConfig.icon : teamsConfig.lockedIcon) ||
      teamsConfig.icon,
    link: currentUser ? teamsConfig.link : "/login",
    color:
      (currentUser ? teamsConfig.color : teamsConfig.lockedColor) ||
      teamsConfig.color,
  };

  return (
    <PageLayout title="Home" containerClassName="space-y-10">
      <HomeHero />

      <section>
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-200">
          <span className="h-8 w-1 rounded-full bg-blue-500" />
          Tools & Guides
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {mainFeatures.map((section) => (
            <FeatureCard key={section.title} {...section} />
          ))}
          <FeatureCard {...authSection} />
        </div>
      </section>

      <HomeFooter />
    </PageLayout>
  );
}

export default Home;
