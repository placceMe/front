import { useCallback, useEffect, useState } from "react";
import { useReciveChat } from "./useReciveChat";
import { useRequest } from "@shared/request/useRequest";

interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  sentAt: Date;
  isRead: boolean;
  // Optionally, you can add a 'chat' property if needed for navigation
  // chat?: ChatInfo;
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
  receiver: ReturnType<typeof useReciveChat>;
  roomId: string;
}

export const useChat = ({ receiver, roomId }: UseChatProps) => {
  const { request: sendMessageRequest, loading: isSendingMessage } =
    useRequest();
  const { request: startChatRequest, loading: isStartingChat } = useRequest();
  const { request: getMyChatsRequest, loading: isLoadingMyChats } =
    useRequest();
  const { request: getSpecificChatRequest, loading: isLoadingSpecificChat } =
    useRequest();
  const { request: getChatMessagesRequest, loading: isLoadingMessages } =
    useRequest();

  const {
    isConnected,
    startConnection,
    stopConnection,
    joinRoom,
    leaveRoom,
    isJoiningRoom,
    connection,
  } = receiver;

  const [chats, setChats] = useState<ChatsState>({});

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

  const sendMessage = useCallback(
    async (message: string, chatId?: string) => {
      const targetChatId = chatId || roomId;
      if (!targetChatId || !message.trim()) return;

      try {
        await sendMessageRequest(`/api/chat/${targetChatId}/messages`, {
          method: "POST",
          body: JSON.stringify({
            content: message.trim(),
          }),
        });
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    },
    [sendMessageRequest, roomId]
  );

  const startChatWithSeller = useCallback(
    async (productId: string) => {
      try {
        const response = await startChatRequest("/api/chat/start", {
          method: "POST",
          body: JSON.stringify({
            productId,
          }),
        });
        return response;
      } catch (error) {
        console.error("Failed to start chat:", error);
        throw error;
      }
    },
    [startChatRequest]
  );

  const getMyChats = useCallback(async () => {
    try {
      const response = await getMyChatsRequest("/api/chat/my-chats");
      return response;
    } catch (error) {
      console.error("Failed to get chats:", error);
      throw error;
    }
  }, [getMyChatsRequest]);

  const getSpecificChat = useCallback(
    async (chatId: string) => {
      try {
        const response = await getSpecificChatRequest(`/api/chat/${chatId}`);
        return response;
      } catch (error) {
        console.error("Failed to get chat:", error);
        throw error;
      }
    },
    [getSpecificChatRequest]
  );

  const getChatMessages = useCallback(
    async (chatId: string, page: number = 1, pageSize: number = 50) => {
      try {
        const response = await getChatMessagesRequest(
          `/api/chat/${chatId}/messages?page=${page}&pageSize=${pageSize}`
        );
        return response;
      } catch (error) {
        console.error("Failed to get chat messages:", error);
        throw error;
      }
    },
    [getChatMessagesRequest]
  );

  const loadChatMessages = useCallback(
    async (chatId: string, page: number = 1, pageSize: number = 50) => {
      try {
        const messages = await getChatMessages(chatId, page, pageSize);

        setChats((prev) => ({
          ...prev,
          [chatId]: {
            ...prev[chatId],
            messages:
              page === 1
                ? messages
                : [...(prev[chatId]?.messages || []), ...messages],
          },
        }));

        return messages;
      } catch (error) {
        console.error("Failed to load chat messages:", error);
        throw error;
      }
    },
    [getChatMessages]
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
                lastActivity: message.sentAt,
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
              lastActivity: message.sentAt,
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
  const currentChat = roomId ? chats[roomId] : null;
  const currentMessages = currentChat?.messages || [];

  // Handle incoming messages from SignalR
  const processIncomingMessage = useCallback(
    (message: ChatMessage) => {
      addMessageToChat(message.chatId, message);
    },
    [addMessageToChat]
  );

  useEffect(() => {
    if (!connection) return;

    connection.on("ReceiveMessage", processIncomingMessage);

    return () => {
      connection.off("ReceiveMessage", processIncomingMessage);
    };
  }, [connection, processIncomingMessage]);

  return {
    // Connection state
    isConnected,
    isJoiningRoom,
    roomId,

    // Loading states
    isSendingMessage,
    isStartingChat,
    isLoadingMyChats,
    isLoadingSpecificChat,
    isLoadingMessages,

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
    // processIncomingMessage,

    // API methods
    startChatWithSeller,
    getMyChats,
    getSpecificChat,
    getChatMessages,
    loadChatMessages,

    // Connection management
    startConnection,
    stopConnection,
  };
};
