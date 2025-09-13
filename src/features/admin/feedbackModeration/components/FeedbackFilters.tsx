import React from 'react';
import { Card, Row, Col, Input, Select, DatePicker, InputNumber, Button } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import type { FeedbackFiltersProps } from '../types/feedback';

const { RangePicker } = DatePicker;
const { Option } = Select;

export const FeedbackFilters: React.FC<FeedbackFiltersProps> = ({
    filters,
    onFiltersChange,
    onReset,
    productOptions,
    userOptions,
    visible
}) => {
    if (!visible) return null;

    return (
        <Card
            className="feedback-filters"
            title={
                <div className="flex items-center gap-2">
                    <FilterOutlined className="text-blue-600" />
                    <span>Фільтри пошуку</span>
                </div>
            }
            extra={
                <Button type="link" onClick={onReset} className="text-gray-500">
                    Очистити всі
                </Button>
            }
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            <SearchOutlined className="mr-1" />
                            Пошук
                        </label>
                        <Input
                            placeholder="Контент, товар, користувач..."
                            value={filters.search}
                            onChange={(e) => onFiltersChange({ search: e.target.value })}
                            allowClear
                            prefix={<SearchOutlined className="text-gray-400" />}
                        />
                    </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Статуси
                        </label>
                        <Select
                            mode="multiple"
                            placeholder="Оберіть статуси..."
                            value={filters.status}
                            onChange={(value) => onFiltersChange({ status: value })}
                            allowClear
                            className="w-full"
                        >
                            <Option value="pending">
                                <span className="flex items-center">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                                    На розгляді
                                </span>
                            </Option>
                            <Option value="approved">
                                <span className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                    Схвалено
                                </span>
                            </Option>
                            <Option value="rejected">
                                <span className="flex items-center">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                                    Відхилено
                                </span>
                            </Option>
                        </Select>
                    </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            Товар
                        </label>
                        <Select
                            showSearch
                            placeholder="Фільтр по товару..."
                            value={filters.productId}
                            onChange={(value) => onFiltersChange({ productId: value })}
                            allowClear
                            options={productOptions}
                            filterOption={(input, option) =>
                                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                            }
                            className="w-full"
                        />
                    </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Користувач
                        </label>
                        <Select
                            showSearch
                            placeholder="Фільтр по користувачу..."
                            value={filters.userId}
                            onChange={(value) => onFiltersChange({ userId: value })}
                            allowClear
                            options={userOptions}
                            filterOption={(input, option) =>
                                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                            }
                            className="w-full"
                        />
                    </div>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Період
                        </label>
                        <RangePicker
                            value={filters.createdRange}
                            onChange={(dates) => onFiltersChange({ createdRange: dates as any })}
                            placeholder={['Від', 'До']}
                            format="DD.MM.YYYY"
                            className="w-full"
                        />
                    </div>
                </Col>

                <Col xs={12} sm={6} md={4}>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Мін. рейтинг
                        </label>
                        <InputNumber
                            placeholder="0.0"
                            min={0}
                            max={5}
                            step={0.1}
                            value={filters.minAvg}
                            onChange={(value) => onFiltersChange({ minAvg: value || undefined })}
                            className="w-full"
                        />
                    </div>
                </Col>

                <Col xs={12} sm={6} md={4}>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Макс. рейтинг
                        </label>
                        <InputNumber
                            placeholder="5.0"
                            min={0}
                            max={5}
                            step={0.1}
                            value={filters.maxAvg}
                            onChange={(value) => onFiltersChange({ maxAvg: value || undefined })}
                            className="w-full"
                        />
                    </div>
                </Col>
            </Row>
        </Card>
    );
};
