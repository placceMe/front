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



import React, { useEffect, useMemo, useState } from "react";
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


const SELLER_TABS = [
  { key: "about",   label: "Контакна інформація",  icon: <UserIcon className="w-3 h-3" /> },
  { key: "reviews", label: "Відгуки", icon: <FeedbackIcon className="w-4 h-4" /> },
  { key: "products",label: "Товари продавця",      icon: "📦" },
];

const GRID_CSS = `
.seller-page .category-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  padding: 6px 4px;
}
.seller-page .category-grid > .product-card {
  width: 100%;
  max-width: 100%;
  justify-self: stretch;
}
@media (max-width: 1279px) { .seller-page .category-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 1023px) { .seller-page .category-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 767px)  { .seller-page .category-grid { grid-template-columns: repeat(2, minmax(140px, 1fr)); } }
@media (max-width: 480px)  { .seller-page .category-grid { grid-template-columns: 1fr; } }
.seller-page .category-section { margin: 10px 0 5px; }
.seller-page .category-title { font-size: 22px; font-weight: 700; color: #212910; margin: 0 0 10px; }
@media (max-width: 768px) { .seller-page .category-title { font-size: 18px; } }
`;


interface Contact { type: string; value: string; }
interface SellerInfo {
  id: string;
  description: string;
  schedule: string;
  contacts: Contact[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}
interface FeedbackItem {
  id: string;
  content: string;
  ratingService: number;
  ratingSpeed: number;
  ratingDescription: number;
  ratingAvailable: number;
  ratingAverage: number;
  productId: string;
  productName: string;
  userId: string;
  createdAt: string;
  user?: { id: string; name?: string; surname?: string };
}


function useInjectOnce(id: string, css: string) {
  useEffect(() => {
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  }, [id, css]);
}

const formatDateUA = (iso: string) =>
  new Date(iso).toLocaleDateString("uk-UA", { day: "2-digit", month: "long", year: "numeric" });

const Stars: React.FC<{ value: number }> = ({ value }) => (
  <span className="inline-flex items-center gap-1">
    {Array.from({ length: Math.max(0, Math.min(5, Math.round(value || 0))) }).map((_, i) => (
      <span key={i}>★</span>
    ))}
  </span>
);


const infoCache = new Map<string, Promise<SellerInfo>>();
const reviewsCache = new Map<string, Promise<FeedbackItem[]>>();

function fetchSellerInfo(userId: string) {
  if (!userId) return Promise.reject(new Error("no userId"));
  const c = infoCache.get(userId);
  if (c) return c;
  const p = fetch(`${__BASE_URL__}/api/salerinfo/by-user/${userId}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  }).then(async (r) => {
    if (!r.ok) throw new Error(await r.text());
    return r.json() as Promise<SellerInfo>;
  });
  infoCache.set(userId, p);
  return p;
}

function fetchSellerReviews(sellerId: string) {
  if (!sellerId) return Promise.resolve<FeedbackItem[]>([]);
  const c = reviewsCache.get(sellerId);
  if (c) return c;
  const p = fetch(`${__BASE_URL__}/api/products/Feedback/saler/${sellerId}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  }).then(async (r) => {
    if (!r.ok) throw new Error(await r.text());
    return r.json() as Promise<FeedbackItem[]>;
  });
  reviewsCache.set(sellerId, p);
  return p;
}


