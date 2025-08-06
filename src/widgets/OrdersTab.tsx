
import React, { useState, useEffect } from 'react';
import { FaChevronUp, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import type { OrderResponse, OrderItemResponse, Product } from '@shared/types/api';
import { useRequest } from '@shared/request/useRequest';
import { useAppSelector } from '@store/hooks';

//const FILES_BASE_URL = 'http://localhost:5001/api/files/file/';
const FILES_BASE_URL = "http://31.42.190.94:8080/api/files/file/";
const ORDERS_PER_PAGE = 5;

const ORDER_STATUS_MAP: Record<number, { label: string; color: string; }> = {
  0: { label: "Нове", color: "text-yellow-600" },
  1: { label: "Підтверджено", color: "text-green-600" },
  2: { label: "Відправлено", color: "text-blue-600" },
  3: { label: "Доставлено", color: "text-gray-600" },
  4: { label: "Скасовано", color: "text-pink-600" },
};

const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productImages, setProductImages] = useState<Record<string, string>>({});

  const user = useAppSelector(state => state.user.user);
  const customerId = user?.id;
  const { request } = useRequest();




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


  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const visibleOrders = orders.slice(startIndex, startIndex + ORDERS_PER_PAGE);

  const toggleExpand = (id: string) => setExpandedId(prev => (prev === id ? null : id));

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
                  Всього: {(order.finalAmount ?? order.totalAmount)?.toLocaleString() ?? '—'} грн
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
            {expandedId === String(order.id) && (
              <div className="mt-3 text-sm text-gray-600">
                <div>
                  {order.items?.map((item: OrderItemResponse, i: number) => (
                    <div key={item.id || i}>
                      {item.productName} × {item.quantity} — {item.price} грн
                    </div>
                  ))}
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
    </div>
  );
};

export default OrdersTab;
