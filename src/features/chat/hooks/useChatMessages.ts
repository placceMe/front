import { useState, useCallback } from "react";
import type { ChatMessage, CreateMessageRequest } from "../types/chat.types";

const API_BASE_URL = "http://localhost:5015";

export interface UseChatMessagesReturn {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (
    chatId: string,
    request: CreateMessageRequest
  ) => Promise<boolean>;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

export const useChatMessages = (): UseChatMessagesReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(
    async (chatId: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/chats/${chatId}/messages`
        );

        if (!response.ok) {
          throw new Error(`Failed to load messages: ${response.status}`);
        }

        const chatMessages = await response.json();
        setMessages(chatMessages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load messages"
        );
      } finally {
        setLoading(false);
      }
    },
    [setMessages]
  );

  const sendMessage = useCallback(
    async (chatId: string, request: CreateMessageRequest): Promise<boolean> => {
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/chats/${chatId}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to send message: ${response.status}`);
        }

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
        return false;
      }
    },
    []
  );

  const addMessage = useCallback(
    (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    },
    [setMessages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  return {
    messages,
    loading,
    error,
    loadMessages,
    sendMessage,
    addMessage,
    clearMessages,
  };
};
