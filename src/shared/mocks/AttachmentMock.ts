import type { Attachment, Product } from "@shared/types/api";

export const mockAttachments: Attachment[] = [
  {
    id: "a1",
    filePath: "https://specprom-kr.com.ua/image/cache/catalog/easyphoto/3867/plitonoska-ibv-multikam-s-podsumkami-14-564x564.webp",
    productId: "p1",
    product: {} as Product,
  },
  {
    id: "a2",
    filePath: "/images/products/helmet1_2.png",
    productId: "p1",
    product: {} as Product,
  },
  {
    id: "a3",
    filePath: "/images/products/vest1_1.png",
    productId: "p2",
    product: {} as Product,
  },
];
