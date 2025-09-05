import { useState, useCallback } from "react";
import type { MessageNotification } from "../types/chat.types";

export interface UseNotificationsReturn {
  notifications: MessageNotification[];
  unreadCount: number;
  addNotification: (notification: MessageNotification) => void;
  markAsRead: (chatId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<MessageNotification[]>([]);

  const addNotification = useCallback((notification: MessageNotification) => {
    setNotifications((prev) => [notification, ...prev].slice(0, 50)); // Keep last 50
  }, []);

  const markAsRead = useCallback((chatId: string) => {
    setNotifications((prev) => prev.filter((n) => n.chatId !== chatId));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
};
