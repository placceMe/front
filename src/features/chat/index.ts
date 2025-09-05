// Main component
export { Chat } from "./ui/Chat";

// Context
export { ChatProvider, useChatContext } from "./contexts/ChatContext";

// Components
export { ChatWindow } from "./components/ChatWindow";

// Hooks
export { useSignalR } from "./hooks/useSignalR";
export { useChat } from "./hooks/useChat";
export { useChatMessages } from "./hooks/useChatMessages_new";
export { useNotifications } from "./hooks/useNotifications";

// Types
export type * from "./types/chat.types";

// Utils
export {
  requestNotificationPermission,
  showNotification,
} from "./utils/notifications";
