import React, { useState, useEffect } from 'react';
import { useChatContext } from '../contexts/ChatContext';
import { useChat } from '../hooks/useChat';
import { useNotifications } from '../hooks/useNotifications';
import type { ChatWithDetails } from '../types/chat.types';

interface ChatListProps {
    onChatSelect: (chatId: string) => void;
    selectedChatId?: string | null;
    className?: string;
}

export const ChatList: React.FC<ChatListProps> = ({
    onChatSelect,
    selectedChatId,
    className = ''
}) => {
    const { currentUserId } = useChatContext();
    const { chats, loadUserChats, loading } = useChat(currentUserId);
    const { notifications } = useNotifications();
    const [chatsWithDetails, setChatsWithDetails] = useState<ChatWithDetails[]>([]);

    // Load chats when user is available
    useEffect(() => {
        if (currentUserId) {
            loadUserChats(currentUserId);
        }
    }, [currentUserId, loadUserChats]);
    console.log(currentUserId);
    // Enrich chats with details (unread count, other participant info)
    useEffect(() => {
        const enrichChats = async () => {
            const enriched = chats.map((chat) => {
                // Calculate unread messages for this chat
                const unreadForChat = notifications.filter(n => n.chatId === chat.id).length;

                // Determine other participant
                const isUserSeller = chat.sellerId === currentUserId;
                const otherParticipantId = isUserSeller ? chat.buyerId : chat.sellerId;

                return {
                    ...chat,
                    unreadCount: unreadForChat,
                    otherParticipant: {
                        id: otherParticipantId,
                        name: `User ${otherParticipantId.substring(0, 8)}...`,
                        avatarUrl: undefined
                    }
                } as ChatWithDetails;
            });

            // Sort by creation date (newest first)
            enriched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setChatsWithDetails(enriched);
        };

        enrichChats();
    }, [chats, notifications, currentUserId]);

    if (loading) {
        return (
            <div className={`chat-list loading ${className}`}>
                <div className="loading-state">
                    <div className="loading-spinner">⏳</div>
                    <p>Loading chats...</p>
                </div>
            </div>
        );
    }

    if (chats.length === 0) {
        return (
            <div className={`chat-list empty ${className}`}>
                <div className="empty-state">
                    <div className="empty-icon">💬</div>
                    <h3>No chats yet</h3>
                    <p>Start a conversation with a seller</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`chat-list ${className}`}>
            <div className="chat-list-header">
                <h2>Chats ({chats.length})</h2>
            </div>

            <div className="chat-list-items">
                {chatsWithDetails.map((chat) => (
                    <ChatListItem
                        key={chat.id}
                        chat={chat}
                        isSelected={chat.id === selectedChatId}
                        onClick={() => onChatSelect(chat.id)}
                    />
                ))}
            </div>
        </div>
    );
};

interface ChatListItemProps {
    chat: ChatWithDetails;
    isSelected: boolean;
    onClick: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, isSelected, onClick }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays === 2) {
            return '2 days ago';
        } else if (diffDays <= 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div
            className={`chat-list-item ${isSelected ? 'selected' : ''} ${chat.unreadCount > 0 ? 'unread' : ''}`}
            onClick={onClick}
        >
            <div className="chat-avatar">
                {chat.otherParticipant?.avatarUrl ? (
                    <img
                        src={chat.otherParticipant.avatarUrl}
                        alt={chat.otherParticipant.name}
                        className="avatar-image"
                    />
                ) : (
                    <div className="avatar-placeholder">
                        {chat.otherParticipant?.name?.charAt(0) || '?'}
                    </div>
                )}
            </div>

            <div className="chat-content">
                <div className="chat-header">
                    <h4 className="chat-title">
                        {chat.otherParticipant?.name || 'Unknown User'}
                    </h4>
                    <span className="chat-date">
                        {formatDate(chat.createdAt)}
                    </span>
                </div>

                <div className="chat-preview">
                    <span className="product-info">
                        Product: {chat.productId.substring(0, 8)}...
                    </span>
                    {chat.lastMessage && (
                        <p className="last-message">
                            {chat.lastMessage.body}
                        </p>
                    )}
                </div>
            </div>

            {chat.unreadCount > 0 && (
                <div className="unread-indicator">
                    <span className="unread-count">{chat.unreadCount}</span>
                </div>
            )}
        </div>
    );
};