
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
