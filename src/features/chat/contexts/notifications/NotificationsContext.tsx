import React, { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useSignalRContext } from '../signalr/SignalRContext';
import { useNotifications } from '../../hooks/useNotifications';
import type { MessageNotification } from '../../types/chat.types';

interface NotificationsContextType {
    notifications: MessageNotification[];
    unreadCount: number;
    addNotification: (notification: MessageNotification) => void;
    markAsRead: (chatId: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

interface NotificationsProviderProps {
    children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
    const { connection } = useSignalRContext();
    const notificationsData = useNotifications();
    const { addNotification } = notificationsData;

    useEffect(() => {
        if (!connection) return;


        const handleMessageNotification = (notification: MessageNotification) => {
            console.log('New notification:', notification);
            addNotification(notification);


            if (Notification.permission === 'granted') {
                new Notification(`Нове повідомлення від ${notification.senderName}`, {
                    body: notification.messagePreview,
                    icon: notification.productImageUrl
                });
            }
        };

        connection.on('MessageNotification', handleMessageNotification);


        return () => {
            connection.off('MessageNotification');
        };
    }, [connection, addNotification]);

    const markAsRead = (chatId: string) => {

        console.log('Marking chat as read:', chatId);
    };

    const value: NotificationsContextType = {
        ...notificationsData,
        markAsRead
    };

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotificationsContext = () => {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error('useNotificationsContext must be used within a NotificationsProvider');
    }
    return context;
};
