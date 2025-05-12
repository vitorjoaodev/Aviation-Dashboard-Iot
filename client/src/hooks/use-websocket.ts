import { useState, useEffect, useCallback } from "react";

type WebSocketStatus = "connecting" | "open" | "closing" | "closed" | "uninstantiated";

interface UseWebSocketOptions {
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  reconnectAttempts?: number;
  autoReconnect?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>("uninstantiated");
  const [reconnectCount, setReconnectCount] = useState(0);

  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectInterval = 3000,
    reconnectAttempts = 5,
    autoReconnect = true,
  } = options;

  const connect = useCallback(() => {
    // Close any existing connections
    if (socket) {
      socket.close();
    }

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const ws = new WebSocket(wsUrl);
      setSocket(ws);
      setStatus("connecting");

      ws.onopen = () => {
        setStatus("open");
        setReconnectCount(0);
        if (onOpen) onOpen();
      };

      ws.onclose = () => {
        setStatus("closed");
        if (onClose) onClose();
        
        // Attempt to reconnect if auto reconnect is enabled and we haven't exceeded the max attempts
        if (autoReconnect && (reconnectAttempts === Infinity || reconnectCount < reconnectAttempts)) {
          setTimeout(() => {
            setReconnectCount(prev => prev + 1);
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        if (onError) onError(error);
      };

      ws.onmessage = (event) => {
        if (onMessage) {
          try {
            const parsedData = JSON.parse(event.data);
            onMessage(parsedData);
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
            onMessage(event.data);
          }
        }
      };

    } catch (error) {
      console.error("WebSocket connection error:", error);
      setStatus("closed");
    }
  }, [
    socket,
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectInterval,
    reconnectAttempts,
    reconnectCount,
    autoReconnect,
  ]);

  const disconnect = useCallback(() => {
    if (socket && status === "open") {
      socket.close();
      setStatus("closing");
    }
  }, [socket, status]);

  const sendMessage = useCallback(
    (data: any) => {
      if (socket && status === "open") {
        const message = typeof data === "string" ? data : JSON.stringify(data);
        socket.send(message);
        return true;
      }
      return false;
    },
    [socket, status]
  );

  // Connect when the component mounts
  useEffect(() => {
    connect();
    return () => {
      if (socket) {
        socket.close();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    socket,
    status,
    connect,
    disconnect,
    sendMessage,
    reconnectCount,
  };
}
