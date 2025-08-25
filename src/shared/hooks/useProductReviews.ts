// hooks/useProductReviews.ts
/*import { useEffect, useState } from 'react';

export interface Review {
  id: string;
  content: string;
  ratingAverage: number;
  createdAt: string;
  userId: string;
  productId: string;
  productName: string;
  user: {
    id: string,
    name: string,
    surname: string
  }
}

export const useProductReviews = (productId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/products/feedback/product/${productId}`);

        if (!res.ok) {
          const text = await res.text();
          console.error("Ошибка загрузки отзывов:", res.status, text);
          setReviews([]);
          return;
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          console.warn("Полученные данные не массив:", data);
          setReviews([]);
          return;
        }

        const parsed = data.filter(
          (item: any): item is Review =>
            typeof item.ratingAverage === 'number' &&
            (item.content || item.comment)
        );

        setReviews(parsed);
      } catch (err) {
        console.error("Ошибка загрузки отзывов:", err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  return { reviews, loading };
};
*/


import { useEffect, useState } from 'react';
import { useRequest } from '@shared/request/useRequest';

export interface Review {
  id: string;
  content: string;
  ratingAverage: number;
  createdAt: string;
  userId: string;
  productId: string;
  productName: string;
  user: {
    id: string,
    name: string,
    surname: string
  }
}

export const useProductReviews = (productId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { request } = useRequest();

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const data = await request<Review[]>(`/api/products/feedback/product/${productId}`);
      if (Array.isArray(data)) {
        setReviews(data);
      } else {
        console.warn('Bad review data:', data);
        setReviews([]);
      }
      setLoading(false);
    };

    if (productId) fetchReviews();
  }, [productId]);

  return { reviews, loading };
};
