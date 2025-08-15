// hooks/useCategoryProducts.ts
import { useEffect, useState } from "react";
import { useRequest } from "@shared/request/useRequest";
import type { Product } from "@shared/types/api";

export function useCategoryProducts(categoryId?: string, limit = 10) {
  const { request } = useRequest();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    let alive = true;
    (async () => {
      setLoading(true);
      const data = await request<Product[]>(
        `/api/products/category/${categoryId}?limit=${limit}&offset=0`
      );
      if (alive) setProducts(data ?? []);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [categoryId, limit, request]);

  return { products, loading };
}
