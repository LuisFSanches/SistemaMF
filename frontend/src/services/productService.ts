import { api } from "./api";
const token = localStorage.getItem("token")?.replace(/"/g, '');

export const listStoreFrontProducts = async (page: number, pageSize: number, query: string) => {
    const response = await api.get(`/storefront/products?page=${page}&pageSize=${pageSize}&query=${query}`);
    return response;
}

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

export const getProductById = async (productId: string) => {
    const response = await api.get(`/product/${productId}`, {
        headers: {
            Authorization: `${token}`,
        }
    });
    
    return response;
};

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
    console.log(product);
    const response = await api.put(`/product/${product.id}`, {
        name: product.name,
        price: parseFloat(product.price),
        unity: product.unity,
        stock: parseFloat(product.stock),
        enabled: product.enabled,
        visible_in_store: product.visible_in_store,
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

export const uploadProductImage = async(productId: string, imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post(`/product/${productId}/image`, formData, {
        headers: {
            Authorization: `${token}`,
            'Content-Type': 'multipart/form-data',
        }
    });
    
    return response;
};

export const deleteProductImage = async(productId: string) => {
    const response = await api.delete(`/product/${productId}/image`, {
        headers: {
            Authorization: `${token}`,
        }
    });
    
    return response;
};