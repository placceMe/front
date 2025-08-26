import { useCallback, useEffect, useState } from "react";
import { useSignalRConnection } from "./signalRConnection";

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  roomId: string;
}

interface UseChatProps {
  hubUrl: string;
  userId: string;
  userName: string;
}

export const useReciveChat = ({ hubUrl, userId, userName }: UseChatProps) => {
  const { connection, isConnected, startConnection, stopConnection } =
    useSignalRConnection(hubUrl);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);

  const joinRoom = useCallback(
    async (roomId: string) => {
      if (!connection || !isConnected) {
        throw new Error("No connection available");
      }

      setIsJoiningRoom(true);

      try {
        // Leave current room if exists
        if (currentRoomId) {
          await connection.invoke("LeaveRoom", currentRoomId);
        }

        // Join new room
        await connection.invoke("JoinRoom", roomId, userId, userName);
        setCurrentRoomId(roomId);
        setMessages([]); // Clear messages when switching rooms
      } catch (error) {
        console.error("Failed to join room:", error);
        throw error;
      } finally {
        setIsJoiningRoom(false);
      }
    },
    [connection, isConnected, currentRoomId, userId, userName]
  );

  const leaveRoom = useCallback(async () => {
    if (!connection || !currentRoomId) return;

    try {
      await connection.invoke("LeaveRoom", currentRoomId);
      setCurrentRoomId(null);
      setMessages([]);
    } catch (error) {
      console.error("Failed to leave room:", error);
    }
  }, [connection, currentRoomId]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!connection || !currentRoomId || !message.trim()) return;

      try {
        await connection.invoke(
          "SendMessage",
          currentRoomId,
          userId,
          userName,
          message
        );
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    },
    [connection, currentRoomId, userId, userName]
  );

  // Setup SignalR event listeners
  useEffect(() => {
    if (!connection) return;

    const handleReceiveMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleUserJoined = (userId: string, userName: string) => {
      console.log(`User ${userName} joined the room`);
    };

    const handleUserLeft = (userId: string, userName: string) => {
      console.log(`User ${userName} left the room`);
    };

    connection.on("ReceiveMessage", handleReceiveMessage);
    connection.on("UserJoined", handleUserJoined);
    connection.on("UserLeft", handleUserLeft);

    return () => {
      connection.off("ReceiveMessage", handleReceiveMessage);
      connection.off("UserJoined", handleUserJoined);
      connection.off("UserLeft", handleUserLeft);
    };
  }, [connection]);

  // Auto-connect when component mounts
  useEffect(() => {
    startConnection();
  }, [startConnection]);

  // Leave room on unmount
  useEffect(() => {
    return () => {
      if (currentRoomId) {
        leaveRoom();
      }
    };
  }, [currentRoomId, leaveRoom]);

  return {
    // Connection state
    isConnected,
    isJoiningRoom,
    currentRoomId,

    // Room management
    joinRoom,
    leaveRoom,

    // Messaging
    messages,
    sendMessage,

    // Connection management
    startConnection,
    stopConnection,
  };
};
