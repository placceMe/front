

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from './../app/layouts/delete/ProductCard/ProductCard';
import type { Product } from '@shared/types/api';
import { useRequest } from '@shared/request/useRequest';
import { Pagination } from '@shared/ui/Pagination/Pagination';




const CategoryProductsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string; }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { request } = useRequest();
  const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
  // Загружаем товары


  {/**
  useEffect(() => {
    setLoading(true);
    request<Product[]>("/api/products/category/" + categoryId)
      .then(data => {
        if (data) setProducts(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!categoryId) return;

    request<{ name: string; }>(`/api/category/${categoryId}`)
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
 */}


  // Загружаем товары

 useEffect(() => {
  if (!categoryId) return;
  setLoading(true);
  const limit = 12;
  const offset = (currentPage - 1) * limit;

  request<Product[]>(`/api/products/category/${categoryId}?limit=${limit}&offset=${offset}`)
    .then(data => {
      if (data) {
        setProducts(data);
        setTotalPages(Math.ceil(100 / limit)); // ⚠️ TODO: заменить 100 на count из бэка
      }
    })
    .finally(() => setLoading(false));
}, [categoryId, currentPage]);

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
       
      </h2>
     {loading ? (
  <div>Завантаження...</div>
) : (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 32,
  }}>
    {products.map((product) => (
      <div key={product.id} style={{ padding: 12 }}>
        <ProductCard
          product={product}
          isAvailable={product.quantity > 0}
        />
      </div>
    ))}
  </div>
)}

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
    </div>
  );
};

export default CategoryProductsPage;
