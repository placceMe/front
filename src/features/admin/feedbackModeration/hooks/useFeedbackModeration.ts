import { useState, useEffect, useCallback, useMemo } from "react";
import { message } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useRequest } from "@shared/request/useRequest";
import type {
  FeedbackDto,
  StatusKey,
  FeedbackFilters,
} from "../types/feedback";
import { calculateAverageRating } from "../utils/feedbackUtils";

dayjs.extend(isBetween);

export const useFeedbackModeration = () => {
  const { request } = useRequest();
  const [all, setAll] = useState<FeedbackDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Фільтри
  const [filters, setFilters] = useState<FeedbackFilters>({
    search: "",
    status: [],
    productId: undefined,
    userId: undefined,
    createdRange: null,
    minAvg: undefined,
    maxAvg: undefined,
  });

  // Завантаження даних
  const loadFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await request<FeedbackDto[]>(
        "/api/products/feedback/status/New"
      );

      if (data) {
        const feedbacksWithAvg = data.map((f: FeedbackDto) => ({
          ...f,
          ratingAverage: calculateAverageRating(f),
        }));
        setAll(feedbacksWithAvg);
      }
    } catch (error) {
      message.error("Помилка завантаження відгуків");
      console.error("Load feedbacks error:", error);
    } finally {
      setLoading(false);
    }
  }, [request]);

  // Зміна статусу одного відгуку
  const updateFeedbackStatus = useCallback(
    async (id: string, status: StatusKey) => {
      try {
        await request(`/api/products/feedback/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });

        setAll((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
        message.success("Статус відгуку оновлено");
      } catch (error) {
        message.error("Помилка оновлення статусу");
        console.error("Update status error:", error);
      }
    },
    [request]
  );

  // Видалення одного відгуку
  const deleteFeedback = useCallback(
    async (id: string) => {
      try {
        await request(`/api/feedback/${id}`, {
          method: "DELETE",
        });

        setAll((prev) => prev.filter((f) => f.id !== id));
        message.success("Відгук видалено");
      } catch (error) {
        message.error("Помилка видалення відгуку");
        console.error("Delete feedback error:", error);
      }
    },
    [request]
  );

  // Масова зміна статусу
  const bulkStatusUpdate = useCallback(
    async (ids: string[], status: StatusKey) => {
      if (!ids.length) return;

      try {
        const promises = ids.map((id) =>
          request(`/api/feedback/${id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          })
        );

        await Promise.all(promises);

        setAll((prev) =>
          prev.map((f) => (ids.includes(f.id) ? { ...f, status } : f))
        );

        message.success(`Оновлено статус для ${ids.length} відгуків`);
        setSelectedRows([]);
      } catch (error) {
        message.error("Помилка масового оновлення статусів");
        console.error("Bulk status update error:", error);
      }
    },
    [request]
  );

  // Масове видалення
  const bulkDelete = useCallback(
    async (ids: string[]) => {
      if (!ids.length) return;

      try {
        const promises = ids.map((id) =>
          request(`/api/feedback/${id}`, { method: "DELETE" })
        );

        await Promise.all(promises);

        setAll((prev) => prev.filter((f) => !ids.includes(f.id)));
        message.success(`Видалено ${ids.length} відгуків`);
        setSelectedRows([]);
      } catch (error) {
        message.error("Помилка масового видалення");
        console.error("Bulk delete error:", error);
      }
    },
    [request]
  );

  // Фільтрування даних
  const filteredFeedbacks = useMemo(() => {
    return all.filter((feedback) => {
      // Пошук по тексту
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchableText = [
          feedback.content,
          feedback.productName,
          `${feedback.user?.name || ""} ${feedback.user?.surname || ""}`.trim(),
          feedback.userId,
          feedback.productId,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(searchLower)) return false;
      }

      // Фільтр по статусу
      if (
        filters.status.length > 0 &&
        !filters.status.includes(feedback.status)
      ) {
        return false;
      }

      // Фільтр по товару
      if (filters.productId && feedback.productId !== filters.productId) {
        return false;
      }

      // Фільтр по користувачу
      if (filters.userId && feedback.userId !== filters.userId) {
        return false;
      }

      // Фільтр по даті
      if (filters.createdRange) {
        const feedbackDate = dayjs(feedback.createdAt);
        const [startDate, endDate] = filters.createdRange;
        if (!feedbackDate.isBetween(startDate, endDate, "day", "[]")) {
          return false;
        }
      }

      // Фільтр по рейтингу
      const avgRating =
        feedback.ratingAverage || calculateAverageRating(feedback);
      if (filters.minAvg !== undefined && avgRating < filters.minAvg) {
        return false;
      }
      if (filters.maxAvg !== undefined && avgRating > filters.maxAvg) {
        return false;
      }

      return true;
    });
  }, [all, filters]);

  // Пагінація
  const paginatedFeedbacks = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredFeedbacks.slice(start, start + pageSize);
  }, [filteredFeedbacks, page, pageSize]);

  // Автооновлення
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadFeedbacks();
    }, 30000); // Оновлення кожні 30 секунд

    return () => clearInterval(interval);
  }, [autoRefresh, loadFeedbacks]);

  // Первинне завантаження
  useEffect(() => {
    loadFeedbacks();
  }, []);

  // Скидання фільтрів
  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      status: [],
      productId: undefined,
      userId: undefined,
      createdRange: null,
      minAvg: undefined,
      maxAvg: undefined,
    });
    setPage(1);
  }, []);

  // Оновлення фільтрів
  const updateFilters = useCallback((newFilters: Partial<FeedbackFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Скидаємо на першу сторінку при зміні фільтрів
  }, []);

  return {
    // Дані
    all,
    filteredFeedbacks,
    paginatedFeedbacks,
    loading,

    // Пагінація
    page,
    pageSize,
    setPage,
    setPageSize,

    // Фільтри
    filters,
    updateFilters,
    resetFilters,

    // Вибрані рядки
    selectedRows,
    setSelectedRows,

    // Дії
    loadFeedbacks,
    updateFeedbackStatus,
    deleteFeedback,
    bulkStatusUpdate,
    bulkDelete,

    // Автооновлення
    autoRefresh,
    setAutoRefresh,
  };
};
