import {  useState } from "react";

declare const __BASE_URL__: string;

export const API_PORTS = {
  CATEGORIES: "5003",
  PRODUCTS: "5003",
  ORDERS: "5004",
  USERS: "5002",
} as const;

export type API_PORTS = typeof API_PORTS[keyof typeof API_PORTS];

export const useRequest = (port: API_PORTS) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function request<T = any>(url: string, params: RequestInit = {}): Promise<T | null> {
    setLoading(true);
    try {

      
      const reqUrl = new URL(__BASE_URL__ + ":" +  port + url);

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