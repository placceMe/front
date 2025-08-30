
import React, { useState, useEffect } from 'react';
import { FaChevronUp, FaChevronDown, FaChevronLeft, FaChevronRight, FaCheck, FaTimes, FaStar } from 'react-icons/fa';
import type { OrderResponse, OrderItemResponse, Product } from '@shared/types/api';
import { useRequest } from '@shared/request/useRequest';
import { useAppSelector } from '@store/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '@store/store';
import { formatPrice } from '@shared/lib/formatPrice';
import { message, Modal, Input, Rate } from 'antd';

const FILES_BASE_URL = __BASE_URL__ + '/api/files/file/';
const API_ORDERS = __BASE_URL__ + "/api/orders";
const API_PRODUCTS = __BASE_URL__ + "/api/products";

//const FILES_BASE_URL = "http://31.42.190.94:8080/api/files/file/";
const ORDERS_PER_PAGE = 5;

const ORDER_STATUS_MAP: Record<number, { label: string; color: string; }> = {
  0: { label: "Нове", color: "text-yellow-600" },
  1: { label: "Підтверджено", color: "text-green-600" },
  2: { label: "Відправлено", color: "text-blue-600" },
  3: { label: "Доставлено", color: "text-gray-600" },
  4: { label: "Скасовано", color: "text-pink-600" },
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

const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productImages, setProductImages] = useState<Record<string, string>>({});
  const [processingOrders, setProcessingOrders] = useState<Set<string>>(new Set());
  const [reviewModal, setReviewModal] = useState<{
    visible: boolean;
    productId: string;
    productName: string;
  }>({
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

  const { user, activeRole } = useAppSelector(state => state.user);

  const customerId = user?.id;
  const { request } = useRequest();
  const { current, rates } = useSelector((state: RootState) => state.currency);




  useEffect(() => {
    if (!customerId) return;
    let mounted = true;

    request<OrderResponse[]>(`/api/orders/user/${customerId}`)
      .then((data) => {
        if (data && mounted) {
          setOrders(data.reverse());
        } else {
          setOrders([]);
        }
      })
      .catch(() => setOrders([]));

    return () => {
      mounted = false;
    };
  }, [customerId]);



  useEffect(() => {
    const visibleOrders = orders.slice(
      (currentPage - 1) * ORDERS_PER_PAGE,
      currentPage * ORDERS_PER_PAGE
    );

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
        const product = await await request<Product>(`/api/products/${id}`);
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

  const confirmOrderRequest = async (id: string) => {
    try {
      const res = await fetch(`${API_ORDERS}/${id}/confirm`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" }),
      });
      if (!res.ok) throw new Error();
      message.success("Замовлення підтверджено");
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: "Confirmed", updatedAt: new Date().toISOString() } : o)));
    } catch {
      message.error("Помилка при підтвердженні замовлення");
    }
  };

  const rejectOrderRequest = async (id: string) => {
    try {
      const res = await fetch(`${API_ORDERS}/${id}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected" }),
      });
      if (!res.ok) throw new Error();
      message.success("Замовлення відхилено");
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: "Rejected", updatedAt: new Date().toISOString() } : o)));
    } catch {
      message.error("Помилка при відхиленні замовлення");
    }
  };

  const confirmOrder = (orderId: string) => {
    confirmOrderRequest(orderId);
  };

  const rejectOrder = (orderId: string) => {
    rejectOrderRequest(orderId);
  };
  const canConfirmOrder = (status: string) => {
    return status.toLowerCase() !== "confirmed" && activeRole === "Saler"; // Only "New" orders can be confirmed/rejected
  };
  const canRejectOrder = (status: string) => {
    return status.toLowerCase() !== "rejected" && activeRole === "Saler"; // Only "New" orders can be confirmed/rejected
  };

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const visibleOrders = orders.slice(startIndex, startIndex + ORDERS_PER_PAGE);

  const toggleExpand = (id: string) => setExpandedId(prev => (prev === id ? null : id));

  const openReviewModal = (productId: string, productName: string) => {
    setReviewModal({
      visible: true,
      productId,
      productName,
    });
  };

  const closeReviewModal = () => {
    setReviewModal({
      visible: false,
      productId: '',
      productName: '',
    });
    setReviewForm({
      content: '',
      ratingService: 0,
      ratingSpeed: 0,
      ratingDescription: 0,
      ratingAvailable: 0,
    });
  };

  const submitReview = async () => {
    // if (!reviewForm.content.trim()) {
    //   message.error('Будь ласка, залиште коментар');
    //   return;
    // }

    if (reviewForm.ratingService === 0 || reviewForm.ratingSpeed === 0 ||
      reviewForm.ratingDescription === 0 || reviewForm.ratingAvailable === 0) {
      message.error('Будь ласка, поставте всі оцінки');
      return;
    }

    try {
      const reviewData: ReviewData = {
        ...reviewForm,
        productId: reviewModal.productId,
        userId: customerId || '',
      };
      console.log('Sending review data:', reviewData);

      const response = await fetch(`${API_PRODUCTS}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        message.success('Відгук успішно відправлено');
        closeReviewModal();
      } else {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        message.error('Помилка при відправці відгуку');
      }
    } catch (error) {
      console.error('Request error:', error);
      message.error('Помилка при відправці відгуку');
    }
  };
  console.log(reviewForm);
  console.log(reviewModal);

  return (
    <div className="space-y-4 ">
      <h2 className="text-3xl font-semibold mb-4 text-[#3E4826]">Ваші замовлення</h2>
      {orders.length === 0 && (
        <div className="text-gray-500 py-10">Немає замовлень</div>
      )}

      {visibleOrders.map((order) => {
        const visibleImages = (order.items || []).slice(0, 3).map((item: OrderItemResponse) => {
          const imgUrl = productImages[item.productId];
          return imgUrl
            ? (imgUrl.startsWith('http') ? imgUrl : FILES_BASE_URL + imgUrl)
            : '/no-photo.jpg';
        });
        const hiddenCount = (order.items?.length || 0) - visibleImages.length;

        const statusInfo = ORDER_STATUS_MAP[Number(order.status)];
        const orderId = String(order.id);
        const isProcessing = processingOrders.has(orderId);

        return (
          <div
            key={order.id}
            className="border-[1px] border-[rgba(62,72,38,1)] rounded-md bg-[rgba(141,140,95,0.2)] p-4"
          >
            <div className="grid grid-cols-3 items-center">

              <div>
                <p className="text-sm font-medium">
                  Замовлення {String(order.id).replace(/\D/g, "")} від{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString('uk-UA')
                    : ""}
                </p>
                <span className={`text-xs font-semibold mt-2 block ${statusInfo?.color || 'text-gray-600'}`}>
                  {statusInfo?.label || order.status}
                </span>
              </div>

              <div className="flex justify-center">
                <div className="font-bold text-sm whitespace-nowrap">
                  Всього: {formatPrice(order.finalAmount ?? order.totalAmount ?? 0, current, rates)}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  {visibleImages.map((img: string, i: number) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded overflow-hidden border border-[#ccc] bg-white"
                    >
                      <img
                        src={img}
                        alt="Фото товару"
                        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }}
                        onError={e => (e.currentTarget.src = '/no-photo.jpg')}
                      />
                    </div>
                  ))}
                  <button onClick={() => toggleExpand(String(order.id))}>
                    {expandedId === String(order.id) ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
                {hiddenCount > 0 && (
                  <div className="text-xs font-medium text-[#3f472f]">
                    +{hiddenCount}
                  </div>
                )}
              </div>
            </div>

            {/* Order Actions */}

            <div className="mt-3 flex gap-2 justify-end">
              {
                canConfirmOrder(order.status) && (
                  <button
                    onClick={() => confirmOrder(orderId)}
                    disabled={isProcessing}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <FaCheck size={12} />
                    {isProcessing ? 'Обробка...' : 'Підтвердити'}
                  </button>
                )
              }
              {
                canRejectOrder(order.status) && (
                  <button
                    onClick={() => rejectOrder(orderId)}
                    disabled={isProcessing}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <FaTimes size={12} />
                    {isProcessing ? 'Обробка...' : 'Скасувати'}
                  </button>
                )
              }
            </div>


            {expandedId === String(order.id) && activeRole === "User" && (
              <div className="mt-3 text-sm text-gray-600">
                <div>
                  {order.items?.map((item: OrderItemResponse, i: number) => {
                    const total = (item.price ?? 0) * item.quantity;
                    return (
                      <div key={item.id || i} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                        <div className="flex-1">
                          {item.productName} × {item.quantity} — {formatPrice(total, current, rates)}
                        </div>
                        <button
                          onClick={() => openReviewModal(item.productId, item.product?.title)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 ml-3"
                        >
                          <FaStar size={12} />
                          Залишити відгук
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}


      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2 flex-wrap">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`w-8 h-8 rounded border text-sm font-medium flex justify-center items-center  ${currentPage === 1
              ? 'border-gray-300 text-gray-400 cursor-not-allowed'
              : 'border-[#3f472f] text-[#3f472f] hover:bg-[#e0e0d0]'
              }`}
            aria-label="Попередня сторінка"
          >
            <FaChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded border text-sm font-medium ${page === currentPage
                ? 'bg-[#3f472f] text-white border-[#3f472f]'
                : 'border-[#ccc] text-[#3f472f] hover:bg-[#e0e0d0]'
                }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 rounded border text-sm font-medium flex justify-center items-center ${currentPage === totalPages
              ? 'border-gray-300 text-gray-400 cursor-not-allowed'
              : 'border-[#3f472f] text-[#3f472f] hover:bg-[#e0e0d0]'
              }`}
            aria-label="Наступна сторінка"
          >
            <FaChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Review Modal */}
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
          <div>
            <label className="block text-sm font-medium mb-2">Коментар:</label>
            <TextArea
              rows={4}
              value={reviewForm.content}
              onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Поділіться своїми враженнями про товар..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Оцінка сервісу:</label>
              <Rate
                value={reviewForm.ratingService}
                onChange={(value) => setReviewForm(prev => ({ ...prev, ratingService: value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Швидкість доставки:</label>
              <Rate
                value={reviewForm.ratingSpeed}
                onChange={(value) => setReviewForm(prev => ({ ...prev, ratingSpeed: value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Відповідність опису:</label>
              <Rate
                value={reviewForm.ratingDescription}
                onChange={(value) => setReviewForm(prev => ({ ...prev, ratingDescription: value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Наявність товару:</label>
              <Rate
                value={reviewForm.ratingAvailable}
                onChange={(value) => setReviewForm(prev => ({ ...prev, ratingAvailable: value }))}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrdersTab;
