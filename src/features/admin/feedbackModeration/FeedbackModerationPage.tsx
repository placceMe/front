import React, { useState, useMemo } from 'react';
import { Alert, message } from 'antd';
import { FeedbackHeader } from './components/FeedbackHeader';
import { FeedbackFilters } from './components/FeedbackFilters';
import { FeedbackTable } from './components/FeedbackTable';
import { FeedbackModal } from './components/FeedbackModal';
import { useFeedbackModeration } from './hooks/useFeedbackModeration';
import { exportToCSV } from './utils/feedbackUtils';
import type { FeedbackDto } from './types/feedback';
import './styles/feedbackModeration.css';

export const FeedbackModerationPage: React.FC = () => {
    const {
        all,
        filteredFeedbacks,
        paginatedFeedbacks,
        loading,
        page,
        pageSize,
        setPage,
        setPageSize,
        filters,
        updateFilters,
        resetFilters,
        selectedRows,
        setSelectedRows,
        updateFeedbackStatus,
        deleteFeedback,
        bulkStatusUpdate,
        bulkDelete,
        autoRefresh,
        setAutoRefresh
    } = useFeedbackModeration();

    const [showFilters, setShowFilters] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<FeedbackDto | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Опції для фільтрів
    const productOptions = useMemo(() => {
        const products = Array.from(
            new Map(
                all
                    .filter(f => f.productName || f.productId)
                    .map(f => [f.productId, { label: f.productName || f.productId, value: f.productId }])
            ).values()
        );
        return products.sort((a, b) => a.label.localeCompare(b.label));
    }, [all]);

    const userOptions = useMemo(() => {
        const users = Array.from(
            new Map(
                all
                    .filter(f => f.user?.name || f.user?.surname || f.userId)
                    .map(f => {
                        const userName = `${f.user?.name || ''} ${f.user?.surname || ''}`.trim() || f.userId;
                        return [f.userId, { label: userName, value: f.userId }];
                    })
            ).values()
        );
        return users.sort((a, b) => a.label.localeCompare(b.label));
    }, [all]);

    // Обробники подій
    const handleRowSelectionChange = (selectedRowKeys: string[]) => {
        setSelectedRows(selectedRowKeys);
    };

    const handleView = (feedback: FeedbackDto) => {
        setSelectedFeedback(feedback);
        setModalVisible(true);
    };

    const handleStatusChange = async (id: string, status: any) => {
        await updateFeedbackStatus(id, status);
    };

    const handleDelete = async (id: string) => {
        await deleteFeedback(id);
        // Очистити вибрані рядки якщо видалений рядок був обраний
        setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    };

    const handleBulkApprove = async () => {
        if (selectedRows.length === 0) {
            message.warning('Оберіть відгуки для схвалення');
            return;
        }
        await bulkStatusUpdate(selectedRows, 'Approved');
    };

    const handleBulkReject = async () => {
        if (selectedRows.length === 0) {
            message.warning('Оберіть відгуки для відхилення');
            return;
        }
        await bulkStatusUpdate(selectedRows, 'Rejected');
    };

    const handleBulkDelete = async () => {
        if (selectedRows.length === 0) {
            message.warning('Оберіть відгуки для видалення');
            return;
        }
        await bulkDelete(selectedRows);
    };

    const handleExport = () => {
        if (filteredFeedbacks.length === 0) {
            message.warning('Немає даних для експорту');
            return;
        }
        exportToCSV(filteredFeedbacks);
        message.success('Дані експортовано до CSV файлу');
    };

    const handlePageChange = (newPage: number, newPageSize?: number) => {
        setPage(newPage);
        if (newPageSize && newPageSize !== pageSize) {
            setPageSize(newPageSize);
            setPage(1); // Скидаємо на першу сторінку при зміні розміру
        }
    };

    const handleModalStatusChange = (status: any) => {
        if (selectedFeedback) {
            updateFeedbackStatus(selectedFeedback.id, status);
        }
    };

    const handleModalDelete = () => {
        if (selectedFeedback) {
            deleteFeedback(selectedFeedback.id);
        }
    };

    return (
        <div className="feedback-moderation">
            {/* Заголовок */}
            <FeedbackHeader
                total={all.length}
                filtered={filteredFeedbacks.length}
                selectedCount={selectedRows.length}
                autoRefresh={autoRefresh}
                loading={loading}
                onAutoRefreshToggle={() => setAutoRefresh(!autoRefresh)}
                onBulkApprove={handleBulkApprove}
                onBulkReject={handleBulkReject}
                onBulkDelete={handleBulkDelete}
                onExport={handleExport}
                onToggleFilters={() => setShowFilters(!showFilters)}
                showFilters={showFilters}
            />

            {/* Фільтри */}
            <FeedbackFilters
                filters={filters}
                onFiltersChange={updateFilters}
                onReset={resetFilters}
                productOptions={productOptions}
                userOptions={userOptions}
                visible={showFilters}
            />

            {/* Результати фільтрування */}
            {filteredFeedbacks.length !== all.length && (
                <Alert
                    message={
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">
                                Знайдено <span className="text-blue-600 font-bold">{filteredFeedbacks.length}</span> з{' '}
                                <span className="font-bold">{all.length}</span> відгуків за заданими критеріями
                            </span>
                        </div>
                    }
                    type="info"
                    className="mb-6 border-blue-200 bg-blue-50"
                    showIcon={false}
                    closable
                />
            )}

            {/* Таблиця */}
            <FeedbackTable
                data={paginatedFeedbacks}
                loading={loading}
                selectedRows={selectedRows}
                onRowSelectionChange={handleRowSelectionChange}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onView={handleView}
                page={page}
                pageSize={pageSize}
                total={filteredFeedbacks.length}
                onPageChange={handlePageChange}
            />

            {/* Модальне вікно деталей */}
            <FeedbackModal
                feedback={selectedFeedback}
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedFeedback(null);
                }}
                onStatusChange={handleModalStatusChange}
                onDelete={handleModalDelete}
            />
        </div>
    );
};

export default FeedbackModerationPage;
