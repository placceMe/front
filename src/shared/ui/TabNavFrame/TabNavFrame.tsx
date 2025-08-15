
import React from 'react';

interface Tab {
  key: string;
  label: string;
  icon?: ((active: boolean) => React.ReactNode) | React.ReactNode;

}

interface TabNavFrameProps {
  tabs: Tab[];
  value: string;
  onChange: (key: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const TabNavFrame: React.FC<TabNavFrameProps> = ({
  tabs, value, onChange, className, style
}) => (
  <>
    <style>{`
      .tab-scroll {
        overflow: visible;
        flex-wrap: wrap;
         scrollbar-width: none;    
      }
      .tab-scroll > * { flex-shrink: 0; }
      .tab-scroll::-webkit-scrollbar { /* Chrome, Safari, Opera */
        display: none;
      }
      @media (max-width: 768px) {
        .tab-scroll {
          overflow-x: auto;           
          -webkit-overflow-scrolling: touch;
          flex-wrap: nowrap;          
          white-space: nowrap;        
          gap: 8px;
          padding: 0 8px 6px;         
          scroll-snap-type: x proximity;
        }
        .tab-scroll::-webkit-scrollbar { height: 6px; }
        .tab-scroll::-webkit-scrollbar-thumb { background: #d7d7cf; border-radius: 4px; }
        .tab-scroll > button { scroll-snap-align: start; }
      }
    `}</style>
    <div className={`tab-scroll flex gap-3 ${className ?? ''}`} style={style}>
      {tabs.map(tab => {
        const isActive = value === tab.key;
        return (
          <button
            key={tab.key}
            className={
              `flex items-center h-8 gap-2 px-2 py-0 rounded-md border text-[13px] font-semibold transition-all
            ${isActive
                ? 'bg-[#454E30] text-white border-transparent'
                : 'bg-[#F4F4E7] text-[#3E472C] border-[#3E472C]'
              }`
            }
            onClick={() => onChange(tab.key)}
          >
            {typeof tab.icon === "function" ? tab.icon(isActive) : tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  </>
);