import React from 'react';
import { Button, Space, Divider, Tooltip, Badge } from 'antd';
import {
    FilterOutlined,
    ReloadOutlined,
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import type { FeedbackHeaderProps } from '../types/feedback';

export const FeedbackHeader: React.FC<FeedbackHeaderProps> = ({
    total,
    filtered,
    selectedCount,
    autoRefresh,
    loading,
    onAutoRefreshToggle,
    onBulkApprove,
    onBulkReject,
    onBulkDelete,
    onExport,
    onToggleFilters,
    showFilters
}) => {
    return (
        <div className="feedback-header">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold mb-1">Модерація відгуків</h1>
                            <p className="text-white/80">Управління відгуками користувачів</p>
                        </div>
                    </div>

                    <Divider type="vertical" className="border-white/30 h-16" />

                    <div className="grid grid-cols-2 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold mb-1">{total}</div>
                            <div className="text-white/80 text-sm">Всього відгуків</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold mb-1">{filtered}</div>
                            <div className="text-white/80 text-sm">Показано</div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Space size="middle">
                        <Button
                            type="default"
                            icon={<FilterOutlined />}
                            onClick={onToggleFilters}
                            className={`${showFilters
                                    ? 'bg-white text-purple-600 border-white'
                                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                                }`}
                        >
                            {showFilters ? 'Сховати фільтри' : 'Показати фільтри'}
                        </Button>

                        <Tooltip title={`Автооновлення ${autoRefresh ? 'увімкнено' : 'вимкнено'}`}>
                            <Button
                                type="default"
                                icon={<ReloadOutlined spin={loading} />}
                                onClick={onAutoRefreshToggle}
                                className={`${autoRefresh
                                        ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                                        : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                                    }`}
                            >
                                {autoRefresh ? 'Авто' : 'Ручне'}
                            </Button>
                        </Tooltip>

                        <Button
                            type="default"
                            icon={<DownloadOutlined />}
                            onClick={onExport}
                            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                        >
                            Експорт
                        </Button>
                    </Space>
                </div>
            </div>

            {/* Панель масових операцій */}
            {selectedCount > 0 && (
                <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Badge count={selectedCount} className="bg-white text-purple-600">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                    <CheckOutlined className="text-white" />
                                </div>
                            </Badge>
                            <span className="text-white font-medium">
                                Обрано {selectedCount} відгуків
                            </span>
                        </div>

                        <Space>
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={onBulkApprove}
                                className="bg-green-600 border-green-600 hover:bg-green-700"
                            >
                                Схвалити всі
                            </Button>
                            <Button
                                danger
                                icon={<CloseOutlined />}
                                onClick={onBulkReject}
                            >
                                Відхилити всі
                            </Button>
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={onBulkDelete}
                            >
                                Видалити всі
                            </Button>
                        </Space>
                    </div>
                </div>
            )}
        </div>
    );
};
