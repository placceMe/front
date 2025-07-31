import type { Product } from '@shared/types/api';
import { Descriptions } from 'antd';

interface Props {
  product: Product;
}

const descDict = {
  material: "Матеріал",
  protectionLevel: "Рівень захисту",
  weight: "Вага",
  sizes: "Розміри",
};

export const ProductSpecs = ({
  product
}: Props) => {
  return (
    <Descriptions bordered column={1} size="middle" title="Характеристики">
      {Object.entries(descDict).map(([key, label]) => (
        <Descriptions.Item key={key} label={label}>
          {product[key as keyof Product] || 'Немає даних'}
        </Descriptions.Item>
      ))}
    </Descriptions>
  );
};
