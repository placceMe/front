import React, { useState, useEffect } from 'react';
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

export const Chat: React.FC<ChatProps> = ({ roomId, activeRole, currentUserId }) => {
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    return (
        <ChatProvider signalRUrl="http://localhost:5015/hubs/chat">
            <ChatContent
                roomId={roomId}
                activeRole={activeRole}
                currentUserId={currentUserId}
                activeChatId={activeChatId}
                setActiveChatId={setActiveChatId}
            />
        </ChatProvider>
    );
};

interface ChatContentProps {
    roomId: string;
    activeRole: "user" | "saler";
    currentUserId?: string;
    activeChatId: string | null;
    setActiveChatId: (chatId: string | null) => void;
}

const ChatContent: React.FC<ChatContentProps> = ({
    roomId,
    activeRole,
    currentUserId,
    activeChatId,
    setActiveChatId
}) => {
    const { setCurrentUserId } = useChatContext();

    useEffect(() => {
        if (currentUserId) {
            setCurrentUserId(currentUserId);
        }
    }, [currentUserId, setCurrentUserId]);



    return (
        <div className="app">
            <div className="chat-container">
                <div className="chat-sidebar">
                    {
                        activeRole.toLowerCase() === "saler" ? (
                            <ChatListSaler
                                onChatSelect={setActiveChatId}
                                selectedChatId={activeChatId}
                            />
                        ) : (
                            <ChatListBuyer
                                onChatSelect={setActiveChatId}
                                selectedChatId={activeChatId}
                            />
                        )
                    }
                </div>

                <div className="chat-main">
                    {activeChatId ? (
                        <ChatWindow
                            chatId={activeChatId}
                            onClose={() => setActiveChatId(null)}
                        />
                    ) : (
                        <div className="no-chat-selected">
                            <div className="welcome-message">
                                <h3>Welcome to Chat</h3>
                                <p>Select a chat from the list to start messaging</p>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};