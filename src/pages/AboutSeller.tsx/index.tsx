/*import { BlurBlock } from "@shared/ui/BlurBlock";
import { useEffect, useState } from "react";
import { FaStar } from 'react-icons/fa';
import sellerBg from '../../assets/bg/bg_seller.png';
import UserIcon from '../../assets/icons/user.svg?react';
import FeedbackIcon from '../../assets/icons/star.svg?react';



const SELLER_TABS = [
  { key: 'about', label: 'Контакна інформація', icon: <UserIcon className="w-3 h-3" /> },
  { key: 'reviews', label: 'Відгуки про продавця', icon: <FeedbackIcon className="w-4 h-4" /> },
  { key: 'products', label: 'Товари продавця', icon: '📦' },
];




export const AboutSeller = () => {

  const [tab, setTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return SELLER_TABS.find(t => t.key === hash)?.key || 'about';
  });

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setTab(SELLER_TABS.find(t => t.key === hash)?.key || 'about');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);


  return (

    <BlurBlock
      backgroundImage={tab === 'about' ? `${sellerBg}` : undefined}
      paper={tab !== 'about'}
    >
      <div
        className="bg-cover bg-center"
        style={{ backgroundImage: sellerBg }}
      >

        <div className="flex gap-2 mb-4">
          {SELLER_TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => {
                window.location.hash = `#${key}`;
                setTab(key);
              }}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold border transition
      ${tab === key
                  ? 'bg-[#2b3924] text-white border-[#2b3924]'
                  : 'bg-[#edf1e3] text-[#2b3924] border-[#cbd5b5] hover:bg-[#e3e9d7]'}`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}

        </div>

       
        <div className="flex flex-wrap gap-6 justify-between">

       
          <div className="flex-1 min-w-[280px]">

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 ">
            
              <div className="xl:col-span-12">
                <h2 className="text-[28px] font-bold text-[#2b3924] flex items-center gap-2">
                  Продавець SAVE
                  <span className="text-[#f5b121] text-[20px] font-bold flex items-center gap-1">
                    4.6/5 <FaStar />
                  </span>
                </h2>
              </div>

              
              <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-6">
                
                <div className="md:col-span-5 bg-[#e5e5d8]/70 rounded-[5px] p-4 space-y-4">
                  <p className="text-sm text-[#2b3924] leading-relaxed">
                    SAVE — це команда, що народилася з потреби підтримати тих, хто щодня ризикує заради нашої свободи.
                    Ми спеціалізуємось на якісному військовому спорядженні, створеному для надійності, витривалості й зручності.
                  </p>
                  <p className="text-sm text-[#2b3924] leading-relaxed">
                    Працюємо з 2022 року, від початку повномасштабного вторгнення. Спорядження протестоване військовими в  бойових умовах.
                  </p>
                  <p className="text-sm text-[#2b3924] leading-relaxed">
                    Пропонуємо: тактичні рюкзаки, бронежилети, плитоноски, шоломи, форми, взуття та аксесуари.
                  </p>
                </div>

                
                <div className="md:col-span-3 flex flex-col gap-4">
                  <div className="bg-[#f0f0f0] rounded p-4 text-sm text-gray-800">
                    <p>Пн-Пт 09:00 - 18:00</p>
                    <p>Сб-Нд 10:00 - 16:00</p>
                  </div>
                  <button className="bg-[#3c4e2c] hover:bg-[#2d3a20] text-white px-4 py-2 rounded text-sm font-semibold">
                    Діалог з продавцем
                  </button>
                </div>

                
                <div className="md:col-span-4 flex flex-col gap-3 justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#2b3924]">Загальний рейтинг та оцінки</h3>
                    <div className="text-sm text-[#2b3924] mb-2">на основі 36 відгуків</div>

                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2 text-sm">
                        <span className="w-[30px]">{stars} ★</span>
                        <div className="flex-1 max-w-[200px] bg-gray-200 rounded h-[6px] overflow-hidden">
                          <div
                            className={`h-full ${stars === 5 ? "bg-yellow-400" : "bg-gray-400"}`}
                            style={{ width: `${(stars === 5 ? 33 : 1) / 33 * 100}%` }}
                          />
                        </div>
                        <span className="w-[30px] text-right">{stars === 5 ? 33 : 1}</span>
                      </div>
                    ))}
                  </div>


            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
            {[ 
              { title: "Якість обслуговування", score: "4.6" },
              { title: "Своєчасна доставка", score: "4.7" },
              { title: "Відповідність товару опису", score: "4.5" },
              { title: "Наявність актуального асортименту", score: "4.8" },
            ].map(({ title, score }) => (
              <div key={title} className="h-[32px] bg-white/80 rounded-[5px] px-[15px] py-[7px] flex justify-between items-center text-sm text-[#2b3924] font-medium">
                <span>{title}</span>
                <span className="text-[#f5b121] font-bold">{score} ★</span>
              </div>
            ))}
          </div> 

         
                </div>
              </div>

              
              <div className="xl:col-span-12 grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                {[
                  { label: "На NORSEN", value: "183 дні", index: "01" },
                  { label: "Швидкість відправки", value: "в середньому — 6 годин", index: "02" },
                  { label: "Швидкість доставки", value: "в середньому — 2 дні", index: "03" },
                  { label: "Час відповіді", value: "в середньому — 5 хвилин", index: "04" },
                  { label: "Наявність скарг", value: "0%", index: "05" },
                ].map((item) => (
                  <div key={item.index} className="relative bg-white/80 backdrop-blur-sm rounded-md p-4 overflow-hidden">
                    <div className="absolute bottom-[20px] right-2 text-[45px] font-bold leading-[100%] font-montserrat text-[#e5ac30]/30">
                      {item.index}
                    </div>
                    <div className="relative z-10">
                      <div className="text-[13px] font-semibold text-gray-800 mb-1">{item.label}</div>
                      <div className="text-sm text-gray-700">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </BlurBlock>
  );
};
*/ {/**   */}    
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { BlurBlock } from "@shared/ui/BlurBlock";
import sellerBg from "../../assets/bg/bg_seller.png";
import UserIcon from "../../assets/icons/user.svg?react";
import FeedbackIcon from "../../assets/icons/star.svg?react";

