import { useState, useCallback } from "react";
import {
  useSalerInfoApi,
  type SalerInfoResponseDto,
} from "../api/salerInfoApi";

export interface UseChatSalerInfoReturn {
  salerInfos: Record<string, SalerInfoResponseDto>;
  loading: boolean;
  error: string | null;
  loadSalerInfoByIds: (ids: string[]) => Promise<void>;
  clearSalerInfos: () => void;
}

/**
 * Hook for managing seller info data in chat context
 * Stores seller infos as a dictionary where key is userId and value is SalerInfoResponseDto object
 */
export const useChatSalerInfo = (): UseChatSalerInfoReturn => {
  const [salerInfos, setSalerInfos] = useState<
    Record<string, SalerInfoResponseDto>
  >({});
  const {
    getSalerInfoByIds,
    loading: apiLoading,
    error: apiError,
  } = useSalerInfoApi();

  const loadSalerInfoByIds = useCallback(
    async (ids: string[]) => {
      console.log("loadSalerInfoByIds called with:", ids);
      if (ids.length === 0) return;

      const existingIds = Object.keys(salerInfos);
      const newIds = ids.filter((id) => !existingIds.includes(id));

      console.log("Existing saler infos:", existingIds);
      console.log("New saler info user IDs to load:", newIds);

      if (newIds.length === 0) {
        console.log("All saler infos already loaded");
        return;
      }

      try {
        console.log("Fetching saler infos for user IDs:", newIds);
        const fetchedSalerInfos = await getSalerInfoByIds(newIds);
        console.log("Fetched saler infos:", fetchedSalerInfos);

        if (fetchedSalerInfos) {
          const salerInfosDict = fetchedSalerInfos.reduce<
            Record<string, SalerInfoResponseDto>
          >((acc, salerInfo) => {
            acc[salerInfo.id] = salerInfo;
            return acc;
          }, {});

          console.log("Saler infos dict to merge:", salerInfosDict);

          setSalerInfos((prev) => ({ ...prev, ...salerInfosDict }));
        }
      } catch (err) {
        console.error("Failed to fetch saler infos:", err);
      }
    },
    [salerInfos, getSalerInfoByIds]
  );

  const clearSalerInfos = useCallback(() => {
    setSalerInfos({});
  }, []);

  return {
    salerInfos,
    loading: apiLoading,
    error: apiError,
    loadSalerInfoByIds,
    clearSalerInfos,
  };
};
