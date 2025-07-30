import { useRequest } from "@shared/request/useRequest";
import { useState, useEffect } from "react";

export function useProductsByIds(ids: string[]) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { request } = useRequest()

  useEffect(() => {
    if (!ids.length) {
      setProducts([]);
      return;
    }

    setLoading(true);
    request<any[]>("/api/products/many", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
      .then(res => {
        if (res) setProducts(res);
        else setProducts([]);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [ids]);

  return { products, loading };
}
