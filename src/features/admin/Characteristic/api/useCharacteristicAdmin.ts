/*import { useRequest } from "@shared/request/useRequest";

export const useCharacteristicAdmin = () => {
  const { request, loading, error } = useRequest();

  const fetchCategories = async () => {
    return await request("/api/category");
  };

  const fetchCharacteristics = async (categoryId: string) => {
    return await request(`/api/characteristicdict/category/${categoryId}`);
  };

  const addCharacteristic = async (characteristic: any) => {
    return await request("/api/characteristicdict", {
      method: "POST",
      body: characteristic,
    });
  };

  return {
    fetchCategories,
    fetchCharacteristics,
    addCharacteristic,
    loading,
    error
  };
};
*/

import { useRequest } from "@shared/request/useRequest";
import type { Category } from "@shared/types/api";

/* типы для API */
export type CharType = "string" | "number" | "boolean" | "date" | "select" | "multiselect";

export type CharacteristicDto = {
  name: string;
  code: string;
  type: CharType;
  unit?: string | null;
  options?: string[] | null;
  required?: boolean;
  filterable?: boolean;
  kitRelevant?: boolean;
  order?: number;
  categoryId: string;
  defaultValue?: string | number | boolean | null;
};

export const useCharacteristicAdmin = () => {
  const { request, loading, error } = useRequest();

  const fetchCategories = async (): Promise<Category[]> => {
    const res = await request<Category[] | null>("/api/category");
    return Array.isArray(res) ? res : [];
  };

  const fetchCharacteristics = async (categoryId: string) =>
    request(`/api/characteristicdict/category/${categoryId}`);

  const addCharacteristic = async (payload: CharacteristicDto) =>
    request("/api/characteristicdict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

  const updateCharacteristic = async (
    id: string,
    payload: Partial<CharacteristicDto>
  ) =>
    request(`/api/characteristicdict/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

  return {
    fetchCategories,
    fetchCharacteristics,
    addCharacteristic,
    updateCharacteristic,
    loading,
    error,
  };
};
