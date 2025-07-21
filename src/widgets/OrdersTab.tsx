/*import React, { useState } from 'react';
import { FaChevronUp, FaChevronDown, FaChevronLeft, FaChevronRight, FaSyncAlt  } from 'react-icons/fa';

const ordersMock = [
  {
    id: '№274784386563548',
    date: '04 липня 2025',
    time: '16:39',
    status: 'Упаковано',
    total: 8170,
    items: ['/img/backpack.png', '/img/adapter.png', '/img/adapter.png','/img/jacket.png'],
  },
  {
    id: '№37478435656245',
    date: '20 червня 2025',
    time: '10:03',
    status: 'Виконано',
    total: 6850,
    items: ['/img/mop.png', '/img/cup.png', '/img/box.png'],
  },
  {
    id: '№487784386563975',
    date: '15 червня 2025',
    time: '12:32',
    status: 'Виконано',
    total: 9620,
    items: ['/img/headset.png', '/img/helmet.png'],
  },
  {
    id: '№847784386563502',
    date: '20 травня 2025',
    time: '08:22',
    status: 'Виконано',
    total: 53620,
    items: ['/img/uniform.png', '/img/helmet.png'],
  },
  {
    id: '№274784386563549',
    date: '10 червня 2025',
    time: '10:03',
    status: 'Виконано',
    total: 9920,
    items: ['/img/jacket.png', '/img/shovel.png'],
  },
  {
    id: '№665544332211',
    date: '01 травня 2025',
    time: '15:00',
    status: 'Упаковано',
    total: 11200,
    items: ['/img/shirt.png', '/img/pants.png'],
  },
  {
    id: '№445566778899',
    date: '28 квітня 2025',
    time: '11:20',
    status: 'Виконано',
    total: 8700,
    items: ['/img/boots.png', '/img/coat.png'],
  },
  {
    id: '№998877665544',
    date: '22 квітня 2025',
    time: '14:55',
    status: 'Виконано',
    total: 7400,
    items: ['/img/hat.png'],
  },
  {
    id: '№112233445566',
    date: '18 квітня 2025',
    time: '13:10',
    status: 'Упаковано',
    total: 6400,
    items: ['/img/goggles.png'],
  },
  {
    id: '№223344556677',
    date: '10 квітня 2025',
    time: '09:45',
    status: 'Виконано',
    total: 13200,
    items: ['/img/socks.png', '/img/gloves.png'],
  },
];

const OrdersTab = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const ORDERS_PER_PAGE = 5;
  const totalPages = Math.ceil(ordersMock.length / ORDERS_PER_PAGE);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  //ПАГИНАЦИЯ
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const endIndex = startIndex + ORDERS_PER_PAGE;
  const visibleOrders = ordersMock.slice(startIndex, endIndex);

  return (
    <div className="space-y-4 px-40 m-20">
      <h2 className="text-4xl font-semibold mb-4">Ваші замовлення</h2>

      {visibleOrders.map((order) => {
        const visibleImages = order.items.slice(0, 3);
        const hiddenCount = order.items.length - visibleImages.length;

        return (
          <div
            key={order.id}
            className="border-[1px] border-[rgba(62,72,38,1)] rounded-md bg-[rgba(141,140,95,0.2)] p-4"
          >
            <div className="grid grid-cols-3 items-center">
              
              <div>
                <p className="text-sm font-medium">
                  Замовлення {order.id} від {order.date}, {order.time}
                </p>
                <span
                  className={`text-xs font-semibold mt-5 block ${
                    order.status === 'Упаковано'
                      ? 'text-orange-300'
                      : 'text-green-700'
                  }`}
                >
                  {order.status}
                </span>
              </div>

          
              <div className="flex justify-center" style={{ transform: 'translateX(400px)' }}>
                <div className="font-bold text-sm whitespace-nowrap">
                  Всього: {order.total.toLocaleString()} грн
                </div>
              </div>

             
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  {visibleImages.map((img, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded overflow-hidden border border-[#ccc] bg-white"
                    >
                      <img
                        src={img}
                        alt={`item-${i}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                  <button
                    className="w-6 h-6 flex items-center justify-center text-lg text-[#3f472f] hover:bg-[#d5d5c5] rounded-full transition-all"
                    onClick={() => toggleExpand(order.id)}
                  >
                {expandedId === order.id ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
                {hiddenCount > 0 && (
                  <div className="text-xs font-medium text-[#3f472f]">
                    +{hiddenCount}
                  </div>
                )}
              </div>
            </div>

            {expandedId === order.id && (
              <div className="mt-3 text-sm text-gray-600">
                Деталі замовлення (повний список товарів або інша додаткова інформація).
              </div>
            )}
          </div>
        );
      })}
          {currentPage < totalPages && (
  <div className="flex justify-center mt-19">
    <button
      onClick={() => setCurrentPage((prev) => prev + 1)}
        className="px-4 py-2 text-sm text-white rounded hover:bg-[#2e361f]"
   style={{
    backgroundColor: 'rgba(62, 72, 38, 1)',
    backgroundBlendMode: 'overlay',
    backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)',
  }}
    >
      Показати ще <FaSyncAlt className="inline ml-1 relative -top-[1px]" />
    </button>
  </div>
)}


{totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-2 flex-wrap">
    
    
   <button
  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
  disabled={currentPage === 1}
  className={`w-8 h-8 rounded border text-sm font-medium flex justify-center items-center  ${
    currentPage === 1
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
        className={`w-8 h-8 rounded border text-sm font-medium ${
          page === currentPage
            ? 'bg-[#3f472f] text-white border-[#3f472f]'
            : 'border-[#ccc] text-[#3f472f] hover:bg-[#e0e0d0]'
        }`}
      >
        {page}
      </button>
    ))}

    
   <button
  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
  disabled={currentPage === totalPages}
  className={`w-8 h-8 rounded border text-sm font-medium flex justify-center items-center ${
    currentPage === totalPages
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
*/












