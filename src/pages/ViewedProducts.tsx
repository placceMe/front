
import React from "react";
import { useUserProductIds } from "@shared/hooks/useUserProductIds";
import { useProductsByIds } from "@shared/hooks/useProductsByIds";
import ProductCard from "../app/layouts/delete/ProductCard/ProductCard";

const userId = JSON.parse(localStorage.getItem("user") || "{}").id || "guest";

export const ViewedProducts = () => {
  const [viewed] = useUserProductIds(userId, "userViewed");
  const { products, loading } = useProductsByIds(viewed);

  if (!viewed.length) return null;
console.log("products from API:", products);

  return (
    <div className="mx-40 my-5">
      <h2 className="text-2xl font-semibold mb-6">Переглянуті товари</h2>
      {loading && <div>Завантаження...</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((prod: any) => (
           <ProductCard key={prod.id} {...prod} />
        ))}
      </div>
    </div>
  );
};

export default ViewedProducts;
