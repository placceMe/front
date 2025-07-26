
import { useState, useEffect } from "react";

export function useUserProductIds(userId: string, storageKey: string) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageKey) || "{}");
    setIds(data[userId] || []);
  }, [userId, storageKey]);


  const updateIds = (newIds: string[]) => {
    const data = JSON.parse(localStorage.getItem(storageKey) || "{}");
    data[userId] = newIds;
    localStorage.setItem(storageKey, JSON.stringify(data));
    setIds(newIds);
  };

  return [ids, updateIds] as const;
}
