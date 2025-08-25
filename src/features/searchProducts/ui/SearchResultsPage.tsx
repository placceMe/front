import { useRequest } from "@shared/request/useRequest";
import type { Product } from "@shared/types/api";
import ProductCard from "../../../app/layouts/delete/ProductCard/ProductCard";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 24;

export default function SearchResultsPage() {
  const [sp, setSp] = useSearchParams();
  const q = (sp.get("query") ?? "").trim();
  const page = Number(sp.get("page") ?? "1");
  const { request } = useRequest();
  console.log(setSp)
  // 1) фиксируем request, чтобы не дёргать эффект
  const reqRef = useRef(request);
  useEffect(() => { reqRef.current = request; }, [request]);
  const req = (...args: Parameters<typeof request>) => reqRef.current(...args);

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  console.log(totalPages)
  useEffect(() => {
    if (!q) { setItems([]); setTotalPages(1); return; }

    let isStale = false;                    // 2) флаг «эффект устарел»
    const offset = (page - 1) * PAGE_SIZE;

    // 3) анти-мигание спиннера
    const loadingT = window.setTimeout(() => setLoading(true), 120);

    req(`/api/products/search?query=${encodeURIComponent(q)}&limit=${PAGE_SIZE}&offset=${offset}`)
      .then((res) => {
        if (isStale) return;

        const list: Product[] = Array.isArray(res) ? res : (res?.products ?? []);
        setItems(list);

        const tp = Array.isArray(res)
          ? 1
          : (res?.pagination?.totalPages ??
             (res?.pagination?.totalItems
               ? Math.ceil(res.pagination.totalItems / (res.pagination.pageSize || PAGE_SIZE))
               : 1));
        setTotalPages(Math.max(1, tp));
      })
      .catch((e) => {
        if (isStale) return;
        console.error("[SearchResultsPage] fetch error:", e);
        setItems([]); setTotalPages(1);
      })
      .finally(() => {
        if (isStale) return;
        clearTimeout(loadingT);
        setLoading(false);
      });

    return () => {       
      isStale = true;
      clearTimeout(loadingT);
    };
  }, [q, page]);

  return (
    <div className="secton container px-4 md:px-12 lg:px-20 py-8">
      <h1 className="text-2xl font-semibold mb-4">Результати для “{q}”</h1>

      {loading ? (
        <div>Завантаження…</div>
      ) : items.length === 0 ? (
        <div>Нічого не знайдено</div>
      ) : (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          {items.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {/* Пример пагинации через URL-параметр page (если нужна antd Pagination — раскомментируй) */}
      {/* <Pagination
          current={page}
          pageSize={PAGE_SIZE}
          total={totalPages * PAGE_SIZE} // лучше подставить totalItems c бэка, если есть
          onChange={(p) => setSp({ query: q, page: String(p) })}
        /> */}
    </div>
  );
}
