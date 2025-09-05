import { useSignalRContext } from "./signalr/SignalRContext";
import { useCurrentUserContext } from "./user/CurrentUserContext";
import { useChatsContext } from "./chats/ChatsContext";
import { useNotificationsContext } from "./notifications/NotificationsContext";
import { useChatOperationsContext } from "./operations/ChatOperationsContext";

/**
 * Композитний хук, що повертає всі дані з чат контекстів
 * Використовуйте цей хук, якщо потрібен доступ до всіх функцій чату
 */
export const useChatContext = () => {
  const signalR = useSignalRContext();
  const currentUser = useCurrentUserContext();
  const chats = useChatsContext();
  const notifications = useNotificationsContext();
  const operations = useChatOperationsContext();

  return {
    // SignalR
    connection: signalR.connection,
    isConnected: signalR.isConnected,
    isConnecting: signalR.isConnecting,
    startConnection: signalR.startConnection,
    stopConnection: signalR.stopConnection,

    // Current user
    currentUserId: currentUser.currentUserId,
    setCurrentUserId: currentUser.setCurrentUserId,

    // Chats
    chats: chats.chats,
    loadUserChats: chats.loadUserChats,
    createChat: chats.createChat,

    // Notifications
    notifications: notifications.notifications,
    unreadCount: notifications.unreadCount,
    addNotification: notifications.addNotification,
    markAsRead: notifications.markAsRead,

    // Chat operations
    joinChat: operations.joinChat,
    leaveChat: operations.leaveChat,
    subscribeToNotifications: operations.subscribeToNotifications,
  };
};
