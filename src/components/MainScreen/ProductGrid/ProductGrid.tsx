import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import "./productGrid.css"

export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  articul: number;
  isTop?: boolean;
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
