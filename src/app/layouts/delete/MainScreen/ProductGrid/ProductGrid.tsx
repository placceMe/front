import React from 'react';

import "./productGrid.css";
import type { Product } from '@shared/types/api';
import ProductCard from '../../ProductCard/ProductCard';




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
          <ProductCard
            key={product.id}
            {...product}
            mainImageUrl={product.mainImageUrl ? `http://31.42.190.94:8080/api/files/${product.mainImageUrl}` : ''}

          />

        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
