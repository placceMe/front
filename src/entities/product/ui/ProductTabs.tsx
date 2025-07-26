import { Tabs } from 'antd';
import { ProductSpecs } from './ProductSpecs';
import type { Product } from '@shared/types/api';

interface Props {
  product: Product;
}

export const ProductTabs = ({ product }: Props) => {
  const items = [
    {
      key: '1',
      label: 'Характеристики',
      children: <ProductSpecs product={product} />,
    },
    {
      key: '2',
      label: 'Доставка',
      children: <p>Доставка в Дніпро та інші регіони України</p>,
    },
    {
      key: '3',
      label: 'Відгуки',
      children: <p>Сергій К: Шолом зручний, легкий і міцний</p>,
    },
  ];

  return <Tabs items={items} />;
};
