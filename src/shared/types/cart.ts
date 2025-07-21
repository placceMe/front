import type { Product } from "./api";

export interface CartItem {
  product: Product;
  quantity: number;
}