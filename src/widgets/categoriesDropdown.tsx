import { useRequest } from "@shared/request/useRequest";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  status: string;
}

interface CategoriesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({
  isOpen, onClose
}) => {

  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const { request } = useRequest();

  const fetchCategories = async () => {
    const response = await request<Category[]>("/api/category", {
      method: "GET",
    });

    if (response) {
      setCategories(response.filter((c: Category) => c.status === "Active"));
    }
  };

  useEffect(() => {

    fetchCategories();

  }, []);


  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 top-full mt-2 w-[260px] bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      style={{ padding: 0 }}
    >
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => {
            navigate(`/category/${category.id}`);
            onClose();
          }}
          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 border-b border-gray-100 text-left transition bg-white text-sm"
        >
          <span className="text-base">
            {[category.name]}
          </span>

          <span className="text-gray-300">›</span>
        </button>
      ))}

    </div>
  );
};

export default CategoriesDropdown;
