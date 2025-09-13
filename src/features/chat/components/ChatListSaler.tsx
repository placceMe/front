import React, { useState, useEffect } from 'react';
import { useChatContext } from '../contexts/ChatContext';
import { useChat } from '../hooks/useChat';
import { useNotifications } from '../hooks/useNotifications';
import type { ChatWithDetails } from '../types/chat.types';
import { useChatProducts } from '../hooks/useChatProducts';
import { useChatUsers } from '../hooks/useChatUsers';

interface ChatListProps {
    onChatSelect: (chatId: string) => void;
    selectedChatId?: string | null;
    className?: string;
}

export const ChatListSaler: React.FC<ChatListProps> = ({
    onChatSelect,
    selectedChatId,
    className = ''
}) => {
    const { currentUserId } = useChatContext();
    const { chats, loadUserChats, loading } = useChat(currentUserId);
    const { notifications } = useNotifications();
    const { users, loadUsersByIds, loading: usersLoading, error: usersError } = useChatUsers();
    const [chatsWithDetails, setChatsWithDetails] = useState<ChatWithDetails[]>([]);
    const { products, loadProductsByIds, loading: productsLoading, error: productsError } = useChatProducts();



    useEffect(() => {
        if (currentUserId) {
            loadUserChats(currentUserId);
        }
    }, [currentUserId, loadUserChats]);

    useEffect(() => {
        if (chats.length > 0 && currentUserId) {

            const userIds = new Set<string>();
            chats.forEach(chat => {
                if (chat.sellerId !== currentUserId) {
                    userIds.add(chat.sellerId);
                }
                if (chat.buyerId !== currentUserId) {
                    userIds.add(chat.buyerId);
                }
            });


            if (userIds.size > 0) {
                loadUsersByIds(Array.from(userIds));
            }
        }
    }, []);


    useEffect(() => {
        if (chats.length > 0) {

            const productIds = new Set<string>();
            chats.forEach(chat => {
                productIds.add(chat.productId);
            });


            if (productIds.size > 0) {
                loadProductsByIds(Array.from(productIds));
            }
        }
    }, [chats, loadProductsByIds]);


    useEffect(() => {
        const enrichChats = async () => {
            const enriched = chats.map((chat) => {

                const unreadForChat = notifications.filter(n => n.chatId === chat.id).length;


                const isUserSeller = chat.sellerId === currentUserId;
                const otherParticipantId = isUserSeller ? chat.buyerId : chat.sellerId;
                const otherParticipantUser = users[otherParticipantId];


                const product = products[chat.productId];

                return {
                    ...chat,
                    unreadCount: unreadForChat,
                    productTitle: product?.title,
                    productImageUrl: product?.mainImageUrl,
                    otherParticipant: otherParticipantUser ? {
                        id: otherParticipantUser.id,
                        name: `${otherParticipantUser.name} ${otherParticipantUser.surname}`,
                        avatarUrl: otherParticipantUser.avatarUrl
                    } : {
                        id: otherParticipantId,
                        name: `User ${otherParticipantId.substring(0, 8)}...`,
                        avatarUrl: undefined
                    }
                } as ChatWithDetails;
            });


            enriched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setChatsWithDetails(enriched);
        };

        enrichChats();
    }, [chats, notifications, currentUserId, users, products]);

    if (loading || usersLoading || productsLoading) {
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
    <div className={`chat-list ${className}`}>
      {/* заголовок слева можно не показывать — по желанию */}
      {/* <div className="chat-list-header"><h2>Chats (0)</h2></div> */}

      <div className="chat-list-items">
        <div className="chat-empty-card" role="status" aria-live="polite">
          <div className="empty-icon" aria-hidden></div>
          <div className="empty-texts">
            <h3 className="empty-title">Немає чатів</h3>
            <p className="empty-subtitle">Почніть переписку з продавцем</p>
          </div>
        </div>
      </div>
    </div>
  );
}


    console.log("Chats loaded:", chatsWithDetails);

    return (
        <div className={`chat-list ${className}`}>
            

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
                        Product: {chat.productTitle || chat.productId.substring(0, 8) + '...'}
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