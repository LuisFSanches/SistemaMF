import { api } from "./api";

export interface IProductCategory {
    id: string;
    product_id: string;
    category_id: string;
    created_at: string;
    updated_at: string;
    category: {
        id: string;
        name: string;
        slug: string;
        created_at: string;
        updated_at: string;
    };
}

export const addCategoryToProduct = async (productId: string, categoryId: string) => {
    const token = localStorage.getItem("token")?.replace(/"/g, '');
    const response = await api.post("/product-category", {
        product_id: productId,
        category_id: categoryId
    }, {
        headers: {
            authorization: token
        }
    });
    return response.data;
};

export const getProductCategories = async (productId: string): Promise<IProductCategory[]> => {
    const response = await api.get(`/product-category/product/${productId}`);
    return response.data;
};

export const updateProductCategories = async (productId: string, categoryIds: string[]) => {
    const token = localStorage.getItem("token")?.replace(/"/g, '');
    const response = await api.put(`/product-category/product/${productId}`, {
        category_ids: categoryIds
    }, {
        headers: {
            authorization: token
        }
    });
    return response.data;
};

export const removeProductCategory = async (relationId: string) => {
    const token = localStorage.getItem("token")?.replace(/"/g, '');
    const response = await api.delete(`/product-category/${relationId}`, {
        headers: {
            authorization: token
        }
    });
    return response.data;
};

export const removeAllProductCategories = async (productId: string) => {
    const token = localStorage.getItem("token")?.replace(/"/g, '');
    const response = await api.delete(`/product-category/product/${productId}/all`, {
        headers: {
            authorization: token
        }
    });
    return response.data;
};
