import React, { useEffect, useState } from 'react';
import { useChatMessages } from '../hooks/useChatMessages';
import { useChatContext } from '../contexts/ChatContext';

interface ChatWindowProps {
    chatId: string;
    onClose?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, onClose }) => {
    const {
        connection,
        isConnected,
        currentUserId,
        joinChat,
        leaveChat,
        markAsRead,
        chats,

        loadUserChats
    } = useChatContext();
    const { messages, loadMessages, addMessage, clearMessages } = useChatMessages();
    const [isJoined, setIsJoined] = useState(false);


    const currentChat = chats.find(chat => chat.id === chatId);








    useEffect(() => {
        if (chatId) {
            loadMessages(chatId);
            markAsRead(chatId);
        }

        return () => clearMessages();
    }, [chatId, loadMessages, markAsRead, clearMessages]);


    useEffect(() => {
        if (currentUserId && chats.length === 0) {
            console.log('Loading user chats for:', currentUserId);
            loadUserChats(currentUserId);
        }
    }, [currentUserId, chats.length, loadUserChats]);






































    useEffect(() => {
        if (chatId && isConnected && !isJoined) {
            joinChat(chatId);
            setIsJoined(true);
        }

        return () => {
            if (chatId && isJoined) {
                leaveChat(chatId);
                setIsJoined(false);
            }
        };
    }, [chatId, isConnected, isJoined, joinChat, leaveChat]);


    useEffect(() => {
        if (!connection) return;

        const handleMessage = (message: any) => {
            if (message.chatId === chatId) {
                addMessage(message);
            }
        };

        connection.on('MessageCreated', handleMessage);

        return () => {
            connection.off('MessageCreated', handleMessage);
        };
    }, [connection, chatId, addMessage]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="chat-info">

                </div>
                {onClose && (
                    <button onClick={onClose} className="close-btn">×</button>
                )}
            </div>

            <div className="messages-container">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.senderUserId === currentUserId ? 'own' : 'other'}`}
                    >
                        <div className="message-content">{message.body}</div>
                        <div className="message-time">
                            {new Date(message.createdAt).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
            </div>

            <MessageInput
                chatId={chatId}
                disabled={!isConnected}
            />
        </div>
    );
};


interface MessageInputProps {
    chatId: string;
    disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId, disabled }) => {
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const { sendMessage } = useChatMessages();
    const { currentUserId } = useChatContext();

    const handleSend = async () => {
        if (!text.trim() || !currentUserId || sending) return;

        setSending(true);
        const success = await sendMessage(chatId, {
            senderUserId: currentUserId,
            body: text.trim()
        });

        if (success) {
            setText('');
        }
        setSending(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="message-input">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Введіть повідомлення..."

                rows={3}
            />
            <button
                onClick={handleSend}
                disabled={!text.trim() || disabled || sending}
                className="send-btn"
            >
                {sending ? '⏳' : '📤'}
            </button>
        </div>
    );
};