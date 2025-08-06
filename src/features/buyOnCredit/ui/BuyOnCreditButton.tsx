/*import { Button } from "antd";
import React from "react";
import { FONTS } from "@shared/constants/fonts";
import { COLORS } from "@shared/constants/colors";

interface Props {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const BuyOnCreditButton: React.FC<Props> = ({
  onClick,
  children = "Купити в кредит",
  className,
  style,
}) => (
  <Button
    size="large"
    className={`!bg-[#F8FAEC] !rounded-md !px-8 ${className || ""}`}
    style={{
      fontFamily: FONTS.family.montserratBold,
      fontWeight: FONTS.weight.bold,
      fontSize: FONTS.size.h6xs, // 15px
      color: COLORS.color04,
      borderColor: COLORS.color04,
      ...style,
    }}
    onClick={onClick}
  >
    {children}
  </Button>
);
*/