import type { Product } from "@shared/types/api";
import { useRequest } from "@shared/request/useRequest";

import { Pagination } from "@shared/ui/Pagination/Pagination";
import ProductCard from "../../app/layouts/delete/ProductCard/ProductCard";


// ✅ возьмём id текущего юзера из стора (подставь свой селектор/путь)
import { useAppSelector } from "@store/hooks";

/* ================= TABS ================= */

const SELLER_TABS = [
  { key: "about", label: "Контакна інформація", icon: <UserIcon className="w-3 h-3" /> },
  { key: "reviews", label: "Відгуки про продавця", icon: <FeedbackIcon className="w-4 h-4" /> },
  { key: "products", label: "Товари продавця", icon: "📦" },
];

/* ============== GRID + УСЛОВНОЕ СКРЫТИЕ КНОПКИ ============== */

const GRID_CSS = `
.seller-page .category-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(0, 1fr)); /* 4 в ряд на >=1280px */
  padding: 6px 4px;
}

/* карточка тянется на ширину колонки */
.seller-page .category-grid > .product-card {
  width: 100%;
  max-width: 100%;
  justify-self: stretch;
}

/* 3 в ряд */
@media (max-width: 1279px) {
  .seller-page .category-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

/* 2 в ряд */
@media (max-width: 1023px) {
  .seller-page .category-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

/* 2 компактных */
@media (max-width: 767px) {
  .seller-page .category-grid { grid-template-columns: repeat(2, minmax(140px, 1fr)); }
}

/* 1 в ряд (узкие) */
@media (max-width: 480px) {
  .seller-page .category-grid { grid-template-columns: 1fr; }
}

.seller-page .category-section { margin: 10px 0 5px; }
.seller-page .category-title { font-size: 22px; font-weight: 700; color: #212910; margin: 0 0 10px; }
@media (max-width: 768px) { .seller-page .category-title { font-size: 18px; } }

`;

/* ============== CSS injector (1 раз) ============== */
function useInjectOnce(id: string, css: string) {
  useEffect(() => {
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  }, [id, css]);
}

/* ===================== COMPONENT ===================== */

