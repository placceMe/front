import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";

export const useSignalRConnection = (url: string) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const connectionRef = useRef<HubConnection | null>(null);

  const startConnection = async () => {
    if (connectionRef.current) return;

    setIsConnecting(true);

    try {
      const newConnection = new HubConnectionBuilder()
        .withUrl(url)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      newConnection.onclose(() => {
        setIsConnected(false);
        setConnection(null);
        connectionRef.current = null;
      });

      newConnection.onreconnecting(() => {
        setIsConnected(false);
      });

      newConnection.onreconnected(() => {
        setIsConnected(true);
      });

      await newConnection.start();

      connectionRef.current = newConnection;
      setConnection(newConnection);
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to start SignalR connection:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const stopConnection = async () => {
    if (connectionRef.current) {
      await connectionRef.current.stop();
      connectionRef.current = null;
      setConnection(null);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    return () => {
      stopConnection();
    };
  }, []);

  return {
    connection,
    isConnected,
    isConnecting,
    startConnection,
    stopConnection,
  };
};
