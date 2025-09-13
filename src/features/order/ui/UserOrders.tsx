// features/order/ui/UserOrders.tsx
import React, { useState, useEffect } from 'react';
import type { OrderResponse, OrderItemResponse, Product } from '@shared/types/api';
import { useRequest } from '@shared/request/useRequest';
import { useAppSelector } from '@store/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '@store/store';
import { formatPrice } from '@shared/lib/formatPrice';
import { message, Modal, Input, Rate } from 'antd';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const FILES_BASE_URL = __BASE_URL__ + '/api/files/file/';
const API_PRODUCTS = __BASE_URL__ + "/api/products";
const ORDERS_PER_PAGE = 5;

const ORDER_STATUS_MAP: Record<string, { label: string; color: string }> = {
  Pending: { label: "Нове", color: "text-yellow-600" },
  Confirmed: { label: "Підтверджено", color: "text-green-600" },
  Shipped: { label: "Відправлено", color: "text-blue-600" },
  Delivered: { label: "Доставлено", color: "text-gray-600" },
  Cancelled: { label: "Скасовано", color: "text-pink-600" },
  Rejected: { label: "Відхилено", color: "text-red-600" }
};

const { TextArea } = Input;

interface ReviewData {
  content: string;
  ratingService: number;
  ratingSpeed: number;
  ratingDescription: number;
  ratingAvailable: number;
  productId: string;
  userId: string;
}

export const UserOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productImages, setProductImages] = useState<Record<string, string>>({});
  const [reviewModal, setReviewModal] = useState({
    visible: false,
    productId: '',
    productName: '',
  });
  const [reviewForm, setReviewForm] = useState<Omit<ReviewData, 'productId' | 'userId'>>({
    content: '',
    ratingService: 0,
    ratingSpeed: 0,
    ratingDescription: 0,
    ratingAvailable: 0,
  });

  const { user } = useAppSelector(state => state.user);
  const customerId = user?.id;
  const { request } = useRequest();
  const { current, rates } = useSelector((state: RootState) => state.currency);

  useEffect(() => {
    if (!customerId) return;
    request<OrderResponse[]>(`/api/orders/user/${customerId}`)
      .then((data) => {
        if (data) {
          setOrders(data.reverse());
        } else {
          setOrders([]);
        }
      })
      .catch(() => setOrders([]));
  }, [customerId]);

  useEffect(() => {
    const visibleOrders = orders.slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE);
    const productIds: string[] = [];
    visibleOrders.forEach(order =>
      (order.items || []).slice(0, 3).forEach((item: OrderItemResponse) => {
        if (item.productId && !(item.productId in productImages)) {
          productIds.push(item.productId);
        }
      })
    );
    if (productIds.length === 0) return;
    Promise.all(
      productIds.map(async (id) => {
        const product = await request<Product>(`/api/products/${id}`);
        return { id, mainImageUrl: product?.mainImageUrl || '' };
      })
    ).then((results) => {
      const update: Record<string, string> = {};
      results.forEach(({ id, mainImageUrl }) => {
        update[id] = mainImageUrl;
      });
      setProductImages((prev) => ({ ...prev, ...update }));
    });
  }, [orders, currentPage]);

  const openReviewModal = (productId: string, productName: string) => {
    setReviewModal({ visible: true, productId, productName });
  };

  const closeReviewModal = () => {
    setReviewModal({ visible: false, productId: '', productName: '' });
    setReviewForm({ content: '', ratingService: 0, ratingSpeed: 0, ratingDescription: 0, ratingAvailable: 0 });
  };

  const submitReview = async () => {
    if (Object.values(reviewForm).some(v => v === 0)) {
      message.error('Будь ласка, поставте всі оцінки');
      return;
    }
    try {
      const reviewData: ReviewData = {
        ...reviewForm,
        productId: reviewModal.productId,
        userId: customerId || '',
      };
      const response = await fetch(`${API_PRODUCTS}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      if (response.ok) {
        message.success('Відгук успішно відправлено');
        closeReviewModal();
      } else {
        message.error('Помилка при відправці відгуку');
      }
    } catch {
      message.error('Помилка при відправці відгуку');
    }
  };

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const visibleOrders = orders.slice(startIndex, startIndex + ORDERS_PER_PAGE);

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4 text-[#3E4826]">Ваші замовлення</h2>
      {visibleOrders.map(order => (
        <div key={order.id} className="border p-4 rounded bg-white mb-4">
          <div className="flex justify-between">
            <div>
              <p>Замовлення #{String(order.id).replace(/\D/g, '')}</p>
              <p className={ORDER_STATUS_MAP[order.status]?.color ?? 'text-gray-400'}>
                {ORDER_STATUS_MAP[order.status]?.label ?? `Статус: ${order.status}`}
              </p>
            </div>
            <p>{formatPrice(order.totalAmount, current, rates)}</p>
          </div>
          <div>
            {(order.items || []).map((item: OrderItemResponse, i) => (
              <div key={i} className="flex justify-between items-center">
                <p>{item.productName} × {item.quantity}</p>
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => openReviewModal(item.productId, item.product?.title)}
                >Залишити відгук</button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex gap-2 justify-center">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><FaChevronLeft /></button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}><FaChevronRight /></button>
        </div>
      )}

      <Modal
        title={`Залишити відгук для ${reviewModal.productName}`}
        open={reviewModal.visible}
        onOk={submitReview}
        onCancel={closeReviewModal}
        okText="Відправити відгук"
        cancelText="Скасувати"
        width={600}
      >
        <div className="space-y-4">
          <TextArea
            rows={4}
            value={reviewForm.content}
            onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Поділіться своїми враженнями про товар..."
          />
          <div className="grid grid-cols-2 gap-4">
            <div><label>Оцінка сервісу:</label><Rate value={reviewForm.ratingService} onChange={(value) => setReviewForm(prev => ({ ...prev, ratingService: value }))} /></div>
            <div><label>Швидкість доставки:</label><Rate value={reviewForm.ratingSpeed} onChange={(value) => setReviewForm(prev => ({ ...prev, ratingSpeed: value }))} /></div>
            <div><label>Відповідність опису:</label><Rate value={reviewForm.ratingDescription} onChange={(value) => setReviewForm(prev => ({ ...prev, ratingDescription: value }))} /></div>
            <div><label>Наявність товару:</label><Rate value={reviewForm.ratingAvailable} onChange={(value) => setReviewForm(prev => ({ ...prev, ratingAvailable: value }))} /></div>
          </div>
        </div>
      </Modal>
    </div>
  );
};