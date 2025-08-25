import { useRequest } from "@shared/request/useRequest";
import { useEffect, useState } from "react";

interface RecentFeedback {
  content: string;
  ratingAverage: number;
  createdAt: string;
  productName: string;
}

interface FeedbackSummary {
  productId: string;
  averageRating: number;
  totalFeedbacks: number;
  recentFeedbacks: RecentFeedback[];
}

export function useProductFeedbackSummary(productId: string) {
  const [summary, setSummary] = useState<FeedbackSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { request } = useRequest();

  useEffect(() => {
    if (!productId) return;

    setLoading(true); // 👉 начинаем загрузку

    request<FeedbackSummary>(`/api/products/Feedback/product/${productId}/summary`)
      .then((data) => {
        setSummary(data);         // 👉 сохраняем данные
      })
      .catch((err) => {
        console.error("Ошибка при получении отзыва:", err);
      })
      .finally(() => {
        setLoading(false);        // 👉 завершаем загрузку
      });
  }, [productId]);

  return { summary, loading };
}
