import { useCallback, useEffect, useState } from "react";
import { useRecieveChat } from "./useRecieveChat";
import { useRequest } from "@shared/request/useRequest";

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  roomId: string;
}

interface ChatInfo {
  id: string;
  name: string;
  description?: string;
  participantCount?: number;
  lastActivity?: Date;
}

interface ChatData {
  chatInfo: ChatInfo;
  messages: ChatMessage[];
}

interface ChatsState {
  [chatId: string]: ChatData;
}

interface UseChatProps {
  hubUrl: string;
  userId: string;
  userName: string;
}

export const useChat = ({ hubUrl, userId, userName }: UseChatProps) => {
  const { request, loading } = useRequest();

  const { connection, isConnected, startConnection, stopConnection, joinRoom } =
    useRecieveChat(hubUrl);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatsState>({});
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);

  // Initialize chat if it doesn't exist
  const initializeChat = useCallback(
    (chatId: string, chatInfo: Partial<ChatInfo>) => {
      setChats((prev) => {
        if (prev[chatId]) return prev;

        return {
          ...prev,
          [chatId]: {
            chatInfo: {
              id: chatId,
              name: chatInfo.name || `Chat ${chatId}`,
              ...chatInfo,
            },
            messages: [],
          },
        };
      });
    },
    []
  );

  const leaveRoom = useCallback(async () => {
    if (!connection || !currentRoomId) return;

    try {
      await connection.invoke("LeaveRoom", currentRoomId);
      setCurrentRoomId(null);
    } catch (error) {
      console.error("Failed to leave room:", error);
    }
  }, [connection, currentRoomId]);

  const sendMessage = useCallback(
    async (message: string, chatId?: string) => {
      const targetChatId = chatId || currentRoomId;
      if (!targetChatId || !message.trim()) return;

      try {
        await request("/api/chat/messages", {
          method: "POST",
          body: JSON.stringify({
            roomId: targetChatId,
            userId,
            userName,
            message: message.trim(),
          }),
        });
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    },
    [request, currentRoomId, userId, userName]
  );

  const addMessageToChat = useCallback(
    (chatId: string, message: ChatMessage) => {
      setChats((prev) => {
        if (!prev[chatId]) {
          // Initialize chat if it doesn't exist
          return {
            ...prev,
            [chatId]: {
              chatInfo: {
                id: chatId,
                name: `Chat ${chatId}`,
                lastActivity: message.timestamp,
              },
              messages: [message],
            },
          };
        }

        return {
          ...prev,
          [chatId]: {
            ...prev[chatId],
            chatInfo: {
              ...prev[chatId].chatInfo,
              lastActivity: message.timestamp,
            },
            messages: [...prev[chatId].messages, message],
          },
        };
      });
    },
    []
  );

  const updateChatInfo = useCallback(
    (chatId: string, updates: Partial<ChatInfo>) => {
      setChats((prev) => {
        if (!prev[chatId]) return prev;

        return {
          ...prev,
          [chatId]: {
            ...prev[chatId],
            chatInfo: {
              ...prev[chatId].chatInfo,
              ...updates,
            },
          },
        };
      });
    },
    []
  );

  // Get current chat data
  const currentChat = currentRoomId ? chats[currentRoomId] : null;
  const currentMessages = currentChat?.messages || [];

  return {
    // Connection state
    isConnected,
    isJoiningRoom,
    currentRoomId,

    // Chat data
    chats,
    currentChat,
    currentMessages,

    // Room management
    joinRoom,
    leaveRoom,
    initializeChat,

    // Messaging
    sendMessage,
    addMessageToChat,
    updateChatInfo,

    // Connection management
    startConnection,
    stopConnection,
  };
};
