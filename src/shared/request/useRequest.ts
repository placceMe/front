import {  useState } from "react";


export const API_PORTS = {
  CATEGORIES: "5003",
  PRODUCTS: "5003",
  ORDERS: "5004",
  USERS: "5002",
  BASE:"8080"
} as const;

export type API_PORTS = typeof API_PORTS[keyof typeof API_PORTS];




export const useRequest = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function request<T = any>(url: string, params: RequestInit = {}): Promise<T | null> {
    setLoading(true);
    try {

      
console.log("Requesting URL:", __BASE_URL__ + url);

      const reqUrl = new URL(__BASE_URL__  + url);

      const response = await fetch(reqUrl.href, {
        ...params,
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { request, error, loading };
};


/*
export const useRequest = (port: API_PORTS) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // <- лучше false по умолчанию

  async function request<T = any>(url: string, params: RequestInit = {}): Promise<T | null> {
    setLoading(true);
    try {
      const reqUrl = new URL(__BASE_URL__ + ":" + port + url);

      const response = await fetch(reqUrl.href, {
        ...params,
        credentials: "include",
      });

      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");

      if (!response.ok) {
        if (isJson) {
          const errorBody = await response.json();
          setError(errorBody?.message || "Unknown error");
        } else {
          setError(`HTTP error ${response.status}`);
        }
        return null;
      }

      return isJson ? await response.json() : null;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { request, error, loading };
};
*/