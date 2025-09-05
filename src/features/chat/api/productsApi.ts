import { useRequest } from "@shared/request/useRequest";
import type { Product } from "@shared/types/api";

export interface ProductsApiReturn {
  getProductsByIds: (ids: string[]) => Promise<Product[] | null>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for products API operations
 */
export const useProductsApi = (): ProductsApiReturn => {
  const { request, loading, error } = useRequest();

  const getProductsByIds = async (ids: string[]): Promise<Product[] | null> => {
    if (ids.length === 0) return [];

    console.log("Making API request to /api/products/many with:", { ids });
    const result = await request<Product[]>("/api/products/many", {
      method: "POST",
      body: JSON.stringify({ ids }),
    });
    console.log("API response:", result);
    return result;
  };

  return {
    getProductsByIds,
    loading,
    error,
  };
};
