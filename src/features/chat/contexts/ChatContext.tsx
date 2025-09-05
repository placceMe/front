import React, { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useSignalR } from '../hooks/useSignalR';
import { useChat } from '../hooks/useChat';
import { useNotifications } from '../hooks/useNotifications';
import type { MessageNotification, Chat, CreateChatRequest } from '../types/chat.types';

interface ChatContextType {
    // SignalR
    connection: any;
    isConnected: boolean;
    isConnecting: boolean;

    // Chats
    chats: Chat[];
    loadUserChats: (userId: string) => Promise<void>;
    createChat: (request: CreateChatRequest) => Promise<Chat | null>;

    // Notifications
    notifications: MessageNotification[];
    unreadCount: number;
    addNotification: (notification: MessageNotification) => void;
    markAsRead: (chatId: string) => void;

    // Current user
    currentUserId: string | null;
    setCurrentUserId: (userId: string | null) => void;

    // Chat operations
    joinChat: (chatId: string) => Promise<void>;
    leaveChat: (chatId: string) => Promise<void>;
    subscribeToNotifications: (userId: string) => Promise<void>;
}const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
    children: ReactNode;
    signalRUrl?: string;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({
    children,
    signalRUrl = '/hubs/chat'
}) => {
    const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);

    const { connection, isConnected, isConnecting, startConnection } = useSignalR({
        url: signalRUrl,
        automaticReconnect: true
    });

    const { chats, loadUserChats, createChat } = useChat(currentUserId);
    const { notifications, unreadCount, addNotification, markAsRead: markAsReadCtx } = useNotifications();    // Ініціалізуємо SignalR обробники
    useEffect(() => {
        if (!connection) return;

        // Обробка сповіщень
        connection.on('MessageNotification', (notification: MessageNotification) => {
            // Тут можна додати логіку сповіщень
            console.log('New notification:', notification);

            // Показуємо браузерні сповіщення (опціонально)
            if (Notification.permission === 'granted') {
                new Notification(`Нове повідомлення від ${notification.senderName}`, {
                    body: notification.messagePreview,
                    icon: notification.productImageUrl
                });
            }
        });

        // Очищуємо обробники при unmount
        return () => {
            connection.off('MessageNotification');
        };
    }, [connection]);

    // Методи для роботи з чатами
    const joinChat = async (chatId: string) => {
        if (connection && isConnected) {
            await connection.invoke('JoinChat', chatId);
        }
    };

    const leaveChat = async (chatId: string) => {
        if (connection && isConnected) {
            await connection.invoke('LeaveChat', chatId);
        }
    };

    const subscribeToNotifications = async (userId: string) => {
        if (connection && isConnected) {
            await connection.invoke('SubscribeToUserNotifications', userId);
        }
    };

    const markAsRead = (chatId: string) => {
        // Тут можна додати логіку позначення як прочитане
        console.log('Marking chat as read:', chatId);
    };

    // Автоматично підключаємося при зміні користувача
    useEffect(() => {
        if (currentUserId && !isConnected && !isConnecting) {
            startConnection();
        }
    }, [currentUserId, isConnected, isConnecting, startConnection]);

    // Підписуємося на сповіщення
    useEffect(() => {
        if (currentUserId && isConnected) {
            subscribeToNotifications(currentUserId);
        }
    }, [currentUserId, isConnected]);

    const value: ChatContextType = {
        connection,
        isConnected,
        isConnecting,
        chats,
        loadUserChats,
        createChat,
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        currentUserId,
        setCurrentUserId,
        joinChat,
        leaveChat,
        subscribeToNotifications
    }; return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};