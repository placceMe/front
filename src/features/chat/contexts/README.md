# Chat Contexts Architecture

Структура чат контекстів розділена на кілька рівнів для кращої організації та керування станом.

## Ієрархія контекстів

```
SignalRProvider
└── CurrentUserProvider
    └── ChatsProvider
        └── NotificationsProvider
            └── ChatOperationsProvider
```

## Рівні контекстів

### 1. SignalRContext (signalr/)

**Базовий рівень** - керує підключенням до SignalR

- `connection` - об'єкт підключення
- `isConnected` - статус підключення
- `isConnecting` - статус процесу підключення
- `startConnection()` - запуск підключення
- `stopConnection()` - зупинка підключення

### 2. CurrentUserContext (user/)

**Керування поточним користувачем**

- `currentUserId` - ID поточного користувача
- `setCurrentUserId()` - встановлення користувача
- Автоматично запускає SignalR підключення при зміні користувача

### 3. ChatsContext (chats/)

**Керування чатами**

- `chats` - список чатів користувача
- `loadUserChats()` - завантаження чатів
- `createChat()` - створення нового чату

### 4. NotificationsContext (notifications/)

**Сповіщення**

- `notifications` - список сповіщень
- `unreadCount` - кількість непрочитаних
- `addNotification()` - додавання сповіщення
- `markAsRead()` - позначення як прочитане
- Обробляє SignalR події для сповіщень

### 5. ChatOperationsContext (operations/)

**Операції чату**

- `joinChat()` - приєднання до чату
- `leaveChat()` - покидання чату
- `subscribeToNotifications()` - підписка на сповіщення
- Автоматично підписується на сповіщення користувача

## Використання

### Базове використання окремих контекстів:

```tsx
import { useSignalRContext } from "@features/chat/contexts";
import { useCurrentUserContext } from "@features/chat/contexts";
import { useChatsContext } from "@features/chat/contexts";

const MyComponent = () => {
  const { isConnected } = useSignalRContext();
  const { currentUserId } = useCurrentUserContext();
  const { chats } = useChatsContext();

  // ...
};
```

### Використання композитного хука:

```tsx
import { useChatContext } from "@features/chat/contexts";

const MyComponent = () => {
  const { isConnected, currentUserId, chats, notifications, joinChat } =
    useChatContext();

  // Маєте доступ до всіх функцій одразу
};
```

### Обгортання додатку:

```tsx
import { ChatProvider } from "@features/chat/contexts";

const App = () => {
  return (
    <ChatProvider signalRUrl="/hubs/chat">
      <YourAppContent />
    </ChatProvider>
  );
};
```

## Переваги нової структури

1. **Розділення відповідальності** - кожен контекст відповідає за свою область
2. **Простота тестування** - можна тестувати кожен рівень окремо
3. **Гнучкість** - можна використовувати тільки потрібні рівні
4. **Зменшення ре-рендерів** - зміни в одному контексті не впливають на інші
5. **Кращий TypeScript** - чіткі типи для кожного рівня
6. **Зворотна сумісність** - композитний хук забезпечує той же API
