import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRequest } from "@shared/request/useRequest";
import type { Product } from "@shared/types/api";
import { useAppSelector } from "@store/hooks";
import ProductCard from "../ProductCard/ProductCard";
import "react-horizontal-scrolling-menu/dist/styles.css";

const CSS = `
.row-section{ margin:10px 0 5px;  }
.row-section:first-child { margin-top: 0; }
.row-section:last-child { margin-bottom: 0; }
.row-head{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:0 4px; }
.row-title{ font-size:22px; font-weight:700; color:#212910; margin:0 0 10px; }
.row-viewport{ position:relative; }

.row-track{
  display:flex; gap:12px;
  overflow-x:auto; padding:6px 4px 14px;
  scroll-snap-type:x proximity; -webkit-overflow-scrolling:touch;
  -ms-overflow-style: none;
  scrollbar-width: 18px;
}

.row-track::-webkit-scrollbar { height: 10px; }
.row-track::-webkit-scrollbar-thumb { background: #ebebddff; border-radius: 4px; }

.row-track > *{
  scroll-snap-align:start;
  flex:0 0 auto;
  width: clamp(140px, 20vw, 220px);
}

.card-skel{
  width: clamp(140px, 20vw, 220px);
  height: 300px;
  border-radius:12px; border:1px solid #e0e0d6;
  background: linear-gradient(90deg,#eee 25%,#f5f5f5 37%,#eee 63%);
  background-size:400% 100%; animation: sk 1.2s ease-in-out infinite;
}

@keyframes sk{ 0%{background-position:100% 0} 100%{background-position:0 0} }

@media (max-width:768px){
  .row-title{ font-size:18px; }
  .row-track { -ms-overflow-style: none; scrollbar-width: none; }
  .row-track::-webkit-scrollbar { display: none; }
}

.row-track > .product-card{
  flex: 0 0 300px;
  width: 300px;
  max-width: none;
}

@media (max-width: 1440px){ .row-track > .product-card{ flex-basis: 280px; width: 280px; } }
@media (max-width: 1280px){ .row-track > .product-card{ flex-basis: 260px; width: 260px; } }
@media (max-width: 1024px){ .row-track > .product-card{ flex-basis: 240px; width: 240px; } }
@media (max-width: 768px) { .row-track > .product-card{ flex-basis: 220px; width: 220px; } }
@media (max-width: 600px) { .row-track > .product-card{ flex-basis: 140px; width: 140px; } }
`;

function useInjectOnce(id: string, css: string) {
  useEffect(() => {
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id; s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  }, [id, css]);
}

// Приводим любой ответ к массиву продуктов
const toProductArray = (dto: any): Product[] => {
  if (Array.isArray(dto)) return dto;
  if (Array.isArray(dto?.products)) return dto.products;
  if (Array.isArray(dto?.items)) return dto.items;
  return [];
};

const Row: React.FC<{ title: string; products?: Product[]; loading?: boolean; }> = ({ title, products = [], loading }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const skeletons = useMemo(() => Array.from({ length: 8 }), []);
  const list = Array.isArray(products) ? products : [];

  return (
    <section className="row-section">
      <div className="row-head">
        <h2 className="row-title">{title}</h2>
      </div>
      <div className="row-viewport">
        <div className="row-fade left" />
        <div className="row-fade right" />
        <div className="row-track" ref={trackRef}>
          {loading
            ? skeletons.map((_, i) => <div key={i} className="card-skel" />)
            : list.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
};

const ProductPage: React.FC = () => {
  useInjectOnce("rows-css", CSS);
  const { request } = useRequest();

  // Стабилизируем ссылку на request
  const stableRequestRef = useRef(request);
  useEffect(() => { stableRequestRef.current = request; }, [request]);
  const req = (...args: Parameters<typeof request>) => stableRequestRef.current(...args);

  // Категории из Redux (MainLayout уже загрузил)
  const categoriesStore = useAppSelector(s => s.categories.active);
  const categories = useMemo(() => (categoriesStore || []).slice(0, 6), [categoriesStore]);
  const categoriesKey = useMemo(() => categories.map(c => c.id).join(","), [categories]);

  // Товары по категориям
  const [catProducts, setCatProducts] = useState<Record<string, Product[]>>({});
  const [catsLoading, setCatsLoading] = useState<Record<string, boolean>>({});
  const fetchedOk = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!categories.length) return;

    const controllers: Record<string, AbortController> = {};

    categories.forEach(cat => {
      if (fetchedOk.current.has(cat.id)) return;
      if (catsLoading[cat.id] || (catProducts[cat.id]?.length ?? 0) > 0) return;

      const ac = new AbortController();
      controllers[cat.id] = ac;

      setCatsLoading(prev => ({ ...prev, [cat.id]: true }));

      (async () => {
        try {
          const dto = await req(
            `/api/products/category/${cat.id}?limit=12&offset=0` as any,
            { signal: ac.signal } as any
          );
          if (!ac.signal.aborted) {
            const list = toProductArray(dto);
            setCatProducts(prev => ({ ...prev, [cat.id]: list }));
            fetchedOk.current.add(cat.id);
          }
        } finally {
          if (!ac.signal.aborted) {
            setCatsLoading(prev => ({ ...prev, [cat.id]: false }));
          }
        }
      })();
    });

    return () => Object.values(controllers).forEach(c => c.abort());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesKey]);

  return (
    <>
      {categories.map(c => {
        const products = catProducts[c.id] ?? [];
        const isLoading = catsLoading[c.id];

        if (!isLoading && products.length === 0) return null;

        return (
          <Row
            key={c.id}
            title={c.name ?? (c as any).title ?? "Категория"}
            products={products}
            loading={isLoading}
          />
        );
      })}
    </>
  );
};

export default ProductPage;
