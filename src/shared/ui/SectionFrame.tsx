import React from "react";

interface SectionFrameProps {
  hero?: string | null;
  children: React.ReactNode;
  containerClass?: string;
  paper?: boolean;
}

export const SectionFrame: React.FC<SectionFrameProps> = ({
  hero,
  children,
  containerClass = "",
  paper = false,
}) => (
  <div className="min-h-screen w-full relative bg-black">
    {hero && (
      <div
        className="w-full h-[300px] bg-cover bg-center rounded-b-[48px]"
        style={{ backgroundImage: `url(${hero})` }}
      />
    )}
    <div className={`max-w-[1400px] mx-auto ${containerClass} ${paper ? "backdrop-blur-[20px] bg-white/70 border rounded-3xl shadow-xl p-8 -mt-24 relative z-10" : ""}`}>
      {children}
    </div>
  </div>
);
