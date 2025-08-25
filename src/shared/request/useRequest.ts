import {  useState } from "react";


export const API_PORTS = {
  CATEGORIES: "5003",
  PRODUCTS: "5003",
  ORDERS: "5004",
  USERS: "5002",
  BASE:"8080"
} as const;

export type API_PORTS = typeof API_PORTS[keyof typeof API_PORTS];



/*
export const useRequest = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);


  async function request<T = any>(url: string, params: RequestInit = {}): Promise<T | null> {
    setLoading(true);
    try {

      

      const reqUrl = new URL(__BASE_URL__  + url);

      const response = await fetch(reqUrl.href, {
        ...params,
        //body: params.body ? JSON.stringify(params.body) : undefined,
        credentials: "include",
        headers:{
          "Content-Type": "application/json",
        }
      });

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { request, error, loading };
};
*/


export const useRequest = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function request<T = any>(
    url: string,
    params: RequestInit & { body?: any } = {}
  ): Promise<T | null> {
    setLoading(true);
    setError(null);

    try {
      const reqUrl = new URL(__BASE_URL__ + url);

      const body = params.body;
      const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
      const isBlob = typeof Blob !== "undefined" && body instanceof Blob;
      const isArrayBuffer =
        typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer;
      const isStream =
        body &&
        (typeof ReadableStream !== "undefined" ? body instanceof ReadableStream : false);
      const isStringBody = typeof body === "string";

      // Итоговые заголовки (не перетираем те, что пришли)
      const headers = new Headers(params.headers || {});

      // Готовим тело
      let finalBody: BodyInit | undefined;
      if (body === undefined || body === null) {
        finalBody = undefined;
      } else if (isFormData || isBlob || isArrayBuffer || isStream) {
        // Ничего не меняем и НЕ ставим Content-Type
        finalBody = body as BodyInit;
      } else if (isStringBody) {
        // Уже строка — отправляем как есть (если нужно, пусть заголовок задают вручную)
        if (!headers.has("Content-Type")) {
          headers.set("Content-Type", "application/json"); // часто это и нужен
        }
        finalBody = body as string;
      } else if (typeof body === "object") {
        // Обычный объект → JSON
        if (!headers.has("Content-Type")) {
          headers.set("Content-Type", "application/json; charset=utf-8");
        }
        finalBody = JSON.stringify(body);
      } else {
        // На всякий случай: даём браузеру самому решить
        finalBody = body as BodyInit;
      }

      const resp = await fetch(reqUrl.href, {
        ...params,
        credentials: "include",
        headers,
        body: finalBody,
      });

      const ct = resp.headers.get("content-type") || "";
      const isJson = ct.includes("application/json");

      if (!resp.ok) {
        let details: any = null;
        try { details = isJson ? await resp.json() : await resp.text(); } catch {console.log('err')}
        const message =
          (details && (details.title || details.message || details.error)) ||
          `HTTP ${resp.status}`;
        setError(message);
        return null;
      }

      if (resp.status === 204) return null;
      return (isJson ? await resp.json() : await resp.text()) as T;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
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