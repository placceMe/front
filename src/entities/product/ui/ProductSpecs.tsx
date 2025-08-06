import React, { useEffect, useState } from 'react';
import { Descriptions, Spin } from 'antd';
import type { Product, CharacteristicDict } from '@shared/types/api';

interface Props {
  product: Product;
}

export const ProductSpecs: React.FC<Props> = ({ product }) => {
  const [characteristicDicts, setCharacteristicDicts] = useState<CharacteristicDict[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!product.categoryId) return;

  console.log("характеристики по категории:", product.categoryId);
  fetch(`/api/characteristicdict/category/${product.categoryId}`)
    .then(res => {
      if (!res.ok) throw new Error("Ошибка сети");
      return res.json();
    })
    .then(data => {
      console.log("Получены characteristicDicts:", data);
      setCharacteristicDicts(data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Ошибка загрузки characteristicDicts", characteristicDicts, err);
      setLoading(false);
    });
}, [product.categoryId]);



  {/**
  const dictMap = useMemo(() => {
    const map: Record<string, string> = {};
    characteristicDicts.forEach((dict) => {
      map[dict.id] = dict.name;
    });
    return map;
  }, [characteristicDicts]);
 */}
  

  if (loading) return <Spin tip="Завантаження характеристик..." />;

  if (!product.characteristics || product.characteristics.length === 0) {
    return <p>Немає характеристик</p>;
  }

  return (
<Descriptions bordered column={1} size="middle" title="">
  {product.characteristics.map((char) => (
 <Descriptions.Item key={char.id} label={char.name || 'Характеристика'}>
  {char.value || '—'}
</Descriptions.Item>

  ))}
</Descriptions>

  );
};