export const AboutSeller: React.FC = () => {
  useInjectOnce("seller-products-grid", GRID_CSS);

  // Роут: /seller/:sellerId
  const { sellerId = "" } = useParams<{ sellerId: string }>();

  // ⚙️ Текущий пользователь (для проверки владения в products)
  const currentUserId = useAppSelector((s) => s.user.user?.id);
  const isOwnerView = Boolean(currentUserId && sellerId && currentUserId === sellerId);

  // Tabs (как было)
  const [tab, setTab] = useState<string>(() => {
    const hash = window.location.hash.replace("#", "");
    return SELLER_TABS.find((t) => t.key === hash)?.key || "about";
  });
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      setTab(SELLER_TABS.find((t) => t.key === hash)?.key || "about");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // ---------- ABOUT: подстановка данных, стили не трогаем ----------
  const [seller, setSeller] = useState<SellerInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(false);

  useEffect(() => {
    if (!sellerId) return;
    let alive = true;
    setLoadingInfo(true);
    fetchSellerInfo(sellerId)
      .then((d) => alive && setSeller(d))
      .catch(() => alive && setSeller(null))
      .finally(() => alive && setLoadingInfo(false));
    return () => { alive = false; };
  }, [sellerId]);

  const defaultParagraphs = useMemo(
    () => [
      "SAVE — це команда, що народилася з потреби підтримати тих, хто щодня ризикує заради нашої свободи.",
      "Ми спеціалізуємось на якісному військовому спорядженні, створеному для надійності, витривалості й зручності.",
      "Працюємо з 2022 року, від початку повномасштабного вторгнення. Спорядження протестоване військовими в  бойових умовах.",
      "Пропонуємо: тактичні рюкзаки, бронежилети, плитоноски, шоломи, форми, взуття та аксесуари.",
    ],
    []
  );

  // если описание пришло — делим по \n и берём первые 3 абзаца, чтобы в точности занять твои три <p>
  const aboutParagraphs = (seller?.description
    ? seller.description.split("\n").filter(Boolean)
    : defaultParagraphs
  ).slice(0, 3);

  // ---------- REVIEWS ----------
  const [reviews, setReviews] = useState<FeedbackItem[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (tab !== "reviews" || !sellerId) return;
    let alive = true;
    setLoadingReviews(true);
    fetchSellerReviews(sellerId)
      .then((list) => alive && setReviews(Array.isArray(list) ? list : []))
      .catch(() => alive && setReviews([]))
      .finally(() => alive && setLoadingReviews(false));
    return () => { alive = false; };
  }, [tab, sellerId]);

  // ---------- PRODUCTS (твои, без изменений) ----------
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { request } = useRequest();

  useEffect(() => { setCurrentPage(1); }, [sellerId, tab]);

  useEffect(() => {
    if (tab !== "products" || !sellerId) return;
    setLoading(true);
    const limit = 12;
    const offset = (currentPage - 1) * limit;
    request<any>(`/api/products/seller/${sellerId}?limit=${limit}&offset=${offset}`)
      .then((res) => applyProductsResponse(res, limit))
      .finally(() => setLoading(false));
  }, [tab, sellerId, currentPage]);

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

    
      <div className="flex gap-2 mb-4">
        {SELLER_TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => { window.location.hash = `#${key}`; setTab(key); }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold border transition
              ${tab === key ? "bg-[#2b3924] text-white border-[#2b3924]" : "bg-[#edf1e3] text-[#2b3924] border-[#cbd5b5] hover:bg-[#e3e9d7]"}`}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

  
      {tab === "about" && (
        <div className="flex flex-wrap gap-6 justify-between">
          <div className="flex-1 min-w-[280px]">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 ">
              <div className="xl:col-span-12">
               
               {/** 
                <h2 className="text-[28px] font-bold text-[#2b3924] flex items-center gap-2">
                  Продавець SAVE
                  <span className="text-[#f5b121] text-[20px] font-bold flex items-center gap-1">
                    4.6/5 <FaStar />
                  </span>
                </h2>*/}
              </div>

              <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-6">
             
                <div className="md:col-span-5 bg-[#e5e5d8]/70 rounded-[5px] p-4 space-y-4">
                  {loadingInfo && !seller ? (
                    <p className="text-sm text-[#2b3924] leading-relaxed">Завантаження даних...</p>
                  ) : (
                    aboutParagraphs.map((t, i) => (
                      <p key={i} className="text-sm text-[#2b3924] leading-relaxed">{t}</p>
                    ))
                  )}
                </div>

                <div className="md:col-span-3 flex flex-col gap-4">
                  <div className="bg-[#f0f0f0] rounded p-4 text-sm text-gray-800">
                    <p>{seller?.schedule || "Пн-Пт 09:00 - 18:00"}</p>
                    
                  </div>
                 {/**    <button className="bg-[#3c4e2c] hover:bg-[#2d3a20] text-white px-4 py-2 rounded text-sm font-semibold">
                    Діалог з продавцем
                  </button>*/}
                </div>

                {/**  
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
                            style={{ width: `${((stars === 5 ? 33 : 1) / 33) * 100}%` }}
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

                 
                </div> */}
              </div>

           
              <div className="xl:col-span-12 grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                {[
                  { label: "На NORSEN", value:'1 день', index: "01" },
                  { label: "Швидкість відправки", value: "в середньому — 48 годин", index: "02" },
                  { label: "Швидкість доставки", value: "в середньому — 7 днів", index: "03" },
                  { label: "Час відповіді", value: "в середньому — 48 годин", index: "04" },
                  { label: "Наявність скарг", value: "скарг немає", index: "05" },
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
      )}

    
      {tab === "reviews" && (
        <div className="p-6">
        

          {loadingReviews ? (
            <div className="text-sm text-[#2b3924]">Завантаження...</div>
          ) : reviews.length === 0 ? (
            <div className="text-sm text-gray-600">Відгуків поки немає.</div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="border border-[#3E4826] rounded-lg p-4"
                  style={{ background: "rgba(229, 229, 216, 0.8)" }}
                >
                 
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div>
                      <div className="font-semibold text-[#2b3924]">
                        {(r.user?.name || r.user?.surname)
                          ? `${r.user?.name ?? ""} ${r.user?.surname ?? ""}`.trim()
                          : "Анонім"}
                      </div>
                      <a
                        href={`/product/${r.productId}`}
                        className="underline text-[#2b3924] hover:text-[#4A5A2D]"
                      >
                        {r.productName}
                      </a>
                    </div>
                    <div className="text-xs text-[#3E4826] whitespace-nowrap">
                      {formatDateUA(r.createdAt)}
                    </div>
                  </div>

                 
                  <div className="text-[#0E120A] text-sm mb-3">
                    {r.content || "Без коментаря"}
                  </div>

                  {/**
                  <div className="text-sm font-semibold text-[#2b3924] flex flex-wrap gap-x-5 gap-y-2">
                    <span>Обслуговування <Stars value={r.ratingService} /></span>
                    <span>Своєчасна доставка <Stars value={r.ratingSpeed} /></span>
                    <span>Відповідність товару опису <Stars value={r.ratingDescription} /></span>
                    <span>Наявність <Stars value={r.ratingAvailable} /></span>
                  </div> */}
                </div>
              ))}
            </div>
          )}
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
