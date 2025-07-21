import { useState, useEffect } from "react";

export function useProductsByIds(ids: string[]) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ids.length) {
      setProducts([]);
      return;
    }
    setLoading(true);
    fetch("http://localhost:5003/api/products/many", { // именно .many!
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids })
    })
      .then(res => res.json())
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [ids]);

  return { products, loading };
}
