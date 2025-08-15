import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//import '../components/MainScreen/ProductGrid/productGrid.css';
import type { Product } from "@shared/types/api";
import { useRequest } from "@shared/request/useRequest";
import { Pagination } from "@shared/ui/Pagination/Pagination";
import ProductCard from "../app/layouts/delete/ProductCard/ProductCard";


const CategoryProductsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { request } = useRequest();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryName, setCategoryName] = useState('');

/*
  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    const limit = 12;
    const offset = (currentPage - 1) * limit;

    request<Product[]>(`/api/products/category/${categoryId}?limit=${limit}&offset=${offset}`)
      .then((data) => {
        if (data) {
          setProducts(data);
          setTotalPages(Math.ceil(100 / limit)); // TODO: заменить на count из бэка
        }
      })
      .finally(() => setLoading(false));
  }, [categoryId, currentPage]);
*/

useEffect(() => {
   console.log("Fetching category and products for:", categoryId);
  if (!categoryId) return;
  setLoading(true);
  const limit = 32;
  const offset = (currentPage - 1) * limit;

  Promise.all([
   request<any>(`/api/category/${categoryId}`),
    request<Product[]>(`/api/products/category/${categoryId}?limit=${limit}&offset=${offset}`)
  ])
    .then(([categoryData, productsData]) => {
        console.log("categoryData:", categoryData); 
      if (categoryData) setCategoryName(categoryData.name);setTotalPages(Math.ceil(100 / limit));
      if (productsData) setProducts(productsData); 
      // TODO: если backend вернёт count, обнови setTotalPages
    })
    .finally(() => setLoading(false));
}, [categoryId, currentPage]);


  return (
   <div className="mt-10 mb-20 px-4 md:px-44" >
  <h2 className="category-title pb-6 text-lg font-medium 
               sm:text-xl sm:font-semibold 
               md:text-xl md:font-semibold 
               lg:text-2xl lg:font-bold">{products.length > 0
      ? `${categoryName || "..."}`
      : `У цій категорії немає товарів`}</h2>
{loading ? (
  <div>Завантаження...</div>
) : (
  <div className="category-grid"  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "12px",
  }}>
    {products.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        isAvailable={product.quantity > 0}
      />
    ))}
  </div>
)}




  <div className="mt-10">
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  </div>
</div>

  );
};

export default CategoryProductsPage;
