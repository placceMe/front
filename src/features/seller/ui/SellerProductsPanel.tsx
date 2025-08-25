// features/seller/ui/SellerProductsPanel.tsx
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';
import { useRequest } from '@shared/request/useRequest';
import type { Product } from '@shared/types/api';
import { Pagination } from '@shared/ui/Pagination/Pagination';
import ProductCard from '../../../app/layouts/delete/ProductCard/ProductCard';


export const SellerProductsPanel: React.FC = () => {
  const navigate = useNavigate();
  const { request } = useRequest();

  const currentUserId = useAppSelector(s => s.user.user?.id);
  const activeRole = useAppSelector(s => s.user.activeRole);
  const isSupplier = activeRole === 'Saler';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => { setCurrentPage(1); }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;
    setLoading(true);
    const limit = 12;
    const offset = (currentPage - 1) * limit;

    request<any>(`/api/products/seller/${currentUserId}?limit=${limit}&offset=${offset}`)
      .then(res => {
        const items = Array.isArray(res?.products) ? res.products : [];
        setProducts(items);

        const pageSize = Number(res?.pagination?.pageSize) || limit;
        const totalItems = Number(res?.pagination?.totalItems) || items.length;
        const totalPagesFromApi = Number(res?.pagination?.totalPages);
        const computed = totalPagesFromApi && totalPagesFromApi > 0
          ? totalPagesFromApi
          : (totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1);

        setTotalPages(Math.max(1, computed));
      })
      .finally(() => setLoading(false));
  }, [currentUserId, currentPage]);

  return (
    <div className="container section seller-page own-view">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#2b3924]">Мої товари</h2>
        {isSupplier && (
          <Button type="primary" onClick={() => navigate('/profile/products/new')}>
            Додати товар
          </Button>
        )}
      </div>

      {loading ? (
        <div>Завантаження...</div>
      ) : products.length === 0 ? (
        <div className="text-sm text-gray-600">Поки що немає товарів.</div>
      ) : (
        <div className="category-grid">
          {products.map(p => (
            <div key={p.id}>
              <ProductCard product={p} isAvailable={(p.quantity ?? 0) > 0} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};
