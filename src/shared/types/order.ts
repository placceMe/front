export type OrderPayload = {
  UserId: string;
  Notes?: string;
  DeliveryAddress: string;
  Items: {
    ProductId: string;
    Quantity: number;
  }[];
};
