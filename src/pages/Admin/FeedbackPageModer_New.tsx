import React from 'react';
import { FeedbackModerationPage } from '../../features/admin/feedbackModeration';

/**
 * @deprecated Використовуйте FeedbackModerationPage з features/admin/feedbackModeration
 * Цей компонент залишається для зворотної сумісності
 */
const FeedbackPageModer: React.FC = () => {
    return <FeedbackModerationPage />;
};

export default FeedbackPageModer;
