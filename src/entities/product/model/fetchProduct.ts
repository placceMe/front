import { useRequest } from "@shared/request/useRequest";
import { useEffect, useState } from "react";
import type { Product } from "@shared/types/api";

export function useProduct(id: string) {
  const { request, loading, error } = useRequest();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;
    request<Product>(`/api/products/${id}`).then((data) => {
      if (data) setProduct(data);
    });
  }, [id]);

  return { product, loading, error };
}
