import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useChatMessages } from '../hooks/useChatMessages';
import { useChatContext } from '../contexts/ChatContext';
import SendIcon from '../../../assets/icons/send.svg?react'

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

    // Используем ref для отслеживания последнего загруженного chatId
    const lastLoadedChatId = useRef<string | null>(null);
    const hasLoadedUserChats = useRef(false);

    const currentChat = chats.find(chat => chat.id === chatId);

    // ✅ ИСПРАВЛЕНИЕ 1: Мемоизируем функции, чтобы они не пересоздавались
    const handleLoadMessages = useCallback(() => {
        if (chatId && lastLoadedChatId.current !== chatId) {
            loadMessages(chatId);
            markAsRead(chatId);
            lastLoadedChatId.current = chatId;
        }
    }, [chatId]); // Убираем функции из зависимостей!

    const handleClearMessages = useCallback(() => {
        clearMessages();
        lastLoadedChatId.current = null;
    }, []); // Мемоизируем функцию очистки

    // ✅ ИСПРАВЛЕНИЕ 2: Загружаем сообщения только при смене chatId
    useEffect(() => {
        if (chatId) {
            handleLoadMessages();
        }
        
        return () => {
            handleClearMessages();
        };
    }, [chatId]); // Только chatId в зависимостях!

    // ✅ ИСПРАВЛЕНИЕ 3: Загружаем чаты пользователя только один раз
    useEffect(() => {
        if (currentUserId && !hasLoadedUserChats.current) {
            console.log('Loading user chats for:', currentUserId);
            loadUserChats(currentUserId);
            hasLoadedUserChats.current = true;
        }
    }, [currentUserId]); // Убираем chats.length!

    // ✅ ИСПРАВЛЕНИЕ 4: Улучшаем управление подключением к чату
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
    }, [chatId, isConnected]); // Убираем isJoined из зависимостей!

    // ✅ ИСПРАВЛЕНИЕ 5: Мемоизируем обработчик сообщений
    const handleMessage = useCallback((message: any) => {
        if (message.chatId === chatId) {
            addMessage(message);
        }
    }, [chatId]); // Только chatId в зависимостях

    useEffect(() => {
        if (!connection) return;

        connection.on('MessageCreated', handleMessage);

        return () => {
            connection.off('MessageCreated', handleMessage);
        };
    }, [connection, handleMessage]); // Используем мемоизированный обработчик

    return (
        <div className="chat-window">
         

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

const MessageInput: React.FC<MessageInputProps> = React.memo(({ chatId, disabled }) => {
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const { sendMessage } = useChatMessages();
    const { currentUserId } = useChatContext();

    // ✅ ИСПРАВЛЕНИЕ 6: Мемоизируем обработчик отправки
    const handleSend = useCallback(async () => {
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
    }, [chatId, currentUserId, text, sending, sendMessage]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    return (
        <div className="message-input">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Напишіть повідомлення..."
                rows={3}
            />
            <button
                onClick={handleSend}
                disabled={!text.trim() || disabled || sending}
                className="send-btn"
            >
                {sending ? '⏳' : <SendIcon className="icon" />}
            </button>
        </div>
    );
});