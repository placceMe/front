import React, { useEffect, useState } from 'react';
import { Descriptions, Spin, Tag } from 'antd';
import type { Product, CharacteristicDict } from '@shared/types/api';

interface Props {
  product: Product;
}

export const ProductSpecs: React.FC<Props> = ({ product }) => {
  const [characteristicDicts, setCharacteristicDicts] = useState<CharacteristicDict[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!product.categoryId) return;

    fetch(`/api/characteristicdict/category/${product.categoryId}`)
      .then(res => {
        if (!res.ok) throw new Error("Ошибка сети");
        return res.json();
      })
      .then(data => {
        setCharacteristicDicts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки characteristicDicts", err);
        setLoading(false);
      });
  }, [product.categoryId]);

  // Функция для отображения состояния
  const getStateDisplay = () => {
    if (product.isNew) {
      return <Tag color="green">Новий</Tag>;
    }
    
    // Маппинг состояний
    const stateMap: Record<string, { label: string; color: string }> = {
      'new': { label: 'Новий', color: 'green' },
      'used': { label: 'Вживаний', color: 'orange' },
      'good': { label: 'Хороший стан', color: 'lime' },
      'fair': { label: 'Задовільний стан', color: 'gold' },
      'poor': { label: 'Поганий стан', color: 'red' }
    };

    const state = stateMap[product.state?.toLowerCase()] || 
      { label: product.state || 'Не вказано', color: 'default' };
    
    return <Tag color={state.color}>{state.label}</Tag>;
  };

  if (loading) return <Spin tip="Завантаження характеристик..." />;

  return (
    <Descriptions bordered column={1} size="middle" title="">
      {/* Состояние товара - всегда первое */}
      <Descriptions.Item label="Стан товару">
        {getStateDisplay()}
      </Descriptions.Item>
      
      {/* Остальные характеристики */}
      {product.characteristics?.map((char) => (
        <Descriptions.Item key={char.id} label={char.characteristicDict.name || 'Характеристика'}>
          {char.value || '—'}
        </Descriptions.Item>
      ))}
      
      {(!product.characteristics || product.characteristics.length === 0) && (
        <Descriptions.Item label="Інформація">
          Немає додаткових характеристик
        </Descriptions.Item>
      )}
    </Descriptions>
  );
};