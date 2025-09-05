# Chat Feature Installation

## Required Dependencies

Install the following packages:

```bash
npm install @microsoft/signalr
```

## Type Dependencies (if not already installed)

```bash
npm install -D @types/node
```

## Usage

```tsx
import { Chat } from "./features/chat";

function App() {
  return (
    <Chat roomId="your-room-id" activeRole="user" currentUserId="user-123" />
  );
}
```

## Features Implemented

✅ TypeScript types and interfaces
✅ SignalR connection hook
✅ Chat messages management
✅ Real-time messaging
✅ Chat window component
✅ Message input component
✅ Notification system
✅ Responsive design
✅ CSS styles

## Missing from your current implementation

The following files were created/added:

- `types/chat.types.ts` - TypeScript definitions
- `hooks/useSignalR.ts` - SignalR connection management
- `hooks/useChatMessages_new.ts` - Message operations
- `hooks/useChat.ts` - Chat management
- `hooks/useNotifications.ts` - Notification handling
- `contexts/ChatContext.tsx` - Chat context provider
- `components/ChatWindow.tsx` - Main chat component
- `utils/notifications.ts` - Browser notification utilities
- `index.ts` - Feature exports

## API Integration

Make sure your backend provides these endpoints:

- `GET /api/chats?sellerId={id}` - Get user's chats as seller
- `GET /api/chats?buyerId={id}` - Get user's chats as buyer
- `POST /api/chats` - Create new chat
- `GET /api/chats/{id}/messages` - Get chat messages
- `POST /api/chats/{id}/messages` - Send message

## SignalR Hub Methods

Your backend should support:

- `JoinChat(chatId)` - Join specific chat room
- `LeaveChat(chatId)` - Leave chat room
- `SubscribeToUserNotifications(userId)` - Subscribe to user notifications

## Events from server:

- `MessageCreated` - New message in chat
- `MessageNotification` - Notification about new message
