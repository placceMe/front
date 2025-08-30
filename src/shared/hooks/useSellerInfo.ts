import { useEffect, useState, useCallback } from "react";
import { useAppSelector } from "@store/hooks";
import { useRequest } from "@shared/request/useRequest";
import type { SalerInfoDto } from "@shared/types/api";

export function useSellerInfo() {
  const user = useAppSelector(s => s.user.user);
  const { request } = useRequest();

  const [sellerInfo, setSellerInfo] = useState<SalerInfoDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchSellerInfo = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setNotFound(false);
    try {
      const data = await request<SalerInfoDto>(`/api/salerinfo/by-user/${user.id}`);
      if (data) setSellerInfo(data);
      else setNotFound(true);
    } catch (e: any) {
      if (e?.status === 404) setNotFound(true);
      else console.error("Failed to load saler info", e);
      setSellerInfo(null);
    } finally {
      setLoading(false);
    }
  }, [user?.id, request]);

  useEffect(() => { fetchSellerInfo(); }, [fetchSellerInfo]);

  return { sellerInfo, loading, notFound, refetch: fetchSellerInfo };
}
