/*import React, { useEffect, useState } from "react";
import { useLocalStorageArray } from "@shared/useLocalStorageArray";
import ProductCard from "../app/layouts/delete/ProductCard/ProductCard";

export const ViewedProducts = () => {
  const [viewed] = useLocalStorageArray<string>("viewed", []);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!viewed.length) {
      setProducts([]);
      return;
    }
    setLoading(true);
    fetch("http://localhost:5003/api/products/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: viewed })
    })
      .then(res => res.json())
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [viewed]);

  if (!viewed.length) return null;

  return (
    <div className="mx-40 my-5">
      <h2 className="text-2xl font-semibold mb-6">Переглянуті товари</h2>
      {loading && <div>Завантаження...</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            image={product.mainImageUrl
              ? product.mainImageUrl.startsWith("http")
                ? product.mainImageUrl
                : `http://localhost:5001/api/files/file/${product.mainImageUrl}`
              : "/placeholder.png"}
            price={product.price}
            isAvailable={typeof product.quantity === "number" ? product.quantity > 0 : true}
          />
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
