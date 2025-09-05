import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useCurrentUserContext } from '../user/CurrentUserContext';
import { useChat } from '../../hooks/useChat';
import type { Chat, CreateChatRequest } from '../../types/chat.types';

interface ChatsContextType {
    chats: Chat[];
    loadUserChats: (userId: string) => Promise<void>;
    createChat: (request: CreateChatRequest) => Promise<Chat | null>;
}

const ChatsContext = createContext<ChatsContextType | undefined>(undefined);

interface ChatsProviderProps {
    children: ReactNode;
}

export const ChatsProvider: React.FC<ChatsProviderProps> = ({ children }) => {
    const { currentUserId } = useCurrentUserContext();
    const chatData = useChat(currentUserId);

    return (
        <ChatsContext.Provider value={chatData}>
            {children}
        </ChatsContext.Provider>
    );
};

export const useChatsContext = () => {
    const context = useContext(ChatsContext);
    if (context === undefined) {
        throw new Error('useChatsContext must be used within a ChatsProvider');
    }
    return context;
};
