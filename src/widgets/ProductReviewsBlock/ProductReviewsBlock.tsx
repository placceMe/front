
import { FaStar } from "react-icons/fa";
import { Button, Typography, Spin } from "antd";
import StarIcon from '../../assets/icons/star_yellow.svg?react';
import { useProductRating } from "@shared/hooks/useProductRating";

type Props = {
  productId: string;
  showAll?: boolean;
  onShowAllClick?: () => void;
};

export const ProductReviewsBlock: React.FC<Props> = ({ productId, showAll = true, onShowAllClick }) => {
  const { reviews, averageRating, totalReviews, loading } = useProductRating(productId);

  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => Math.round(r.ratingAverage) === star).length
  );

  if (loading) return <Spin />;

  return (
    <div>
      <h2 className="text-[1.8rem] font-bold flex items-center mb-6 text-[#0E120A]">
        <FaStar className="mr-2 text-[#454E30]" /> Відгуки
      </h2>

      <div className="grid md:grid-cols-[350px_1fr] gap-8">
        {/* Сводка по оценкам */}
        <div>
          <div className="mb-4">
            <div className="text-base flex font-semibold mb-3 gap-1">
              Оцінка користувачів {averageRating ? `${averageRating}/5` : "—"} <StarIcon />
            </div>
            <div className="text-base text-gray-600">на основі {totalReviews} відгуків</div>
          </div>

          <div className="space-y-2 mb-6">
            {[5, 4, 3, 2, 1].map((star, index) => {
              const count = ratingCounts[index];
              const percent = totalReviews ? (count / totalReviews) * 100 : 0;

              return (
                <div className="flex items-center gap-3" key={star}>
                  <span className="text-sm font-medium w-4">{star}</span>
                  <StarIcon />
                  <div className="w-48 h-2 bg-[#7C7878] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        count > 0 ? "bg-[#E4A800]" : "bg-[#7C7878]"
                      }`}
                      style={{
                        width: percent ? `${percent}%` : "0%",
                        minWidth: count > 0 ? "10px" : "0",
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-4">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Отзывы */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            <>
              {(showAll ? reviews : reviews.slice(0, 3)).map((review, i) => (
                <div
                  key={i}
                  className="border border-[#3E4826] rounded-lg p-4"
                  style={{ background: 'rgba(229, 229, 216, 0.8)' }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center font-semibold mb-2 text-[#3E4826] font-montserrat">
                      <span className="mr-5">
                        {review.user?.name && review.user?.surname
                          ? `${review.user.name} ${review.user.surname}`
                          : "Анонім"}
                      </span>
                      <div className="flex gap-0.5">
                        {[...Array(Math.round(review.ratingAverage))].map((_, idx) => (
                          <StarIcon key={idx} />
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-[#3E4826]">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Typography.Paragraph>{review.content || "Без коментаря"}</Typography.Paragraph>
                </div>
              ))}

              {reviews.length > 3 && !showAll && onShowAllClick && (
                <Button
                  onClick={onShowAllClick}
                  style={{ background: "#4A5A2D", color: "white", border: "none" }}
                >
                  Показати всі відгуки ({reviews.length})
                </Button>
              )}
            </>
          ) : (
            <div className="text-gray-600 text-sm">Відгуків поки немає.</div>
          )}
        </div>
      </div>
    </div>
  );
};
