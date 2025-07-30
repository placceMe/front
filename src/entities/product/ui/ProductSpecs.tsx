import type { Product } from '@shared/types/api';
import { Descriptions } from 'antd';

interface Props {
  product: Product;
}

export const ProductSpecs = ({
  // product 
}: Props) => {
  return (
    <Descriptions bordered column={1} size="middle" title="Характеристики">
      <Descriptions.Item label="Матеріал">Арамідне волокно / Кевлар</Descriptions.Item>
      <Descriptions.Item label="Рівень захисту">NIJ IIIA</Descriptions.Item>
      <Descriptions.Item label="Вага">~1.3–1.5 кг</Descriptions.Item>
      <Descriptions.Item label="Розміри">M / L / XL</Descriptions.Item>
      <Descriptions.Item label="Система кріплень">3 бокові рейки, NVG</Descriptions.Item>
      <Descriptions.Item label="Підвісна система">4-точковий ремінь</Descriptions.Item>
      <Descriptions.Item label="Покриття">Матова, стійка до вологи</Descriptions.Item>
      <Descriptions.Item label="Додатково">Панель для патчів</Descriptions.Item>
    </Descriptions>
  );
};
