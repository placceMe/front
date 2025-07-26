/*
import React from "react";
import { useUserProductIds } from "@shared/hooks/useUserProductIds";
import { useProductsByIds } from "@shared/hooks/useProductsByIds";
import ProductCard from "../app/layouts/delete/ProductCard/ProductCard";

const userId = JSON.parse(localStorage.getItem("user") || "{}").id || "guest";

export const Wishlist = () => {
  const [wishlist, setWishlist] = useUserProductIds(userId, "userWishlist");
  const { products, loading } = useProductsByIds(wishlist);

  if (!wishlist.length) return null;

  return (
    <div className="mx-40 my-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(prod => (

          <ProductCard key={prod.id} {...prod} />

        ))}</div>
    </div>
  );
};
*/
import React from "react";
import { useUserProductIds } from "@shared/hooks/useUserProductIds";
import { useProductsByIds } from "@shared/hooks/useProductsByIds";
import ProductCard from "../app/layouts/delete/ProductCard/ProductCard";

const userId = JSON.parse(localStorage.getItem("user") || "{}").id || "guest";

export const Wishlist = () => {
  const [wishlist] = useUserProductIds(userId, "userWishlist");
  const { products, loading } = useProductsByIds(wishlist);

  if (!wishlist.length) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center text-gray-400 text-lg">
        Список бажаних товарів порожній.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-2 md:px-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-6">
        <div>
          
             <h2 className="text-3xl font-semibold mb-1 text-[#3E4826]">
            Список бажань
          </h2>
          <div className="text-[#000000]-500 text-sm font-medium">
            (кількість товарів: <span className="font-semibold">{products.length}</span>)
          </div>
        </div>
        {/* Место для кнопки "Очистити список", если нужно */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-40">
        {products.map(prod => (
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
