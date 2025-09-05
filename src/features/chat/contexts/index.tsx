import React from 'react';
import type { ReactNode } from 'react';
import { SignalRProvider } from './signalr/SignalRContext';
import { CurrentUserProvider } from './user/CurrentUserContext';
import { ChatsProvider } from './chats/ChatsContext';
import { NotificationsProvider } from './notifications/NotificationsContext';
import { ChatOperationsProvider } from './operations/ChatOperationsContext';

interface ChatProviderProps {
    children: ReactNode;
    signalRUrl?: string;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({
    children,
    signalRUrl = '/hubs/chat'
}) => {
    return (
        <SignalRProvider signalRUrl={signalRUrl}>
            <CurrentUserProvider>
                <ChatsProvider>
                    <NotificationsProvider>
                        <ChatOperationsProvider>
                            {children}
                        </ChatOperationsProvider>
                    </NotificationsProvider>
                </ChatsProvider>
            </CurrentUserProvider>
        </SignalRProvider>
    );
};


export { useSignalRContext } from './signalr/SignalRContext';
export { useCurrentUserContext } from './user/CurrentUserContext';
export { useChatsContext } from './chats/ChatsContext';
export { useNotificationsContext } from './notifications/NotificationsContext';
export { useChatOperationsContext } from './operations/ChatOperationsContext';


export { useChatContext } from './useChatContext';
