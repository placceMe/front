/*import React from "react";
import { useLocalStorageArray } from "@shared/useLocalStorageArray";
import ProductCard from "../app/layouts/delete/ProductCard/ProductCard";

const FILES_BASE_URL = 'http://localhost:5001/api/files/file/';

export const Wishlist = () => {
  const [wishlist] = useLocalStorageArray<any>("wishlist", []);

  if (!wishlist?.length) return null;

  return (
    <div className="mx-40 my-10">
      <h2 className="text-2xl font-semibold mb-6">Список бажань</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {wishlist.map((product: any) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            image={
    product.mainImageUrl
      ? product.mainImageUrl.startsWith('http')
        ? product.mainImageUrl
        :  product.mainImageUrl
      : '/placeholder.png'
  }
            price={product.price}
            isAvailable={typeof product.quantity === "number" ? product.quantity > 0 : true}
          />
        ))}
      </div>
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
