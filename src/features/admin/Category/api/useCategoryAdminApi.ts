import { useRequest } from "@shared/request/useRequest";

export const useCategoryAdminApi = () => {
    const { request, loading, error } = useRequest();

    const fetchCategories = async () => {
        return await request("/api/category");
    };
    const addCategory = async (category: any) => {
        return await request("/api/category", {
            method: "POST",
            body: category,
        });
    };

    return {
        fetchCategories,
        addCategory,
        loading,
        error
    };
};
