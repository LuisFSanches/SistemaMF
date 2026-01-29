import { api } from "./api";
import { ICategory } from "../interfaces/ICategory";

interface ICreateCategoryDTO {
    name: string;
    slug: string;
}

interface IUpdateCategoryDTO {
    name?: string;
    slug?: string;
}

class CategoryService {
    async getAllCategories(): Promise<ICategory[]> {
        const response = await api.get("/category/all");
        return response.data;
    }

    async getCategoryById(categoryId: string): Promise<ICategory> {
        const token = localStorage.getItem("token")?.replace(/"/g, '');
        const response = await api.get(`/category/${categoryId}`, {
            headers: {
                authorization: token
            }
        });
        return response.data;
    }

    async createCategory(data: ICreateCategoryDTO): Promise<ICategory> {
        const token = localStorage.getItem("token")?.replace(/"/g, '');
        const response = await api.post("/category", data, {
            headers: {
                authorization: token
            }
        });
        return response.data;
    }

    async updateCategory(categoryId: string, data: IUpdateCategoryDTO): Promise<ICategory> {
        const token = localStorage.getItem("token")?.replace(/"/g, '');
        const response = await api.put(`/category/${categoryId}`, data, {
            headers: {
                authorization: token
            }
        });
        return response.data;
    }

    async deleteCategory(categoryId: string): Promise<void> {
        const token = localStorage.getItem("token")?.replace(/"/g, '');
        await api.delete(`/category/${categoryId}`, {
            headers: {
                authorization: token
            }
        });
    }

    async uploadCategoryImage(categoryId: string, file: File): Promise<ICategory> {
        const token = localStorage.getItem("token")?.replace(/"/g, '');
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(`/category/${categoryId}/upload`, formData, {
            headers: {
                authorization: token,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    async deleteCategoryImage(categoryId: string): Promise<ICategory> {
        const token = localStorage.getItem("token")?.replace(/"/g, '');
        const response = await api.delete(`/category/${categoryId}/image`, {
            headers: {
                authorization: token
            }
        });
        return response.data;
    }
}

export default new CategoryService();
