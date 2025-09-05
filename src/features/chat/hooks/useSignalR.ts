import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useState, useEffect, useCallback } from "react";

export interface UseSignalROptions {
  url: string;
  automaticReconnect?: boolean;
  logging?: LogLevel;
}

export interface UseSignalRReturn {
  connection: HubConnection | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  startConnection: () => Promise<void>;
  stopConnection: () => Promise<void>;
}

export const useSignalR = ({
  url,
  automaticReconnect = true,
  logging = LogLevel.Information,
}: UseSignalROptions): UseSignalRReturn => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startConnection = useCallback(async () => {
    if (connection?.state === "Connected") return;

    setIsConnecting(true);
    setError(null);

    try {
      const hubConnection = new HubConnectionBuilder()
        .withUrl(url)
        .configureLogging(logging);

      if (automaticReconnect) {
        hubConnection.withAutomaticReconnect();
      }

      const builtConnection = hubConnection.build();

      builtConnection.onclose((error) => {
        setIsConnected(false);
        if (error) {
          setError(error.message);
        }
      });

      builtConnection.onreconnecting((error) => {
        setIsConnected(false);
        setError(error ? error.message : "Reconnecting...");
      });

      builtConnection.onreconnected(() => {
        setIsConnected(true);
        setError(null);
      });

      await builtConnection.start();
      setConnection(builtConnection);
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setIsConnecting(false);
    }
  }, [url, automaticReconnect, logging, connection]);

  const stopConnection = useCallback(async () => {
    if (connection) {
      await connection.stop();
      setConnection(null);
      setIsConnected(false);
    }
  }, [connection]);

  useEffect(() => {
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [connection]);

  return {
    connection,
    isConnected,
    isConnecting,
    error,
    startConnection,
    stopConnection,
  };
};
