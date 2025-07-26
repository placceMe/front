import type { Product } from "@shared/types/api";
import { mockCategories } from "./categoryMock";

export const mockProducts: Product[] = [
  {
    id: "p1",
    title: "Тактичний шолом EmberCore Shield M1",
    description: "Надійний тактичний шолом для бойових задач.",
    price: 9720,
    categoryId: "cat1",
    sellerId: "1",
    state: "Active",
    category: mockCategories[0],
    quantity: 5,
    characteristics: [
      {
        id: "c1",
        value: "Арамідне волокно / Кевлар",
        productId: "p1",
        charesteristicDictId: "dict1",
      },
      {
        id: "c2",
        value: "1.3-1.5 кг",
        productId: "p1",
        charesteristicDictId: "dict2",
      },
    ],
    attachments: [
      {
        id: "a1",
        filePath: '../../../public/mock/mock1.png',
        productId: "p1",
        product: {} as Product, // рекурсивные связи можно убрать для моков
      },
      {
        id: "a2",
        filePath: '../../../public/mock/mock2.png',
        productId: "p1",
        product: {} as Product,
      },
      {
        id: "a3",
        filePath: '../../../public/mock/mock3.png',
        productId: "p1",
        product: {} as Product,
      },
      {
        id: "a4",
        filePath: '../../../public/mock/mock4.png',
        productId: "p1",
        product: {} as Product,
      },
    ],
  },
  {
    id: "p2",
    title: "Бронежилет M3 Defender",
    description: "Бронежилет з рівнем захисту 4+.",
    price: 5720,
    categoryId: "cat2",
    sellerId: "2",
    state: "Active",
    category: mockCategories[1],
    quantity: 10,
    characteristics: [
      {
        id: "c3",
        value: "Пластини кераміка",
        productId: "p2",
        charesteristicDictId: "dict3",
      },
      {
        id: "c4",
        value: "2.9 кг",
        productId: "p2",
        charesteristicDictId: "dict2",
      },
    ],
    attachments: [
      {
        id: "a3",
        filePath: "/images/products/vest1_1.png",
        productId: "p2",
        product: {} as Product,
      },
    ],
  },
];
