

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from './../app/layouts/delete/ProductCard/ProductCard';
import type { Product } from '@shared/types/api';
import { useRequest } from '@shared/request/useRequest';


const CategoryProductsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>('');
  const { request } = useRequest();
  // Загружаем товары

useEffect(() => {
  setLoading(true);
  request<Product[]>("/api/products")
    .then(data => {
      if (data) setProducts(data);
    })
    .finally(() => setLoading(false));
}, []);

useEffect(() => {
  if (!categoryId) return;

  request<{ name: string }>(`/api/category/${categoryId}`)
    .then(category => {
      if (category) setCategoryName(category.name);
      else setCategoryName('');
    })
    .catch(() => setCategoryName(''));
}, [categoryId]);

  // Фильтруем товары по категории
  const filteredProducts = products.filter(
    (product) => product.categoryId === categoryId
  );

  return (
    <div className="category-products-page" style={{
      maxWidth: 1400,
      margin: '0 auto',
      padding: '32px 16px 48px 16px',
      minHeight: '80vh',
      borderRadius: 16,
    }}>
      <h2 style={{
        fontWeight: 700,
        fontSize: 28,
        marginBottom: 32,
        color: '#212910',
        letterSpacing: '0.01em',
      }}>
        {filteredProducts.length > 0
          ? `Товари категорії: ${categoryName || '...'}`
          : 'У цій категорії немає товарів'}
      </h2>
      {loading ? (
        <div>Завантаження...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 32,
        }}>
          {filteredProducts.map((product) => (
            <div key={product.id} style={{ padding: 12 }}>
              <ProductCard
                id={product.id}
                title={product.title}
                mainImageUrl={product.mainImageUrl}
                price={product.price}
                isAvailable={product.quantity > 0}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProductsPage;
