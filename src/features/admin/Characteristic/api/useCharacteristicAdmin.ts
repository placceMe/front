import { useRequest } from "@shared/request/useRequest";

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
