import { Tag, theme } from 'antd';


interface TagBlockProps {
  inStock?: boolean;
  isTop?: boolean;
  discount?: number;
}
  const { useToken } = theme;
export const TagBlock: React.FC<TagBlockProps> = ({ inStock, isTop, discount }) => {
  const { token } = useToken();

   const getResponsiveTagStyle = (background: string | undefined) => {
    const baseStyle = {
      background: background || '#f0f0f0',
      color: token.tagTextColor || '#fff',
      borderRadius: token.tagBorderRadius || '6px',
      boxShadow: token.tagBoxShadow || 'none',
      border: 'none',
      fontWeight: 500,
      whiteSpace: 'nowrap' as const,
      flexShrink: 0,
      fontSize: 'clamp(12px, 2vw, 15px)',
      padding: 'clamp(4px, 1vw, 5px) clamp(4px, 2vw, 14px)',
    };
    
    return baseStyle;
  };

  return (
    <div className="flex gap-1 sm:gap-3 flex-nowrap sm:flex-wrap mb-2 overflow-x-auto">
      {inStock && (
        <Tag style={getResponsiveTagStyle(token.greenTagGradient)}>
          В наявності
        </Tag>
      )}
      {isTop && (
        <Tag style={getResponsiveTagStyle(token.blueTagGradient)}>
          Топ продажів
        </Tag>
      )}
      {discount && (
        <Tag style={getResponsiveTagStyle(token.redTagGradient)}>
          Знижка -{discount}%
        </Tag>
      )}
    </div>
  );
};