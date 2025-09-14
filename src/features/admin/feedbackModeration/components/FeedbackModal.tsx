import React from 'react';
import { Modal, Card, Row, Col, Rate, Tag, Button, Space, Avatar } from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    ShopOutlined,
    StarOutlined,
    CheckOutlined,
    CloseOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import type { FeedbackModalProps, StatusKey } from '../types/feedback';
import { fmtDate, getRelativeTime } from '../utils/feedbackUtils';

const STATUS_ICONS = {
    pending: <ClockCircleOutlined />,
    approved: <CheckCircleOutlined />,
    rejected: <ExclamationCircleOutlined />
};

const STATUS_COLORS = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error'
};

const STATUS_LABELS = {
    pending: 'На розгляді',
    approved: 'Схвалено',
    rejected: 'Відхилено'
};

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
    feedback,
    visible,
    onClose,
    onStatusChange,
    onDelete
}) => {
    if (!feedback) return null;

    const avgRating = feedback.ratingAverage ||
        (feedback.ratingService + feedback.ratingSpeed + feedback.ratingDescription + feedback.ratingAvailable) / 4;

    const userName = `${feedback.user?.name || ''} ${feedback.user?.surname || ''}`.trim() || feedback.userId;

    const handleStatusChange = (status: StatusKey) => {
        onStatusChange(status);
        onClose();
    };

    const handleDelete = () => {
        onDelete();
        onClose();
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <StarOutlined className="text-blue-600" />
                    </div>
                    <div>
                        <div className="text-lg font-semibold">Деталі відгуку</div>
                        <div className="text-sm text-gray-500">ID: {feedback.id}</div>
                    </div>
                </div>
            }
            open={visible}
            onCancel={onClose}
            width={800}
            footer={
                <Space>
                    <Button onClick={onClose}>Закрити</Button>
                    <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={() => handleStatusChange('approved')}
                        disabled={feedback.status === 'approved'}
                        className="bg-green-600 border-green-600 hover:bg-green-700"
                    >
                        Схвалити
                    </Button>
                    <Button
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => handleStatusChange('rejected')}
                        disabled={feedback.status === 'rejected'}
                    >
                        Відхилити
                    </Button>
                    <Button
                        icon={<ClockCircleOutlined />}
                        onClick={() => handleStatusChange('pending')}
                        disabled={feedback.status === 'pending'}
                    >
                        На розгляд
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleDelete}
                    >
                        Видалити
                    </Button>
                </Space>
            }
            className="feedback-modal"
        >
            <div className="space-y-6">
                {/* Статус та дата */}
                <Card size="small">
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <div className="text-center">
                                <CalendarOutlined className="text-blue-500 text-xl mb-2" />
                                <div className="font-semibold">{fmtDate(feedback.createdAt)}</div>
                                <div className="text-xs text-gray-500">{getRelativeTime(feedback.createdAt)}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="text-center">
                                <Tag
                                    icon={STATUS_ICONS[feedback.status]}
                                    color={STATUS_COLORS[feedback.status]}
                                    className="text-sm px-3 py-1"
                                >
                                    {STATUS_LABELS[feedback.status]}
                                </Tag>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="text-center">
                                <StarOutlined className="text-yellow-500 text-xl mb-2" />
                                <div className="text-2xl font-bold text-yellow-600">{avgRating.toFixed(1)}</div>
                                <Rate disabled allowHalf value={avgRating} className="text-sm" />
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Інформація про користувача */}
                <Card title={
                    <div className="flex items-center gap-2">
                        <UserOutlined />
                        Користувач
                    </div>
                } size="small">
                    <div className="flex items-center gap-4">
                        <Avatar
                            size={64}
                            src={feedback.user?.avatar}
                            icon={<UserOutlined />}
                            className="flex-shrink-0"
                        />
                        <div>
                            <div className="text-lg font-semibold">{userName}</div>
                            <div className="text-gray-500">ID: {feedback.userId}</div>
                        </div>
                    </div>
                </Card>

                {/* Інформація про товар */}
                <Card title={
                    <div className="flex items-center gap-2">
                        <ShopOutlined />
                        Товар
                    </div>
                } size="small">
                    <div>
                        <div className="text-lg font-semibold mb-2">
                            {feedback.productName || feedback.productId}
                        </div>
                        <div className="text-gray-500">ID товару: {feedback.productId}</div>
                    </div>
                </Card>

                {/* Детальні рейтинги */}
                <Card title={
                    <div className="flex items-center gap-2">
                        <StarOutlined />
                        Детальні рейтинги
                    </div>
                } size="small">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-600 mb-2">Сервіс</div>
                                <div className="text-xl font-bold text-blue-600 mb-1">{feedback.ratingService}</div>
                                <Rate disabled value={feedback.ratingService} className="text-sm" />
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-600 mb-2">Швидкість</div>
                                <div className="text-xl font-bold text-green-600 mb-1">{feedback.ratingSpeed}</div>
                                <Rate disabled value={feedback.ratingSpeed} className="text-sm" />
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-600 mb-2">Опис</div>
                                <div className="text-xl font-bold text-purple-600 mb-1">{feedback.ratingDescription}</div>
                                <Rate disabled value={feedback.ratingDescription} className="text-sm" />
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-600 mb-2">Наявність</div>
                                <div className="text-xl font-bold text-orange-600 mb-1">{feedback.ratingAvailable}</div>
                                <Rate disabled value={feedback.ratingAvailable} className="text-sm" />
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Текст відгуку */}
                <Card title="Коментар" size="small">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                            {feedback.content}
                        </div>
                    </div>
                </Card>

                {/* Додаткова інформація */}
                {feedback.updatedAt && (
                    <Card title="Історія змін" size="small">
                        <div className="text-sm text-gray-600">
                            Останнє оновлення: {fmtDate(feedback.updatedAt)} ({getRelativeTime(feedback.updatedAt)})
                        </div>
                    </Card>
                )}
            </div>
        </Modal>
    );
};
