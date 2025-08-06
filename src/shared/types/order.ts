export interface OrderPayload {
  UserId: string;
  Notes?: string;
  DeliveryAddress: string;
  Items: {
    ProductId: string;
    Quantity: number;
  }[];
  Delivery?: string; // если используешь
  Payment?: string; // это нужно добавить
  CityRef?: string;
  WarehouseRef?: string;
}
