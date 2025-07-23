import React from "react";
import { TabNavFrame } from "@shared/ui/TabNavFrame/TabNavFrame";
import { BlurBlock } from "@shared/ui/BlurBlock";

interface TabPaperProps {
  tabs: { key: string; label: string; icon?: React.ReactNode }[];
  mainBg?: string;           
  className?: string;
  children: (tab: string) => React.ReactNode;
}

export const TabPaper: React.FC<TabPaperProps> = ({
  tabs,
  mainBg,
  className = "",
  children
}) => {

  const [tab, setTab] = React.useState(() => {
    const hash = window.location.hash.replace("#", "");
    return tabs.find(t => t.key === hash) ? hash : tabs[0].key;
  });

  React.useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      setTab(tabs.find(t => t.key === hash) ? hash : tabs[0].key);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [tabs]);

  const handleChangeTab = (key: string) => {
    setTab(key);
    window.location.hash = `#${key}`;
  };

  const isMain = tab === tabs[0].key;

  return (
    <div className="w-full py-10" style={{ background: isMain && mainBg ? `url('${mainBg}') center top/cover no-repeat` : "#F5F6F2" }}>
      <div className="flex justify-center items-center min-h-[500px]">
        <BlurBlock
          className={className}
          paper={!isMain} 
        >
          <div className="mb-6">
            <TabNavFrame tabs={tabs} value={tab} onChange={handleChangeTab} />
          </div>
          {children(tab)}
        </BlurBlock>
      </div>
    </div>
  );
};
