// src/admin/types.ts
export type UUID = string;

export type ProductState = 'Draft' | 'Moderation' | 'Active' | 'Rejected' | string;

export interface Product {
  id: UUID;
  title: string;
  description: string;
  price: number;
  color?: string;
  weight?: number;
  mainImageUrl?: string;
  categoryId: UUID;
  sellerId: UUID;
  state: ProductState;
  quantity?: number;
  category?: { id: UUID; name: string; status?: string };
  additionalImageUrls?: { id: UUID; url: string }[];
  characteristics?: {
    id: UUID;
    productId: UUID;
    characteristicDictId: UUID;
    name: string;
    value: string;
  }[];
}

export interface Pagination {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface ProductListResponse {
  products: Product[];
  pagination: Pagination;
}
export interface User {
  id: UUID;
  state: string;
  createdAt: string;
  name: string;
  surname: string;
  password?: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  roles: string[];
}


export interface FeedbackItem {
  id: UUID;
  content: string;
  ratingService: number;
  ratingSpeed: number;
  ratingDescription: number;
  ratingAvailable: number;
  ratingAverage: number;
  productId: UUID;
  productName?: string;
  userId: UUID;
  createdAt: string;
}

export interface FeedbackCreate {
  content: string;
  ratingService: number;
  ratingSpeed: number;
  ratingDescription: number;
  ratingAvailable: number;
}

export interface FeedbackSummaryItem {
  id: UUID;
  content: string;
  ratingService: number;
  ratingSpeed: number;
  ratingDescription: number;
  ratingAvailable: number;
  ratingAverage: number;
  productId: UUID;
  productName: string;
  userId: UUID;
  createdAt: string;
}

// src/admin/api/api.ts
import { useRequest } from "@shared/request/useRequest";


export function useAdminApi() {
  const { request } = useRequest();

  // -------- Products --------
  async function getProducts(params: { page?: number; pageSize?: number; search?: string; state?: string }) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;

    const qs = new URLSearchParams();
    qs.set("page", String(page));
    qs.set("pageSize", String(pageSize));
    if (params.search) qs.set("search", params.search);
    if (params.state) qs.set("state", params.state);

    // предпочтительно нижний регистр
    const res = await request<any>(`/api/products?${qs.toString()}`);
    if (!res) {
      return {
        products: [],
        pagination: { totalItems: 0, pageSize, currentPage: page, totalPages: 0 },
      } as ProductListResponse;
    }

    // Нормализация разных форматов
    let products: Product[] = [];
    let totalItems = 0;

    if (Array.isArray(res)) {
      products = res as Product[];
      totalItems = res.length;
    } else if (res.products) {
      products = res.products;
      totalItems = res.pagination?.totalItems ?? res.pagination?.total ?? res.total ?? products.length;
    } else if (res.items) {
      products = res.items;
      totalItems = res.total ?? res.pagination?.totalItems ?? 0;
    } else if (res.data?.items) {
      products = res.data.items;
      totalItems = res.data.total ?? 0;
    } else if (Array.isArray(res.data)) {
      products = res.data;
      totalItems = res.data.length;
    }

    return {
      products,
      pagination: {
        totalItems,
        pageSize,
        currentPage: page,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    } as ProductListResponse;
  }

async function updateProductState(id: string, state: ProductState, moderationComment?: string) {
  return request<Product>(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" }, // т.к. шлём JSON-строку
    body: JSON.stringify({ state, moderationComment }), // ← строка, TS ок
  });
}

  // -------- Users --------
  async function getUsers(params: { page?: number; pageSize?: number; search?: string } = {}): Promise<User[]> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const qs = new URLSearchParams();
    qs.set("page", String(page));
    qs.set("pageSize", String(pageSize));
    if (params.search) qs.set("search", params.search);

    // унифицируй регистр маршрутов
    const res = await request<User[]>(`/api/users?${qs.toString()}`);
    return res ?? [];
  }

  async function getUser(id: string) {
    return request<User>(`/api/users/${id}`);
  }

  // -------- Feedback --------
  async function getFeedback(params: { page?: number; pageSize?: number; productId?: string; userId?: string } = {}) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const qs = new URLSearchParams();
    qs.set("page", String(page));
    qs.set("pageSize", String(pageSize));
    if (params.productId) qs.set("productId", params.productId);
    if (params.userId) qs.set("userId", params.userId);

    // приведено к нижнему регистру
    return request<{ items: FeedbackItem[]; total: number }>(
      `/api/products/feedback?${qs.toString()}`
    );
  }

  async function deleteFeedback(id: string) {
    return request<void>(`/api/products/feedback/${id}`, { method: "DELETE" });
  }

  return {
    // products
    getProducts,
    updateProductState,
    // users
    getUsers,
    getUser,
    // feedback
    getFeedback,
    deleteFeedback,
  };
}
