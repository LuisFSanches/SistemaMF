import { api } from "./api";
const token = localStorage.getItem("token")?.replace(/"/g, '');

export const listProducts = async (page: number, pageSize: number, query: string) => {
    const response = await api.get(`/product/all?page=${page}&pageSize=${pageSize}&query=${query}`, {
        headers: {
            Authorization: `${token}`,
        }
    });
    
    return response;
};

export const searchProducts = async (query: string) => {
    const response = await api.get(`/product/search?q=${query}`, {
        headers: {
            Authorization: `${token}`,
        }
    });
    
    return response;
}

export const createProduct = async (product: any) => {
    const response = await api.post("/product", {
        name: product.name,
        price: parseFloat(product.price),
        unity: product.unity,
        stock: parseFloat(product.stock),
        enabled: product.enabled,
        headers: {
            Authorization: `${token}`,
        }
    });
    
    return response;
};

export const updateProduct = async(product: any) => {
    const response = await api.put(`/product/${product.id}`, {
        name: product.name,
        price: parseFloat(product.price),
        unity: product.unity,
        stock: parseFloat(product.stock),
        enabled: product.enabled,
        image: product.image,
        headers: {
            Authorization: `${token}`,
        }
    });
    
    return response;
};

export const deleteProduct = async(id: string) => {
    const response = await api.delete(`/product/${id}`, {
        headers: {
            Authorization: `${token}`,
        }
    });
    
    return response;
};