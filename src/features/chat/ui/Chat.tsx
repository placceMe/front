import React, { useState, useEffect, useCallback, memo } from 'react';
import { ChatProvider, useChatContext } from '../contexts/ChatContext';
import { ChatWindow } from '../components/ChatWindow';
import { ChatList } from '../components/ChatList';
import "./chat.css";
import { ChatListSaler } from '../components/ChatListSaler';
import { ChatListBuyer } from '../components/ChatListBuyer';

interface ChatProps {
    roomId: string;
    activeRole: "user" | "saler";
    currentUserId?: string;
}

// ✅ ИСПРАВЛЕНИЕ 7: Мемоизируем основной компонент
export const Chat: React.FC<ChatProps> = memo(({ roomId, activeRole, currentUserId }) => {
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    return (
        <ChatProvider signalRUrl="http://localhost:5005/hubs/chat">
            <ChatContent
                roomId={roomId}
                activeRole={activeRole}
                currentUserId={currentUserId}
                activeChatId={activeChatId}
                setActiveChatId={setActiveChatId}
            />
        </ChatProvider>
    );
});

interface ChatContentProps {
    roomId: string;
    activeRole: "user" | "saler";
    currentUserId?: string;
    activeChatId: string | null;
    setActiveChatId: (chatId: string | null) => void;
}

// ✅ ИСПРАВЛЕНИЕ 8: Мемоизируем контент и коллбеки
const ChatContent: React.FC<ChatContentProps> = memo(({
    roomId,
    activeRole,
    currentUserId,
    activeChatId,
    setActiveChatId
}) => {
    const { setCurrentUserId } = useChatContext();

    // ✅ ИСПРАВЛЕНИЕ 9: Мемоизируем коллбеки
    const handleChatSelect = useCallback((chatId: string | null) => {
        setActiveChatId(chatId);
    }, [setActiveChatId]);

    const handleCloseChat = useCallback(() => {
        setActiveChatId(null);
    }, [setActiveChatId]);

    // ✅ ИСПРАВЛЕНИЕ 10: Устанавливаем currentUserId только один раз
    useEffect(() => {
        if (currentUserId) {
            setCurrentUserId(currentUserId);
        }
    }, [currentUserId, setCurrentUserId]);

    return (
        <div className="app">
          <h2
  style={{
    color: '#3E4826',
    fontSize: 'clamp(22px, 2.4vw + 12px, 36px)',
    fontWeight: 600,
    margin: '0 0 12px',
    lineHeight: 1.2,
    padding:12
  }}
>
  Листування
</h2>

            <div className="chat-container">
           
                <div className="chat-sidebar">
                    {
                        activeRole.toLowerCase() === "saler" ? (
                            <ChatListSaler
                                onChatSelect={handleChatSelect}
                                selectedChatId={activeChatId}
                            />
                        ) : (
                            <ChatListBuyer
                                onChatSelect={handleChatSelect}
                                selectedChatId={activeChatId}
                            />
                        )
                    }
                </div>

                <div className="chat-main">
                    {activeChatId ? (
                        <ChatWindow
                            chatId={activeChatId}
                            onClose={handleCloseChat}
                        />
                    ) : (
                        <div className="no-chat-selected">
                            
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});