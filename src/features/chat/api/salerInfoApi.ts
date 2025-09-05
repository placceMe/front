import { useRequest } from "@shared/request/useRequest";

export interface ContactDto {
  type: string;
  value: string;
}

export interface SalerInfoResponseDto {
  id: string;
  companyName: string;
  description: string;
  schedule: string;
  contacts: ContactDto[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalerInfoApiReturn {
  getSalerInfoByIds: (ids: string[]) => Promise<SalerInfoResponseDto[] | null>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for seller info API operations
 */
export const useSalerInfoApi = (): SalerInfoApiReturn => {
  const { request, loading, error } = useRequest();

  const getSalerInfoByIds = async (
    ids: string[]
  ): Promise<SalerInfoResponseDto[] | null> => {
    if (ids.length === 0) return [];

    console.log("Making API request to /api/salerinfo/by-ids with:", { ids });
    const result = await request<SalerInfoResponseDto[]>(
      "/api/salerinfo/by-ids",
      {
        method: "POST",
        body: JSON.stringify({ ids }),
      }
    );
    console.log("Saler info API response:", result);
    return result;
  };

  return {
    getSalerInfoByIds,
    loading,
    error,
  };
};
