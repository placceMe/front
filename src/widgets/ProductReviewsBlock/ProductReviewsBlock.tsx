import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Button, Space, Typography } from "antd";
import StarIcon from '../../assets/icons/star_yellow.svg?react'

const mockReviews = [
  { name: "Сергій", rating: 5, date: "20 червня 2025", comment: "Чудовий продукт!" },
  { name: "Андрій", rating: 5, date: "07 червня 2025", comment: "Рекомендую!" },
  { name: "Максим", rating: 5, date: "20 травня 2025", comment: "Якість топ!" },
];

const mockQuestions = [
  { name: "Олег М.", question: "Чи є інші розміри?" },
  { name: "Ірина Л.", question: "Яка гарантія на товар?" },
];

export const ProductReviewsBlock = () => {
  const [tab, setTab] = useState<"reviews" | "questions">("reviews");

  const totalReviews = mockReviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => mockReviews.filter((r) => r.rating === star).length
  );

  return (
    <div>
      <h2 className="text-[1.8rem] font-bold flex items-center mb-6 text-[0E120A]">
        <FaStar className="mr-2 text-[#454E30]" /> Відгуки та питання
      </h2>

      <div className="grid md:grid-cols-[350px_1fr] gap-8">
        <div>
          <div className="mb-4">
            <div className="text-base flex font-semibold mb-3 gap-1">
              Оцінка користувачів 5/5 <StarIcon />
            </div>
            <div className="text-base text-gray-600">на основі {totalReviews} відгуків</div>
          </div>

          <div className="space-y-2 mb-6">
            {[5, 4, 3, 2, 1].map((star, index) => {
              const percent = totalReviews ? (ratingCounts[index] / totalReviews) * 100 : 0;
              return (
                <div className="flex items-center gap-3" key={star}>
                  <span className="text-sm font-medium w-4">{star}</span>
                  <StarIcon />
                  <div className="w-48 h-2 bg-[#7C7878] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${ratingCounts[index] > 0
                        ? star === 5
                          ? "bg-[#E4A800]"
                          : "bg-[#7C7878]"
                        : "bg-[#7C7878]"
                        }`}
                      style={{
                        width: percent ? `${percent}%` : "0%",
                        minWidth: ratingCounts[index] > 0 ? "10px" : "0",
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-4">{ratingCounts[index]}</span>
                </div>
              );
            })}
          </div>
          <Button
            style={{
              background: 'linear-gradient(to bottom, rgba(75, 90, 45, 0.3) 0%, rgba(40, 50, 25, 0.8) 100%), #4A5A2D', // background: 'linear-gradient(180deg, #3E4826 0%, #2D351A 100%)',
              color: 'white',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 'bold',
              width: '50%',
              padding: '20px',
              fontSize: 16,
              letterSpacing: '0.7px',
            }}>
            {tab === 'reviews' ? "Написати відгук" : "Задати питання"}
          </Button>
        </div>


        <div className="space-y-4">
          <div className="flex gap-4 mb-4">
            <Button
              style={{
                background: tab === "reviews"
                  ? 'linear-gradient(to bottom, rgba(75, 90, 45, 0.3) 0%, rgba(40, 50, 25, 0.8) 100%), #4A5A2D'
                  : 'linear-gradient( rgba(229, 229, 216, 0.8) )',
                color: tab === "reviews" ? 'white' : '#454E30',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 'bold',
                border: tab === "reviews" ? 'none' : '1px solid #454E30',
              }}
              onClick={() => setTab("reviews")}
              className={`font-semibold ${tab !== "reviews"
                ? "hover:bg-[#454E30] hover:text-white"
                : ""
                }`}
            >
              Відгуки ({mockReviews.length})
            </Button>
            <Button
              style={{
                background: tab === "questions"
                  ? 'linear-gradient(to bottom, rgba(75, 90, 45, 0.3) 0%, rgba(40, 50, 25, 0.8) 100%), #4A5A2D'
                  : 'linear-gradient( rgba(229, 229, 216, 0.8) )',
                color: tab === "questions" ? 'white' : '#454E30',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 'bold',
                border: tab === "questions" ? 'none' : '1px solid #454E30',
              }}
              onClick={() => setTab("questions")}
              className={`font-semibold ${tab !== "questions"
                ? "hover:bg-[#454E30] hover:text-white"
                : ""
                }`}
            >
              Питання ({mockQuestions.length})
            </Button>
          </div>

          {tab === "reviews" ? (
            mockReviews.map((review, i) => (
              <div key={i} className="border border-[#3E4826] rounded-lg p-4" style={{
                background: 'linear-gradient( rgba(229, 229, 216, 0.8) )'
              }}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center font-semibold mb-2 text-[#3E4826] font-montserrat">
                    <span className="mr-5">{review.name}</span>
                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, idx) => (
                        <StarIcon key={idx} />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-[#3E4826]">{review.date}</div>

                </div>

                <Typography.Paragraph className="text-[#0E120A]">
                  {review.comment}
                </Typography.Paragraph>

              </div>
            ))
          ) : (
            mockQuestions.map((q, i) => (
              <div key={i} className="border border-[#3E4826] rounded-lg p-4 bg-gray-50" style={{
                background: 'linear-gradient( rgba(229, 229, 216, 0.8) )'
              }}>
                <div className="font-semibold mb-2 text-[#3E4826] font-montserrat">{q.name}</div>
                <div className="text-[#0E120A]">{q.question}</div>
              </div>
            ))
          )}


        </div>

      </div>
    </div>
  );
};
