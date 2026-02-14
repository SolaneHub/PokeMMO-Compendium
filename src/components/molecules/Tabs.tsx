interface TabsProps<T extends string> {
  tabs: T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  className?: string;
}

const Tabs = <T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: TabsProps<T>) => {
  return (
    <div
      className={`scrollbar-hide z-10 flex shrink-0 overflow-x-auto border-b border-white/5 bg-[#0f1014] ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`relative min-w-[80px] flex-1 py-3.5 text-sm font-semibold tracking-wide whitespace-nowrap transition-colors ${
            activeTab === tab
              ? "text-blue-400 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-blue-600 after:content-['']"
              : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
