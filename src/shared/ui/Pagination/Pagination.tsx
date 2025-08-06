
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-8 h-8 rounded border flex justify-center items-center text-sm font-medium ${
          currentPage === 1
            ? "border-gray-300 text-gray-400 cursor-not-allowed"
            : "border-[#3f472f] text-[#3f472f] hover:bg-[#e0e0d0]"
        }`}
        aria-label="Попередня сторінка"
      >
        <FaChevronLeft size={16} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 rounded border text-sm font-medium ${
            page === currentPage
              ? "bg-[#3f472f] text-white border-[#3f472f]"
              : "border-[#ccc] text-[#3f472f] hover:bg-[#e0e0d0]"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-8 h-8 rounded border flex justify-center items-center text-sm font-medium ${
          currentPage === totalPages
            ? "border-gray-300 text-gray-400 cursor-not-allowed"
            : "border-[#3f472f] text-[#3f472f] hover:bg-[#e0e0d0]"
        }`}
        aria-label="Наступна сторінка"
      >
        <FaChevronRight size={16} />
      </button>
    </div>
  );
};