/////////////////////////////////////////////////////////
/*
import React, { useState, useEffect } from 'react';
import { FaChevronUp, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ORDERS_PER_PAGE = 5;

const OrdersTab = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const raw = localStorage.getItem("orders");
    let parsed: any[] = [];
    try {
      parsed = raw ? JSON.parse(raw) : [];
    } catch {
      parsed = [];
    }
    setOrders(parsed.reverse()); // Нові — зверху
  }, []);

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const visibleOrders = orders.slice(startIndex, startIndex + ORDERS_PER_PAGE);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4 px-40 m-20">
      <h2 className="text-4xl font-semibold mb-4">Ваші замовлення</h2>
      {orders.length === 0 && (
        <div className="text-gray-500 py-10">Немає замовлень</div>
      )}

      {visibleOrders.map((order: any) => {

        const visibleImages = (order.items || []).slice(0, 3).map((item: any) =>
          item.fileUrl ? item.fileUrl : '/no-photo.jpg'
        );
        const hiddenCount = (order.items?.length || 0) - visibleImages.length;

        return (
          <div
            key={order.id}
            className="border-[1px] border-[rgba(62,72,38,1)] rounded-md bg-[rgba(141,140,95,0.2)] p-4"
          >
            <div className="grid grid-cols-3 items-center">
            
              <div>
                <p className="text-sm font-medium">
                  Замовлення {Number(order.id.replace(/\D/g, '').slice(0, 10))} від{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString('uk-UA')
                    : ""}
                </p>
                <span className={`text-xs font-semibold mt-5 block text-green-700`}>
                  {order.status || 'Виконано'}
                </span>
              </div>
          
              <div className="flex justify-center" style={{ transform: 'translateX(400px)' }}>
                <div className="font-bold text-sm whitespace-nowrap">
                  Всього: {order.total ? order.total.toLocaleString() : '—'} грн
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
                  <button
                    className="w-6 h-6 flex items-center justify-center text-lg text-[#3f472f] hover:bg-[#d5d5c5] rounded-full transition-all"
                    onClick={() => toggleExpand(order.id)}
                  >
                    {expandedId === order.id ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
                {hiddenCount > 0 && (
                  <div className="text-xs font-medium text-[#3f472f]">
                    +{hiddenCount}
                  </div>
                )}
              </div>
            </div>
            {expandedId === order.id && (
              <div className="mt-3 text-sm text-gray-600">
                <div>
                  {order.items?.map((item: any, i: number) => (
                    <div key={i}>
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
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`w-8 h-8 rounded border text-sm font-medium flex justify-center items-center  ${
              currentPage === 1
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
              className={`w-8 h-8 rounded border text-sm font-medium ${
                page === currentPage
                  ? 'bg-[#3f472f] text-white border-[#3f472f]'
                  : 'border-[#ccc] text-[#3f472f] hover:bg-[#e0e0d0]'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 rounded border text-sm font-medium flex justify-center items-center ${
              currentPage === totalPages
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
*/
/////////////////////////////
import React, { useState, useEffect } from 'react';
import { FaChevronUp, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import type { OrderResponse, OrderItemResponse } from '@shared/types/api'; // Проверь путь!
const FILES_BASE_URL = 'http://localhost:5001/api/files/file/';
const ORDERS_PER_PAGE = 5;

const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Получаем id пользователя (user может быть string или number)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const customerId = user?.id;

  useEffect(() => {
    if (!customerId) return;
    let mounted = true;

    // Загрузка заказов пользователя с backend
    fetch(`/api/orders/customer/${customerId}`)
      .then(res => res.json())
      .then((data: OrderResponse[]) => { if (mounted) setOrders(data.reverse()); })
      .catch(() => setOrders([]));

    return () => { mounted = false; };
  }, [customerId]);

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const visibleOrders = orders.slice(startIndex, startIndex + ORDERS_PER_PAGE);

  const toggleExpand = (id: number) => setExpandedId(prev => (prev === id ? null : id));

  return (
    <div className="space-y-4 px-40 m-20">
      <h2 className="text-4xl font-semibold mb-4">Ваші замовлення</h2>
      {orders.length === 0 && (
        <div className="text-gray-500 py-10">Немає замовлень</div>
      )}

      {visibleOrders.map((order) => {
        // Формируем картинки товаров из order.items
        const visibleImages = (order.items || []).slice(0, 3).map((item: OrderItemResponse) =>
          // Если в OrderItemResponse есть mainImageUrl (например, добавь это поле на backend!)
          // иначе, если нет — просто будет /no-photo.jpg
          (item as any).mainImageUrl
            ? ((item as any).mainImageUrl.startsWith('http')
                ? (item as any).mainImageUrl
                : FILES_BASE_URL + (item as any).mainImageUrl)
            : '/no-photo.jpg'
        );
        const hiddenCount = (order.items?.length || 0) - visibleImages.length;

        return (
          <div
            key={order.id}
            className="border-[1px] border-[rgba(62,72,38,1)] rounded-md bg-[rgba(141,140,95,0.2)] p-4"
          >
            <div className="grid grid-cols-3 items-center">
              {/* LEFT */}
              <div>
                <p className="text-sm font-medium">
                  Замовлення {order.id} від{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString('uk-UA')
                    : ""}
                </p>
                <span className="text-xs font-semibold mt-5 block text-green-700">
                  {order.status}
                </span>
              </div>
              {/* CENTER */}
              <div className="flex justify-center" style={{ transform: 'translateX(400px)' }}>
                <div className="font-bold text-sm whitespace-nowrap">
                  Всього: {order.finalAmount ? order.finalAmount.toLocaleString() : '—'} грн
                </div>
              </div>
              {/* RIGHT */}
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
                  <button
                    className="w-6 h-6 flex items-center justify-center text-lg text-[#3f472f] hover:bg-[#d5d5c5] rounded-full transition-all"
                    onClick={() => toggleExpand(order.id)}
                  >
                    {expandedId === order.id ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
                {hiddenCount > 0 && (
                  <div className="text-xs font-medium text-[#3f472f]">
                    +{hiddenCount}
                  </div>
                )}
              </div>
            </div>
            {expandedId === order.id && (
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

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2 flex-wrap">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`w-8 h-8 rounded border text-sm font-medium flex justify-center items-center  ${
              currentPage === 1
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
              className={`w-8 h-8 rounded border text-sm font-medium ${
                page === currentPage
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
            className={`w-8 h-8 rounded border text-sm font-medium flex justify-center items-center ${
              currentPage === totalPages
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
