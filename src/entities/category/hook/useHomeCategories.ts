// hooks/useHomeCategories.ts
import { useEffect, useState } from "react";
import { useRequest } from "@shared/request/useRequest";
import type { Category } from "@shared/types/api";

export function useHomeCategories(max = 6) {
  const { request } = useRequest();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      // подправь эндпоинт/фильтры под свой бек (например: showOnHome=true)
      const data = await request<Category[]>("/api/category?status=Active&showOnHome=true");
      if (alive) setCategories((data ?? []).slice(0, max));
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [max, request]);

  return { categories, loading };
}
