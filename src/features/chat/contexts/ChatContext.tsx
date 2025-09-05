// DEPRECATED: Цей файл залишений для зворотної сумісності
// Використовуйте замість нього @features/chat/contexts

export { ChatProvider, useChatContext } from './index';

// Також експортуємо специфічні хуки для міграції
export {
    useSignalRContext,
    useCurrentUserContext,
    useChatsContext,
    useNotificationsContext,
    useChatOperationsContext
} from './index';