import { useRequest } from "@shared/request/useRequest";
import type { User } from "@shared/types/api";

export interface UsersApiReturn {
  getUsersByIds: (ids: string[]) => Promise<User[] | null>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for users API operations
 */
export const useUsersApi = (): UsersApiReturn => {
  const { request, loading, error } = useRequest();

  const getUsersByIds = async (ids: string[]): Promise<User[] | null> => {
    if (ids.length === 0) return [];

    console.log("Making API request to /api/users/by-ids with:", { ids });
    const result = await request<User[]>("/api/users/by-ids", {
      method: "POST",
      body: JSON.stringify({ ids }),
    });
    console.log("API response:", result);
    return result;
  };

  return {
    getUsersByIds,
    loading,
    error,
  };
};
