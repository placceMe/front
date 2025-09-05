// Main component
export { Chat } from "./ui/Chat";

// Context
export { ChatProvider, useChatContext } from "./contexts/ChatContext";

// Components
export { ChatWindow } from "./components/ChatWindow";

// Hooks
export { useSignalR } from "./hooks/useSignalR";
export { useChat } from "./hooks/useChat";
export { useNotifications } from "./hooks/useNotifications";
export { useChatUsers } from "./hooks/useChatUsers";
export { useChatProducts } from "./hooks/useChatProducts";

// API
export { useUsersApi } from "./api/usersApi";
export { useProductsApi } from "./api/productsApi";

// Types
export type * from "./types/chat.types";

// Utils
export {
  requestNotificationPermission,
  showNotification,
} from "./utils/notifications";
