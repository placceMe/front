import React, { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useSignalRContext } from '../signalr/SignalRContext';
import { useCurrentUserContext } from '../user/CurrentUserContext';

interface ChatOperationsContextType {
    joinChat: (chatId: string) => Promise<void>;
    leaveChat: (chatId: string) => Promise<void>;
    subscribeToNotifications: (userId: string) => Promise<void>;
}

const ChatOperationsContext = createContext<ChatOperationsContextType | undefined>(undefined);

interface ChatOperationsProviderProps {
    children: ReactNode;
}

export const ChatOperationsProvider: React.FC<ChatOperationsProviderProps> = ({ children }) => {
    const { connection, isConnected } = useSignalRContext();
    const { currentUserId } = useCurrentUserContext();

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

    // Підписуємося на сповіщення при зміні користувача
    useEffect(() => {
        if (currentUserId && isConnected) {
            subscribeToNotifications(currentUserId);
        }
    }, [currentUserId, isConnected]);

    const value: ChatOperationsContextType = {
        joinChat,
        leaveChat,
        subscribeToNotifications
    };

    return (
        <ChatOperationsContext.Provider value={value}>
            {children}
        </ChatOperationsContext.Provider>
    );
};

export const useChatOperationsContext = () => {
    const context = useContext(ChatOperationsContext);
    if (context === undefined) {
        throw new Error('useChatOperationsContext must be used within a ChatOperationsProvider');
    }
    return context;
};
