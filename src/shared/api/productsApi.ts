// shared/api/productsApi.ts
import axios from "axios";
import type { Product } from "shared/types/api";

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get("/api/products");
  return response.data;
};
