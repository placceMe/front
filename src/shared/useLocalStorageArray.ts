
import { useState, useEffect } from "react";

export function useLocalStorageArray<T>(key: string, initial: T[] = []) {
  const [arr, setArr] = useState<T[]>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(arr));
  }, [key, arr]);

  return [arr, setArr] as const;
}
