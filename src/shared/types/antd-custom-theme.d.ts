import 'antd/es/theme/interface';

declare module 'antd/es/theme/interface' {
    export interface AliasToken {
    greenTagGradient?: string;
    redTagGradient?: string;
    blueTagGradient?: string;
    tagTextColor?: string;
    tagFontSize?: number;
    tagPaddingVertical?: number;
    tagPaddingHorizontal?: number;
    tagBorderRadius?: number;
    tagBoxShadow?: string;
  }
}