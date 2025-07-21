/*import React from "react";

interface BlurBlockProps {
  children: React.ReactNode;
  backgroundImage?: string;
  className?: string;
  style?: React.CSSProperties;
  innerClassName?: string; // чтобы передать стили вовнутрь, если нужно
  innerStyle?: React.CSSProperties;
}
export const BlurBlock: React.FC<BlurBlockProps> = ({
  children,
  backgroundImage = "/src/assets/productCard/bg.png",
  className = "",
  style = {},
  innerClassName = "",
  innerStyle = {},
}) => (
  <div
    className={`w-full bg-cover bg-center bg-no-repeat ${className}`}
    style={{
      backgroundImage: `url('${backgroundImage}')`,
      paddingTop: "40px",
      paddingBottom: "50px",
      ...style,
    }}
  >
 
 
    <div
      className={
        "max-w-[1400px] mx-auto gap-8 rounded-sm shadow-lg px-8 py-6" +
        innerClassName
      }
      style={{
        background: "rgba(229,229,216,0.5)",
        backdropFilter: "blur(20px)",
        border: "1px solid #E5E5D8",
        ...innerStyle,
      }}
    >
      {children}
    </div>
  </div>
);

*/  {/** <div
      className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row gap-8 rounded-sm shadow-lg px-8 py-6"
      style={{
        background: "rgba(229,229,216,0.5)",
        backdropFilter: "blur(20px)",
        border: "1px solid #E5E5D8",
      }}
    > */}
///////////////////////////////////////////

interface BlurBlockProps {
  children: React.ReactNode;
  backgroundImage?: string;
  className?: string;
  style?: React.CSSProperties;
  innerClassName?: string;
  innerStyle?: React.CSSProperties;
  paper?: boolean;  // <---- новый проп!
}

export const BlurBlock: React.FC<BlurBlockProps> = ({
  children,
  backgroundImage,
  className = "",
  style = {},
  innerClassName = "",
  innerStyle = {},
  paper = false,     // <---- новый проп!
}) => {
  // если paper === true, то НЕ показывать ни backgroundImage, ни blur
  const isPaper = paper;

  return (
    <div
      className={`w-full ${backgroundImage && !isPaper ? "bg-cover bg-center bg-no-repeat" : ""} ${className}`}
      style={{
        ...(backgroundImage && !isPaper ? { backgroundImage: `url('${backgroundImage}')` } : {}),
        paddingTop: "40px",
        paddingBottom: "50px",
        ...style,
      }}
    >
      <div
        className={
          "max-w-[1400px] mx-auto gap-8 rounded-sm shadow-lg px-8 py-6 " +
          innerClassName
        }
        style={{
          // если paper — просто зелёный прозрачный фон, иначе blur
          ...(isPaper
            ? {
                background: "rgba(141, 184, 111, 0.22)", // любой твой полупрозрачный цвет!
                border: "1px solid #3E4826",
              }
            : {
                background: "rgba(229,229,216,0.5)",
                backdropFilter: "blur(20px)",
                border: "1px solid #E5E5D8",
              }),
          ...innerStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
};
