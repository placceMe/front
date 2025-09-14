/*import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "@shared/types/api";
import { useRequest } from "@shared/request/useRequest";
import { Pagination } from "@shared/ui/Pagination/Pagination";
import ProductCard from "../app/layouts/delete/ProductCard/ProductCard";
import ProductFilters from "@widgets/ProductFilters";


const CSS = `
.category-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  padding: 6px 4px;
}

.category-grid > .product-card {
  width: 100%;
  max-width: 300px;
  justify-self: center;
}

@media (max-width: 1440px) { 
  .category-grid { 
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
  }
  .category-grid > .product-card { max-width: 280px; }
}

@media (max-width: 1280px) { 
  .category-grid { 
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); 
  }
  .category-grid > .product-card { max-width: 260px; }
}

@media (max-width: 1024px) { 
  .category-grid { 
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
  }
  .category-grid > .product-card { max-width: 240px; }
}

@media (max-width: 768px) { 
  .category-grid { 
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
  }
  .category-grid > .product-card { max-width: 220px; }
}

@media (max-width: 600px) { 
  .category-grid { 
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); 
  }
  .category-grid > .product-card { max-width: 140px; }
}

.category-section { 
  margin: 10px 0 5px; 
}

.category-title { 
  font-size: 22px; 
  font-weight: 700; 
  color: #212910; 
  margin: 0 0 10px; 
}

@media (max-width: 768px) { 
  .category-title { 
    font-size: 18px; 
  } 
}
`;

function useInjectOnce(id: string, css: string) {
  useEffect(() => {
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id; 
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  }, [id, css]);
}

const CategoryProductsPage: React.FC = () => {
  useInjectOnce("category-css", CSS);

  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { request } = useRequest();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryName, setCategoryName] = useState('');

  const [filters, setFilters] = useState({
    producers: [] as string[],
    colors: [] as string[],
    priceMin: 0,
    priceMax: 50000,
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);

    const limit = 12;
    const offset = (currentPage - 1) * limit;

    const params = new URLSearchParams({
      offset: String(offset),
      limit: String(limit),
      categoryId: categoryId || '',
      ...(filters.producers.length > 0 && { producer: filters.producers.join(',') }),
      ...(filters.colors.length > 0 && { color: filters.colors.join(',') }),
      priceMin: String(filters.priceMin),
      priceMax: String(filters.priceMax)
    });

    Promise.all([
      request<any>(`/api/category/${categoryId}`),
      request<any>(`/api/products/filter?${params.toString()}`)
    ])
    .then(([categoryData, res]) => {
      setCategoryName(categoryData?.name ?? "");
      const items = Array.isArray(res?.products) ? res.products : [];
      setProducts(items);

      const pageSize = Number(res?.pagination?.pageSize) || limit;
      const totalItems = Number(res?.pagination?.totalItems) || 0;
      const totalPagesFromApi = Number(res?.pagination?.totalPages);

      const computed = totalPagesFromApi && totalPagesFromApi > 0
        ? totalPagesFromApi
        : (totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1);

      setTotalPages(Math.max(1, computed));
    })
    .finally(() => setLoading(false));
  }, [categoryId, currentPage, filters]);

  useEffect(() => { 
    setCurrentPage(1); 
  }, [categoryId]);

  return (
    <div className="container section">
      <h2 className="category-title">
        {products.length > 0
          ? `${categoryName || "..."}`
          : `У цій категорії немає товарів`}
      </h2>

      <ProductFilters filters={filters} onChange={handleFilterChange} />

      {loading ? (
        <div>Завантаження...</div>
      ) : (
        <div className="category-grid">
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
*/

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "@shared/types/api";
import { useRequest } from "@shared/request/useRequest";
import { Pagination } from "@shared/ui/Pagination/Pagination";
import ProductCard from "../app/layouts/delete/ProductCard/ProductCard";

const CSS = `
.category-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  padding: 6px 4px;
}

.category-grid > .product-card {
  width: 100%;
  max-width: 300px;
  justify-self: center;
}

@media (max-width: 1440px) { 
  .category-grid { 
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
  }
  .category-grid > .product-card { max-width: 280px; }
}

@media (max-width: 1280px) { 
  .category-grid { 
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); 
  }
  .category-grid > .product-card { max-width: 260px; }
}

@media (max-width: 1024px) { 
  .category-grid { 
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
  }
  .category-grid > .product-card { max-width: 240px; }
}

@media (max-width: 768px) { 
  .category-grid { 
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
  }
  .category-grid > .product-card { max-width: 220px; }
}

@media (max-width: 600px) { 
  .category-grid { 
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); 
  }
  .category-grid > .product-card { max-width: 140px; }
}

.category-section { 
  margin: 10px 0 5px; 
}

.category-title { 
  font-size: 22px; 
  font-weight: 700; 
  color: #212910; 
  margin: 0 0 10px; 
}

@media (max-width: 768px) { 
  .category-title { 
    font-size: 18px; 
  } 
}
`;

function useInjectOnce(id: string, css: string) {
  useEffect(() => {
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id; 
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  }, [id, css]);
}

const CategoryProductsPage: React.FC = () => {
  useInjectOnce("category-css", CSS);
  
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






/*
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
*/


  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);

    const limit = 12;
    const offset = (currentPage - 1) * limit;

    Promise.all([
      request<any>(`/api/category/${categoryId}`),
      request<any>(`/api/products/category/${categoryId}?limit=${limit}&offset=${offset}`)
    ])
    .then(([categoryData, res]) => {
      console.log("RAW /api/products/category response ->", res);

      setCategoryName(categoryData?.name ?? "");
      const items = Array.isArray(res?.products) ? res.products : [];
      setProducts(items);

      const pageSize = Number(res?.pagination?.pageSize) || limit;
      const totalItems = Number(res?.pagination?.totalItems) || 0;
      const totalPagesFromApi = Number(res?.pagination?.totalPages);

      const computed = totalPagesFromApi && totalPagesFromApi > 0
        ? totalPagesFromApi
        : (totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1);

      setTotalPages(Math.max(1, computed));
    })
    .finally(() => setLoading(false));
  }, [categoryId, currentPage]);

  useEffect(() => { 
    setCurrentPage(1); 
  }, [categoryId]);

  return (
    <div className="container section">
      <h2 className="category-title">
        {products.length > 0
          ? `${categoryName || "..."}`
          : `У цій категорії немає товарів`}
      </h2>
      
      {loading ? (
        <div>Завантаження...</div>
      ) : (
        <div className="category-grid">
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