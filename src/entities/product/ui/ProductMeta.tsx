import { Typography } from 'antd';
import { FONTS } from '@shared/constants/fonts';
import { COLORS } from '@shared/constants/colors';

const { Text } = Typography;

interface ProductMetaProps {
  code: string;
  label?: string;
}

export const ProductMeta = ({ code, label = 'Код товару:' }: ProductMetaProps) => (
  <div className="flex items-center gap-2 mb-1">
    <Text
      style={{
        fontFamily: FONTS.family.montserrat,
        fontWeight: FONTS.weight.semibold,
        fontSize: 15,
        color: COLORS.color05,
        marginRight: 4,
      }}
    >
      {label}
    </Text>
    <Text
      style={{
        fontFamily: FONTS.family.montserrat,
        fontWeight: FONTS.weight.regular,
        fontSize:  FONTS.size.h6xs,
        color: COLORS.color05,
      }}
    >
      {code}
    </Text>
  </div>
);
