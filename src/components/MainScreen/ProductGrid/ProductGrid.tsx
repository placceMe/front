import React from 'react';
import "./productGrid.css";
import ProductCard from 'app/layouts/delete/ProductCard/ProductCard';
import type { Product } from '@shared/types/api';

export interface IProduct extends Product {

  isAvailable?: boolean;
}

interface ProductGridProps {
  title: string;
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ title, products }) => {
  return (
    <section className="product-grid-section">
      <h2 className="section-title">{title}</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
