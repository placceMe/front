import { useState, useCallback } from "react";
import type { Chat, CreateChatRequest } from "../types/chat.types";
import { useAppSelector } from "@store/hooks";

const API_BASE_URL = __BASE_URL__;

export interface UseChatReturn {
  chats: Chat[];
  loading: boolean;
  error: string | null;
  loadUserChats: (userId: string) => Promise<void>;
  createChat: (request: CreateChatRequest) => Promise<Chat | null>;
  refreshChats: () => Promise<void>;
}

export const useChat = (currentUserId: string | null): UseChatReturn => {
  const { activeRole } = useAppSelector((state) => state.user);

  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserChats = useCallback(async (userId: string) => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const partPath =
        activeRole?.toLowerCase() === "saler" ? "sellerId" : "buyerId";

      // Завантажуємо чати де користувач як seller та buyer
      const [sellerResponse, buyerResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/chats?sellerId=${userId}`),
        fetch(`${API_BASE_URL}/api/chats?buyerId=${userId}`),
      ]);

      const sellerChats = sellerResponse.ok ? await sellerResponse.json() : [];
      const buyerChats = buyerResponse.ok ? await buyerResponse.json() : [];

      // Об'єднуємо та видаляємо дублікати
      const allChats = [...sellerChats, ...buyerChats];
      const uniqueChats = allChats.filter(
        (chat, index, self) => index === self.findIndex((c) => c.id === chat.id)
      );

      setChats(uniqueChats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chats");
    } finally {
      setLoading(false);
    }
  }, []);

  const createChat = useCallback(
    async (request: CreateChatRequest): Promise<Chat | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/chats`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          throw new Error(`Failed to create chat: ${response.status}`);
        }

        const newChat = await response.json();

        // Додаємо до списку чатів
        setChats((prev) => [newChat, ...prev]);

        return newChat;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create chat");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const refreshChats = useCallback(async () => {
    if (currentUserId) {
      await loadUserChats(currentUserId);
    }
  }, [currentUserId, loadUserChats]);

  return {
    chats,
    loading,
    error,
    loadUserChats,
    createChat,
    refreshChats,
  };
};
