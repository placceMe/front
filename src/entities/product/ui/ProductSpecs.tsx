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

export const ProductSpecs: React.FC<Props> = ({
  product
}) => {
  return (
    <Descriptions bordered column={1} size="middle" title="Характеристики">
      {Object.entries(descDict).map(([key, label]) => (
        <Descriptions.Item key={key} label={label}>
          {
            (() => {
              const value = product[key as keyof Product];
              if (typeof value === 'string' || typeof value === 'number') {
                return value;
              }
              if (Array.isArray(value)) {
                return value.length > 0 ? value.map((v) => typeof v === 'string' || typeof v === 'number' ? v : JSON.stringify(v)).join(', ') : 'Немає даних';
              }
              if (value && typeof value === 'object') {
                return JSON.stringify(value);
              }
              return 'Немає даних';
            })()
          }
        </Descriptions.Item>
      ))}
    </Descriptions>
  );
};
