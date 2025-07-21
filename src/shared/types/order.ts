
export type OrderPayload = {
  user_id: string;
  items: { product_id: string; quantity: number }[];
  delivery_address: string;
  promo_code?: string;
  notes?: string;
};