import { useRequest } from "@shared/request/useRequest";
import React from "react";

export const useProducts = () => {

const {request, loading, error} = useRequest();

  const [products, setProducts] = React.useState([]);

   const fetchProducts = async () => {
      try {
        const data = await request(`/api/products`);

        return data;

      } catch (error) {

        return error;
      }
    };

    const loadProducts = async () => {
        const data = await fetchProducts();
        if (data) {
          setProducts(data);
        }
      };

  return { products, loading, error, loadProducts };
};
