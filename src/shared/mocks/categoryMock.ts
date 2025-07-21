import type { Category } from "@shared/types/api";

export const mockCategories: Category[] = [
  {
    id: "cat1",
    name: "Шоломи",
    parentCategoryId: null,
    status: "Active",
    products: [], // заполнится потом
  },
  {
    id: "cat2",
    name: "Бронежилети",
    parentCategoryId: null,
    status: "Active",
    products: [],
  },
];
