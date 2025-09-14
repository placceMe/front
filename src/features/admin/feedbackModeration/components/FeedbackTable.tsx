import React from 'react';
import { Table, Button, Tag, Rate, Avatar, Dropdown, Space } from 'antd';
import type { Key } from 'antd/es/table/interface';
import {
    EyeOutlined,
    DeleteOutlined,
    CheckOutlined,
    CloseOutlined,
    MoreOutlined,
    UserOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { FeedbackTableProps, FeedbackDto, StatusKey } from '../types/feedback';
import { fmtDate, getRelativeTime, truncateText } from '../utils/feedbackUtils';
import dayjs from 'dayjs';

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

export const FeedbackTable: React.FC<FeedbackTableProps> = ({
    data,
    loading,
    selectedRows,
    onRowSelectionChange,
    onStatusChange,
    onDelete,
    onView,
    page,
    pageSize,
    total,
    onPageChange
}) => {
    const rowSelection = {
        selectedRowKeys: selectedRows,
        onChange: (selectedRowKeys: React.Key[]) => {
            onRowSelectionChange(selectedRowKeys as string[]);
        },
        getCheckboxProps: (record: FeedbackDto) => ({
            disabled: false,
            name: record.id,
        }),
    };

    const getActionMenuItems = (record: FeedbackDto) => [
        {
            key: 'view',
            icon: <EyeOutlined />,
            label: 'Переглянути',
            onClick: () => onView(record),
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'approve',
            icon: <CheckOutlined />,
            label: 'Схвалити',
            disabled: record.status === 'approved',
            onClick: () => onStatusChange(record.id, 'approved'),
        },
        {
            key: 'reject',
            icon: <CloseOutlined />,
            label: 'Відхилити',
            disabled: record.status === 'rejected',
            onClick: () => onStatusChange(record.id, 'rejected'),
        },
        {
            key: 'pending',
            icon: <ClockCircleOutlined />,
            label: 'На розгляд',
            disabled: record.status === 'pending',
            onClick: () => onStatusChange(record.id, 'pending'),
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Видалити',
            danger: true,
            onClick: () => onDelete(record.id),
        },
    ];

    const columns: ColumnsType<FeedbackDto> = [
        {
            title: 'Дата',
            dataIndex: 'createdAt',
            width: 140,
            sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
            render: (date: string) => (
                <div className="text-xs">
                    <div className="font-medium">{fmtDate(date)}</div>
                    <div className="text-gray-500">{getRelativeTime(date)}</div>
                </div>
            ),
        },
        {
            title: 'Користувач',
            key: 'user',
            width: 200,
            render: (_, record) => {
                const userName = `${record.user?.name || ''} ${record.user?.surname || ''}`.trim() || record.userId;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar
                            size="small"
                            src={record.user?.avatar}
                            icon={<UserOutlined />}
                            className="flex-shrink-0"
                        />
                        <div className="min-w-0">
                            <div className="font-medium text-sm truncate">{userName}</div>
                            <div className="text-xs text-gray-500 truncate">ID: {record.userId.slice(0, 8)}...</div>
                        </div>
                    </div>
                );
            },
            sorter: (a, b) => {
                const nameA = `${a.user?.name || ''} ${a.user?.surname || ''}`.trim() || a.userId;
                const nameB = `${b.user?.name || ''} ${b.user?.surname || ''}`.trim() || b.userId;
                return nameA.localeCompare(nameB);
            },
        },
        {
            title: 'Товар',
            key: 'product',
            width: 220,
            render: (_, record) => (
                <div>
                    <div className="font-medium text-sm max-w-[200px] truncate">
                        {record.productName || record.productId}
                    </div>
                    <div className="text-xs text-gray-500">ID: {record.productId.slice(0, 8)}...</div>
                </div>
            ),
            sorter: (a, b) => (a.productName || a.productId).localeCompare(b.productName || b.productId),
        },
        {
            title: 'Рейтинг',
            key: 'rating',
            width: 140,
            render: (_, record) => {
                const avgRating = record.ratingAverage ||
                    (record.ratingService + record.ratingSpeed + record.ratingDescription + record.ratingAvailable) / 4;

                return (
                    <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600 mb-1">
                            {avgRating.toFixed(1)}
                        </div>
                        <Rate disabled allowHalf value={avgRating} className="text-xs mb-1" />
                        <div className="text-xs text-gray-500 grid grid-cols-2 gap-1">
                            <span title="Сервіс">С: {record.ratingService}</span>
                            <span title="Швидкість">Ш: {record.ratingSpeed}</span>
                            <span title="Опис">О: {record.ratingDescription}</span>
                            <span title="Наявність">Н: {record.ratingAvailable}</span>
                        </div>
                    </div>
                );
            },
            sorter: (a, b) => {
                const avgA = a.ratingAverage || (a.ratingService + a.ratingSpeed + a.ratingDescription + a.ratingAvailable) / 4;
                const avgB = b.ratingAverage || (b.ratingService + b.ratingSpeed + b.ratingDescription + b.ratingAvailable) / 4;
                return avgA - avgB;
            },
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            width: 120,
            render: (status: StatusKey) => (
                <Tag
                    icon={STATUS_ICONS[status]}
                    color={STATUS_COLORS[status]}
                    className={status === 'pending' ? 'status-new' : ''}
                >
                    {STATUS_LABELS[status]}
                </Tag>
            ),
            sorter: (a, b) => a.status.localeCompare(b.status),
            filters: [
                { text: 'На розгляді', value: 'pending' },
                { text: 'Схвалено', value: 'approved' },
                { text: 'Відхилено', value: 'rejected' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Контент',
            dataIndex: 'content',
            width: 300,
            render: (content: string) => (
                <div className="content-preview">
                    <div className="text-sm leading-relaxed">
                        {truncateText(content, 150)}
                    </div>
                </div>
            ),
        },
        {
            title: 'Дії',
            key: 'actions',
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => onView(record)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Переглянути"
                    />

                    <Dropdown
                        menu={{
                            items: getActionMenuItems(record)
                        }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Button
                            type="text"
                            icon={<MoreOutlined />}
                            className="text-gray-600 hover:text-gray-700"
                            title="Більше дій"
                        />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    return (
        <div className="feedback-table-container">
            <Table<FeedbackDto>
                rowKey="id"
                columns={columns}
                dataSource={data}
                loading={loading}
                rowSelection={rowSelection}
                scroll={{ x: 1400 }}
                size="middle"
                className="feedback-table"
                pagination={{
                    current: page,
                    pageSize,
                    total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => (
                        <div className="flex items-center justify-between w-full">
                            <div className="text-gray-600 font-medium">
                                Показано <span className="text-blue-600 font-bold">{range[0]}-{range[1]}</span> з{' '}
                                <span className="text-gray-800 font-bold">{total}</span> записів
                            </div>
                            <div className="text-gray-500 text-sm">
                                Оновлено: {dayjs().format('HH:mm:ss')}
                            </div>
                        </div>
                    ),
                    onChange: onPageChange,
                    pageSizeOptions: ['10', '25', '50', '100'],
                    className: 'px-6 py-4 bg-gray-50 border-t border-gray-200',
                }}
                locale={{
                    emptyText: (
                        <div className="py-12 text-center">
                            <div className="mb-4">
                                <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="text-gray-500 text-lg font-medium mb-2">Відгуків не знайдено</div>
                            <div className="text-gray-400">Спробуйте змінити критерії пошуку або очистити фільтри</div>
                        </div>
                    ),
                }}
            />
        </div>
    );
};
