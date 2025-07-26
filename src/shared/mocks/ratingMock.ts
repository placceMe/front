import type { Rating } from "@shared/types/api";

export const mockRatings: Rating[] = [
  {
    id: "r1",
    productId: "p1",
    userId: "2",
    value: 5,
    comment: "Надійний та зручний шолом!",
    createdAt: "2024-07-02T11:00:00.000Z",
    state: "Active",
  },
  {
    id: "r2",
    productId: "p2",
    userId: "1",
    value: 4,
    comment: "Бронежилет якісний, але важкуватий.",
    createdAt: "2024-07-03T15:20:00.000Z",
    state: "Active",
  },
];
