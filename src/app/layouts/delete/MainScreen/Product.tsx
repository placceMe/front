import React from 'react';
import ProductGrid from './ProductGrid/ProductGrid';
//import type { Product } from './ProductGrid/ProductGrid';
/*
import Head from "../../assets/mainscreen/MocImage/head.png"
import Body from "../../assets/mainscreen/MocImage/body.png"
import Speaker from "../../assets/mainscreen/MocImage/speaker.png"
*/
/*
const popularProducts: Product[] = [
  {
    id: 1,
    title: 'Шолом FAST',
    image: Head,
    price: 3200,
    articul: 1421412,
    isTop: true,
  },
  {
    id: 2,
    title: 'Навушники Earmor',
    image: Body,
    articul: 1421412,
    price: 1400,
  },
  {
    id: 3,
    title: 'Тактична розгрузка',
    image: Speaker,
    articul: 1421412,
    price: 4500,
  },
    {
    id: 4,
    title: 'Тактична розгрузка 2',
    image: Speaker,
    articul: 1421412,
    price: 4500,
  },
    {
    id: 5,
    title: 'Тактична розгрузка 3',
    image: Speaker,
    articul: 1421412,
    price: 4500,
  },
];
*/


import { allProductsMock } from '@shared/mocks/allProductsMock';
import type { Product } from '@shared/types/api';


const helmets: Product[] = allProductsMock.filter(p => p.categoryId === 'clothes');
const plates: Product[] = allProductsMock.filter(p => p.categoryId === 'equipment');
const headsets: Product[] = allProductsMock.filter(p => p.categoryId === 'equipment');
//const headsets: Product[] = allProductsMock.filter(p => p.categoryId === 'headsets');

const ProductPage: React.FC = () => {
  return (
    <>
    <ProductGrid title="Популярні товари" products={helmets} />
    <ProductGrid title="Тактичне спорядження" products={plates} />
    <ProductGrid title="Тактичний одяг" products={helmets} />
    <ProductGrid title="Нещодавно переглянуті" products={plates} />
    </>
  );
};

export default ProductPage;
