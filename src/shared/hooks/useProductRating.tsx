import { useProductReviews } from "@shared/hooks/useProductReviews";

export function useProductRating(productId: string) {
  const { reviews, loading } = useProductReviews(productId);

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? parseFloat(
          (
            reviews.reduce((sum, r) => sum + r.ratingAverage, 0) / totalReviews
          ).toFixed(1)
        )
      : null;

  return { reviews, totalReviews, averageRating, loading };
}
