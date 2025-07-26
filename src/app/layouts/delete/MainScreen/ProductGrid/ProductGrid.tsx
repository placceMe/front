import React from 'react';

import "./productGrid.css"
import type { Product } from '@shared/types/api';
import ProductCard from '../ProductCard/ProductCard';




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
  title={product.title}
  image={product.attachments[0]?.filePath ?? ''}
  price={product.price}
 // articul={product.id} // или другое поле для артикула
  isAvailable={product.quantity > 0}
/>

        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
