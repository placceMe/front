import React, { useState } from 'react';
import { useChatMessages } from '../hooks/useChatMessages';
import { useChatContext } from '../contexts/ChatContext';

interface MessageInputProps {
    chatId: string;
    disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ chatId, disabled }) => {
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
                disabled={disabled || sending}
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