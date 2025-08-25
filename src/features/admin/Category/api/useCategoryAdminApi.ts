/*import { useRequest } from "@shared/request/useRequest";

export const useCategoryAdminApi = () => {
    const { request, loading, error } = useRequest();

    const fetchCategories = async () => {
        return await request("/api/category");
    };
    const addCategory = async (category: { name: string }) => {
  return await request("/api/category", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category: category.name, name: category.name }),
  });
};


    return {
        fetchCategories,
        addCategory,
        loading,
        error
    };
};
*/
// useCategoryAdminApi.ts
import { useRequest } from "@shared/request/useRequest";
import type { Category } from "@shared/types/api";

export const useCategoryAdminApi = () => {
  const { request, loading, error } = useRequest();

  const fetchCategories = async (): Promise<Category[]> => {
    const res = await request<Category[] | null>("/api/category");
    return Array.isArray(res) ? res : [];           // ← гарантируем массив
  };

  const addCategory = async (payload: { name: string }) =>
    request("/api/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: payload.name, name: payload.name }),
    });

  const updateCategory = async (
    id: string,
    payload: Partial<Pick<Category, "name" | "status">>
  ) =>
    request(`/api/category/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

  return { fetchCategories, addCategory, updateCategory, loading, error };
};
