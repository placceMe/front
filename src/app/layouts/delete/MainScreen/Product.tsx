import React, { useEffect } from 'react';
import ProductGrid from './ProductGrid/ProductGrid';
import { useProducts } from '../../../../components/MainScreen/api/useProducts';


//const headsets: Product[] = allProductsMock.filter(p => p.categoryId === 'equipment');
//const headsets: Product[] = allProductsMock.filter(p => p.categoryId === 'headsets');

const ProductPage: React.FC = () => {


  const { products, loading, loadProducts } = useProducts();

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ProductGrid title="Популярні товари" products={products} />

    </>
  );
};

export default ProductPage;