export const AboutSeller: React.FC = () => {
  useInjectOnce("seller-products-grid", GRID_CSS);

  // Роут: /seller/:sellerId
  const { sellerId } = useParams<{ sellerId: string }>();

  // ⚙️ Текущий пользователь (подставь свой путь к user.id)
 const currentUserId = useAppSelector((s) => s.user.user?.id);
  const isOwnerView = Boolean(currentUserId && sellerId && currentUserId === sellerId);

  const [tab, setTab] = useState<string>(() => {
    const hash = window.location.hash.replace("#", "");
    return SELLER_TABS.find((t) => t.key === hash)?.key || "about";
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const { request } = useRequest();

  /* ====== hash routing for tabs ====== */
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      setTab(SELLER_TABS.find((t) => t.key === hash)?.key || "about");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  /* ====== сброс страницы при смене продавца/таба ====== */
  useEffect(() => {
    setCurrentPage(1);
  }, [sellerId, tab]);

  /* ====== Загрузка товаров продавца (пагинация) ====== */
  useEffect(() => {
    if (tab !== "products" || !sellerId) return;

    setLoading(true);
    const limit = 12;
    const offset = (currentPage - 1) * limit;

    request<any>(`/api/products/seller/${sellerId}?limit=${limit}&offset=${offset}`)
      .then((res) => {
        applyProductsResponse(res, limit);
      })
      .finally(() => setLoading(false));
  }, [tab, sellerId, currentPage]);

  /* ====== разбор ответа бэка ====== */
  const applyProductsResponse = (res: any, defaultPageSize: number) => {
    const items = Array.isArray(res?.products) ? res.products : [];
    setProducts(items);

    const pageSize = Number(res?.pagination?.pageSize) || defaultPageSize;
    const totalItems = Number(res?.pagination?.totalItems) || items.length;
    const totalPagesFromApi = Number(res?.pagination?.totalPages);

    const computed =
      totalPagesFromApi && totalPagesFromApi > 0
        ? totalPagesFromApi
        : totalItems > 0
        ? Math.ceil(totalItems / pageSize)
        : 1;

    setTotalPages(Math.max(1, computed));
  };

  return (
    <BlurBlock
      backgroundImage={tab === "about" ? `${sellerBg}` : undefined}
      paper={tab !== "about"}
    >
      {/* Шапка вкладок */}
      <div className="flex gap-2 mb-4">
        {SELLER_TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => {
              window.location.hash = `#${key}`;
              setTab(key);
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold border transition
              ${tab === key ? "bg-[#2b3924] text-white border-[#2b3924]" : "bg-[#edf1e3] text-[#2b3924] border-[#cbd5b5] hover:bg-[#e3e9d7]"}`}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Контент вкладок */}
      {tab === "about" && (
        <div className="p-6">
          <h2 className="text-[28px] font-bold text-[#2b3924] flex items-center gap-2">
            Продавець SAVE
            <span className="text-[#f5b121] text-[20px] font-bold flex items-center gap-1">
              4.6/5 <FaStar />
            </span>
          </h2>

          <div className="mt-4 text-[#2b3924] text-sm leading-relaxed space-y-3 max-w-3xl">
            <p>
              SAVE — це команда, що народилася з потреби підтримати тих, хто щодня ризикує заради нашої свободи.
              Ми спеціалізуємось на якісному військовому спорядженні, створеному для надійності, витривалості й зручності.
            </p>
            <p>
              Працюємо з 2022 року, від початку повномасштабного вторгнення. Спорядження протестоване військовими в бойових умовах.
            </p>
            <p>
              Пропонуємо: тактичні рюкзаки, бронежилети, плитоноски, шоломи, форма, взуття та аксесуари.
            </p>
          </div>
        </div>
      )}

      {tab === "reviews" && (
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[#2b3924]">Відгуки</h2>
          <p className="text-sm text-gray-600">Тут будуть відгуки про продавця.</p>
        </div>
      )}

      {tab === "products" && (
       <div
    className={`container section seller-page ${
      isOwnerView ? "own-view" : "force-buy-visible"
    }`}
  >
       

          {loading ? (
            <div>Завантаження...</div>
          ) : products.length === 0 ? (
            <div className="text-sm text-gray-600">У продавця поки немає товарів.</div>
          ) : (
            <div className="category-grid">
              {products.map((p) => (
                <div key={p.id}>
                  {/* Кнопка "Купить" остаётся в ProductCard — мы её не трогаем */}
                  <ProductCard product={p} isAvailable={(p.quantity ?? 0) > 0} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}
    </BlurBlock>
  );
};
