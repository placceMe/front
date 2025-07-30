/*import React from "react";
import { useUserProductIds } from "@shared/hooks/useUserProductIds";
import { useProductsByIds } from "@shared/hooks/useProductsByIds";
import ProductCard from "../app/layouts/delete/ProductCard/ProductCard";

const userId = JSON.parse(localStorage.getItem("user") || "{}").id || "guest";

export const ViewedProducts = () => {
  const [viewed] = useUserProductIds(userId, "userViewed");
  const { products, loading } = useProductsByIds(viewed);

  if (!viewed.length) return null;

  return (
    <div className="mx-auto max-w-[1440px] px-2 md:px-8 pb-10">
      <h2 className="text-2xl md:text-3xl font-semibold mb-7 text-[#24290e]">
        Переглянуті товари
      </h2>
      {loading && (
        <div className="py-10 text-center text-gray-400 text-lg">
          Завантаження...
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-20">
        {products.map((prod: any) => (
          <div
            key={prod.id}
            
            style={{ minHeight: 320 }}
          >
            <ProductCard {...prod} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewedProducts;

*/
import React from "react";
import { useUserProductIds } from "@shared/hooks/useUserProductIds";
import { useProductsByIds } from "@shared/hooks/useProductsByIds";
import ProductCard from "../app/layouts/delete/ProductCard/ProductCard";
import { useAppSelector } from "@store/hooks";



export const ViewedProducts = () => {
const userId = useAppSelector(state => state.user.user?.id) || "guest";
const [viewed] = useUserProductIds(userId, "userViewed");
  const { products, loading } = useProductsByIds(viewed);

  // 🔕 Если ничего не просматривали
  if (!viewed.length) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center text-gray-400 text-lg">
        Ви ще не переглянули жодного товару.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-2 md:px-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-6">
        <div>
          <h2 className="text-3xl font-semibold mb-1 text-[#3E4826]">
            Переглянуті товари
          </h2>
          <div className="text-[#000000]-500 text-sm font-medium">
            (кількість товарів:{" "}
            <span className="font-semibold">{products.length}</span>)
          </div>
        </div>
      </div>

      {loading && (
        <div className="py-10 text-center text-gray-400 text-lg">
          Завантаження...
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-20">
        {products.map((prod: any) => (
          <div key={prod.id} style={{ minHeight: 320 }}>
            <ProductCard {...prod} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewedProducts;
