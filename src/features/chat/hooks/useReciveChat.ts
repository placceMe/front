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
    } catch (error) {
      console.error("Failed to leave room:", error);
    }
  }, [connection, currentRoomId]);

  const handleWrittenMessage = async (message: ChatMessage) => {
    if (!connection || !currentRoomId || !message) return;
    // Handle written messages
    try {
      await connection.invoke(
        "markMessageAsRead",
        currentRoomId,
        userId,
        userName,
        message.id
      );
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Setup SignalR event listeners
  useEffect(() => {
    if (!connection) return;

    const handleUserJoined = (userId: string, userName: string) => {
      console.log(`User ${userName} joined the room`);
    };

    const handleUserLeft = (userId: string, userName: string) => {
      console.log(`User ${userName} left the room`);
    };

    connection.on("UserJoined", handleUserJoined);
    connection.on("UserLeft", handleUserLeft);

    return () => {
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
    connection,
    isConnected,
    isJoiningRoom,
    currentRoomId,

    // Room management
    joinRoom,
    leaveRoom,

    // Messaging
    handleWrittenMessage,

    // Connection management
    startConnection,
    stopConnection,
  };
};
