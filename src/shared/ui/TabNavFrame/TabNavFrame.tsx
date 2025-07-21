/*
import React from 'react';

interface Tab {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabNavFrameProps {
  tabs: Tab[];
  value: string;
  onChange: (key: string) => void;
  backgroundImage?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const TabNavFrame: React.FC<TabNavFrameProps> = ({
  tabs,
  value,
  onChange,
  backgroundImage,
  className = '',
  style = {},
  children
}) => {
  const BLUR_STYLE = {
    background: "rgba(229,229,216,0.7)",
    backdropFilter: "blur(14px)",
    border: "1px solid #3E4826",
  };

  return (
    <div
      className={`w-full bg-cover bg-center bg-no-repeat ${className}`}
      style={{
        backgroundImage: backgroundImage ? `url('${backgroundImage}')` : undefined,
        paddingTop: backgroundImage ? "40px" : "20px",
        paddingBottom: backgroundImage ? "50px" : "20px",
        ...style,
      }}
    >
      <div
        className="max-w-[1400px] mx-auto px-6 rounded-sm shadow-lg"
        style={{
          background: backgroundImage ? "rgba(229,229,216,0.5)" : "rgba(249,249,249,0.8)",
          backdropFilter: "blur(20px)",
          border: backgroundImage ? "1px solid #E5E5D8" : "1px solid #ddd",
        }}
      >
  
        <div className="flex flex-wrap gap-2 px-8 py-6 border-b" style={{ borderColor: backgroundImage ? '#E5E5D8' : '#ddd' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                ${value === tab.key
                  ? 'text-white shadow-md'
                  : 'text-gray-700 hover:shadow-sm'
                }
              `}
              style={{
                background: value === tab.key
                  ? "linear-gradient(90deg, #425024 0%, #536043 100%)"
                  : BLUR_STYLE.background,
                backdropFilter: value !== tab.key ? 'blur(14px)' : undefined,
                border: value !== tab.key ? '1px solid #3E4826' : 'none',
              }}
            >
              {tab.icon && (
                <span className={`flex-shrink-0 ${value === tab.key ? 'text-white' : 'text-[#425024]'}`}>
                  {tab.icon}
                </span>
              )}
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>

       
        {children && (
          <div className="px-8 py-6">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
*/

import { Tabs } from 'antd';
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
  <div className={`flex gap-3 ${className ?? ''}`} style={style}>
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
);






//////UPPER IS WORK//////////////////////////////////////




/*
import React from "react";

interface Tab {
  key: string;
  label: string;
  icon?: React.ElementType;
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
  <div className={`flex gap-2 ${className ?? ""}`} style={style}>
    {tabs.map(tab => {
      const isActive = value === tab.key;
      const Icon = tab.icon;
      return (
        <button
          key={tab.key}
          className={
            `flex items-center gap-1 px-3 py-1 rounded-lg border
            text-base font-medium transition-all
            ${isActive
              ? 'bg-[#454E30] text-white border-transparent shadow'
              : 'bg-[#F4F4E7] text-[#3E472C] border-[#454E30]'
            }`
          }
          style={{
            boxShadow: isActive ? '0 3px 8px rgba(70,80,40,.10)' : undefined,
            borderWidth: 2,
          }}
          onClick={() => onChange(tab.key)}
        >
          {Icon && <Icon fill={isActive ? "#fff" : "#3E472C"} width={16} height={16} />}
          <span style={{ fontSize: 14 }}>{tab.label}</span>
        </button>
      );
    })}
  </div>
);
*/