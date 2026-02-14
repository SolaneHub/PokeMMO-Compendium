import { ReactNode } from "react";

import PageTitle from "@/components/atoms/PageTitle";

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  withTitle?: boolean;
  accentColor?: string | null;
}

const PageLayout = ({
  title,
  children,
  className = "",
  containerClassName = "",
  withTitle = true,
  accentColor = null,
}: PageLayoutProps) => {
  return (
    <div
      className={`flex flex-1 animate-[fade-in_0.3s_ease-out] flex-col overflow-x-hidden overflow-y-auto scroll-smooth p-4 lg:p-8 ${className}`}
    >
      {withTitle && title && (
        <PageTitle title={`PokéMMO Compendium: ${title}`} />
      )}
      <div
        className={`mx-auto w-full flex-1 space-y-8 pb-24 ${containerClassName}`}
      >
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
