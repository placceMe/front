import { useEffect, useState } from "react";
import { useRequest } from "@shared/request/useRequest";

interface Contact {
  type: string;
  value: string;
}

interface SellerInfo {
  id: string;
  description: string;
  schedule: string;
  contacts: Contact[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const useSellerInfo = (userId?: string) => {
  const [seller, setSeller] = useState<SellerInfo | null>(null);
  const { request } = useRequest();

  useEffect(() => {
    if (!userId) return;

    request<SellerInfo>(`/api/salerinfo/by-user/${userId}`)
      .then(setSeller)
      .catch(() => setSeller(null));
  }, [userId]);

  return seller;
};
