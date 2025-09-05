import { useState, useCallback } from "react";
import { useUsersApi } from "../api/usersApi";
import type { User } from "@shared/types/api";

export interface UseChatUsersReturn {
  users: Record<string, User>;
  loading: boolean;
  error: string | null;
  loadUsersByIds: (ids: string[]) => Promise<void>;
  clearUsers: () => void;
}

/**
 * Hook for managing user data in chat context
 * Stores users as a dictionary where key is userId and value is User object
 */
export const useChatUsers = (): UseChatUsersReturn => {
  const [users, setUsers] = useState<Record<string, User>>({});
  const { getUsersByIds, loading: apiLoading, error: apiError } = useUsersApi();

  const loadUsersByIds = useCallback(
    async (ids: string[]) => {
      console.log("loadUsersByIds called with:", ids);
      if (ids.length === 0) return;

      const existingIds = Object.keys(users);
      const newIds = ids.filter((id) => !existingIds.includes(id));

      console.log("Existing users:", existingIds);
      console.log("New user IDs to load:", newIds);

      if (newIds.length === 0) {
        console.log("All users already loaded");
        return;
      }

      try {
        console.log("Fetching users for IDs:", newIds);
        const fetchedUsers = await getUsersByIds(newIds);
        console.log("Fetched users:", fetchedUsers);

        if (fetchedUsers) {
          const usersDict = fetchedUsers.reduce<Record<string, User>>(
            (acc, user) => {
              acc[user.id] = user;
              return acc;
            },
            {}
          );

          console.log("Users dict to merge:", usersDict);

          setUsers((prev) => ({ ...prev, ...usersDict }));
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    },
    [users, getUsersByIds]
  );

  const clearUsers = useCallback(() => {
    setUsers({});
  }, []);

  return {
    users,
    loading: apiLoading,
    error: apiError,
    loadUsersByIds,
    clearUsers,
  };
};
