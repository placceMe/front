import type { User } from "@shared/types/api";

export const mockUsers: User[] = [
  {
    id: "1",
    state: "Active",
    createdAt: "2024-07-01T12:34:56.000Z",
    name: "Іван",
    surname: "Козак",
    password: "hashed_password",
    email: "ivan@example.com",
    phone: "+380501234567",
    avatarUrl: "/avatars/1.png",
    roles: ["User", "Saler"],
  },
  {
    id: "2",
    state: "Active",
    createdAt: "2024-07-02T08:11:00.000Z",
    name: "Олег",
    surname: "Шевченко",
    password: "hashed_password",
    email: "oleg@example.com",
    phone: "+380671112233",
    avatarUrl: "/avatars/2.png",
    roles: ["User", "Admin"],
  },
];
