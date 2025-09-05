import { useState, useCallback } from "react";
import { useProductsApi } from "../api/productsApi";
import type { Product } from "@shared/types/api";

export interface UseChatProductsReturn {
  products: Record<string, Product>;
  loading: boolean;
  error: string | null;
  loadProductsByIds: (ids: string[]) => Promise<void>;
  clearProducts: () => void;
}

/**
 * Hook for managing product data in chat context
 * Stores products as a dictionary where key is productId and value is Product object
 */
export const useChatProducts = (): UseChatProductsReturn => {
  const [products, setProducts] = useState<Record<string, Product>>({});
  const {
    getProductsByIds,
    loading: apiLoading,
    error: apiError,
  } = useProductsApi();

  const loadProductsByIds = useCallback(
    async (ids: string[]) => {
      console.log("loadProductsByIds called with:", ids);
      if (ids.length === 0) return;

      const existingIds = Object.keys(products);
      const newIds = ids.filter((id) => !existingIds.includes(id));

      console.log("Existing products:", existingIds);
      console.log("New IDs to load:", newIds);

      if (newIds.length === 0) {
        console.log("All products already loaded");
        return;
      }

      try {
        console.log("Fetching products for IDs:", newIds);
        const fetchedProducts = await getProductsByIds(newIds);
        console.log("Fetched products:", fetchedProducts);

        if (fetchedProducts) {
          const productsDict = fetchedProducts.reduce<Record<string, Product>>(
            (acc, product) => {
              acc[product.id] = product;
              return acc;
            },
            {}
          );

          console.log("Products dict to merge:", productsDict);

          setProducts((prev) => ({ ...prev, ...productsDict }));
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    },
    [products, getProductsByIds]
  );

  const clearProducts = useCallback(() => {
    setProducts({});
  }, []);

  return {
    products,
    loading: apiLoading,
    error: apiError,
    loadProductsByIds,
    clearProducts,
  };
};
