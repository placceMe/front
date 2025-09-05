export interface Chat {
  id: string;
  productId: string;
  sellerId: string;
  buyerId: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderUserId: string;
  body: string;
  createdAt: string;
}

export interface MessageNotification {
  chatId: string;
  productId: string;
  senderUserId: string;
  senderName: string;
  messagePreview: string;
  createdAt: string;
  productTitle: string;
  productImageUrl?: string;
}

export interface CreateChatRequest {
  productId: string;
  sellerId: string;
  buyerId: string;
}

export interface CreateMessageRequest {
  senderUserId: string;
  body: string;
}

export interface ChatUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface ChatSeller {
  id: string;
  companyName: string;
  description: string;
  schedule: string;
  contacts: { type: string; value: string }[];
}

export interface ChatWithDetails extends Chat {
  productTitle?: string;
  productImageUrl?: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  otherParticipant?: ChatUser;
  sellerInfo?: ChatSeller;
}
