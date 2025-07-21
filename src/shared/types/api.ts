// UsersService Models

export type User = {
    id: string;
    state: UserState;
    createdAt: string;
    name: string;
    surname: string;
    password: string;
    email: string;
    phone?: string | null;
    avatarUrl?: string | null;
    roles: string[];
};

export type UserState = "Active" | "Inactive" | "Blocked" | "Deleted";

export type Role = "Admin" | "User" | "Saler" | "Moderator";

// ProductsService Models

export type Product = {
    id: string;
    title: string;
    description: string;
    price: number;
    categoryId: string;
    sellerId: string;
    state: ProductState;
    category?: Category;
    quantity: number;
    characteristics: Characteristic[];
    mainImageUrl: string; 
    attachments: Attachment[];
    color: string;
    weight: number,
};

export type ProductState = "Active" | "Blocked" | "Moderation" | "Archived" | "Deleted";

export type Category = {
    id: string;
    name: string;
    parentCategoryId?: string | null;
    status: CategoryState;
    products: Product[];
};

export type CategoryState = "Active" | "Hidden" | "Archived" | "Deleted";

export type Attachment = {
    id: string;
    filePath: string;
    productId: string;
    product: Product;
};

export type Characteristic = {
    id: string;
    value: string;
    productId: string;
    charesteristicDictId: string;
};

export type CharacteristicDict = {
    id: string;
    name: string;
    categoryId: string;
};


export type Rating = {
    id: string;
    productId: string;
    userId: string;
    value: number;
    comment?: string | null;
    createdAt: string;
    state: ProductState;
};

export type RatingAverage = {
    productId: string;
    averageRating: number;
    totalRatings: number;
};


/////////////////////////
export type Order = {
  id: number;
  userId: string;
  statusId: number;
  promoCodeId?: number | null;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  createdAt: string;
  updatedAt?: string | null;

  // вложенные объекты
  status?: Status;
  promoCode?: PromoCode | null;
  items: OrderItemResponse[];
};

export type OrderItemResponse = {
  id: number;
  productId: string;        // UUID, если в БД uuid, иначе number
  productName: string;
  quantity: number;
  price: number;            // Decimal обычно приводится к number на фронте
  totalPrice: number;
};

export type Status = {
  id: number;
  name: string;
  description?: string | null;
};

export type PromoCode = {
  id: number;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  isActive: boolean;
  expiresAt?: string | null;
};

export type OrderResponse = {
  id: number;
  customerId: string;         // UUID или number, смотри свою модель User
  items: OrderItemResponse[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: string;             // или конкретный enum, если есть
  promoCode?: string | null;
  deliveryAddress: string;
  notes?: string | null;
  createdAt: string;          // ISO date string
  updatedAt: string;          // ISO date string
};
