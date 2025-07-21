/*import React from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from './../app/layouts/delete/ProductCard/ProductCard';
import { allProductsMock } from '@shared/mocks/allProductsMock';

const CategoryProductsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  // Фильтрация товаров по выбранной категории
  const filteredProducts = allProductsMock.filter(
    (product) => product.categoryId === categoryId
  );

  return (
    <div
      className="category-products-page"
      style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '32px 16px 48px 16px', // сверху/снизу/по бокам
       // background: '#fafaf7',
        minHeight: '80vh',
        borderRadius: 16,
      }}
    >
      <h2
        style={{
          fontWeight: 700,
          fontSize: 28,
          marginBottom: 32,
          color: '#212910',
          letterSpacing: '0.01em',
        }}
      >
        {filteredProducts.length > 0
          ? `Товари категорії: ${categoryId}`
          : 'У цій категорії немає товарів'}
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 32,
        }}
      >
        {filteredProducts.map((product) => (
          <div key={product.id} style={{ padding: 12 }}>
            <ProductCard
            id={product.id} 
              title={product.title}
              image={product.attachments?.[0]?.filePath ?? ''}
              price={product.price}
              isAvailable={product.quantity > 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProductsPage;
*/

//////////////////////////////////////////////
/*
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from './../app/layouts/delete/ProductCard/ProductCard';
import type { Product } from '@shared/types/api';



const CategoryProductsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>('');


  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5003/api/products')
      .then(res => res.json())
      .then((data: Product[]) => {
        console.log('Products loaded:', data);

        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Фильтрация товаров по выбранной категории
  const filteredProducts = products.filter(
    (product) => product.categoryId === categoryId
  );

  return (
    <div className="category-products-page" style={{
      maxWidth: 1400,
      margin: '0 auto',
      padding: '32px 16px 48px 16px',
      minHeight: '80vh',
      borderRadius: 16,
    }}>
      <h2 style={{
        fontWeight: 700,
        fontSize: 28,
        marginBottom: 32,
        color: '#212910',
        letterSpacing: '0.01em',
      }}>
        {filteredProducts.length > 0
          ? `Товари категорії: ${categoryId}`
          : 'У цій категорії немає товарів'}
      </h2>
      {loading ? (
        <div>Завантаження...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 32,
        }}>
          {filteredProducts.map((product) => (
            <div key={product.id} style={{ padding: 12 }}>
              <ProductCard
                id={product.id}
                title={product.title}
                image={product.mainImageUrl}
                price={product.price}
                isAvailable={product.quantity > 0}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProductsPage;
*/

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from './../app/layouts/delete/ProductCard/ProductCard';
import type { Product } from '@shared/types/api';

const CategoryProductsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>('');

  // Загружаем товары
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5003/api/products')
      .then(res => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Загружаем название категории
  useEffect(() => {
    if (!categoryId) return;
    fetch(`http://localhost:5003/api/category/${categoryId}`)
      .then(res => res.json())
      .then((category) => {
        setCategoryName(category.name);
      })
      .catch(() => setCategoryName(''));
  }, [categoryId]);

  // Фильтруем товары по категории
  const filteredProducts = products.filter(
    (product) => product.categoryId === categoryId
  );

  return (
    <div className="category-products-page" style={{
      maxWidth: 1400,
      margin: '0 auto',
      padding: '32px 16px 48px 16px',
      minHeight: '80vh',
      borderRadius: 16,
    }}>
      <h2 style={{
        fontWeight: 700,
        fontSize: 28,
        marginBottom: 32,
        color: '#212910',
        letterSpacing: '0.01em',
      }}>
        {filteredProducts.length > 0
          ? `Товари категорії: ${categoryName || '...'}`
          : 'У цій категорії немає товарів'}
      </h2>
      {loading ? (
        <div>Завантаження...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 32,
        }}>
          {filteredProducts.map((product) => (
            <div key={product.id} style={{ padding: 12 }}>
              <ProductCard
                id={product.id}
                title={product.title}
                mainImageUrl={product.mainImageUrl}
                price={product.price}
                isAvailable={product.quantity > 0}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProductsPage;
