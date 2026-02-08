import { api } from "./api";

export const listStoreFrontProducts = async (slug: string, page: number, pageSize: number, query: string, categorySlug?: string) => {
    let url = `/storefront/${slug}/products?page=${page}&pageSize=${pageSize}&query=${query}`;
    if (categorySlug) {
        url += `&categorySlug=${categorySlug}`;
    }
    const response = await api.get(url);
    return response;
}

export const getStoreFrontProductDetail = async (storeProductId: string) => {
    const response = await api.get(`/storefront/product/${storeProductId}`);
    return response;
}

export const listProducts = async (page: number, pageSize: number, query: string) => {
    const response = await api.get(`/product/all?page=${page}&pageSize=${pageSize}&query=${query}`);
    
    return response;
};

export const getAvailableProductsForStore = async (page: number, pageSize: number, query: string) => {
    const response = await api.get(`/product/available-for-store?page=${page}&pageSize=${pageSize}&query=${query}`);
    
    return response;
};

export const listStoreProducts = async (storeId: string, page: number, pageSize: number, query: string) => {
    const response = await api.get(`/store-product/all?store_id=${storeId}&page=${page}&pageSize=${pageSize}&query=${query}`);
    
    return response;
};

export const searchProducts = async (query: string) => {
    const response = await api.get(`/product/search?q=${query}`);
    
    return response;
}

export const getProductById = async (productId: string) => {
    const response = await api.get(`/product/${productId}`);
    
    return response;
};

export const createProduct = async (product: any) => {
    const response = await api.post("/product", {
        name: product.name,
        price: parseFloat(product.price),
        unity: product.unity,
        stock: parseFloat(product.stock),
        enabled: product.enabled,
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
    });
    
    return response;
};

export const deleteProduct = async(id: string) => {
    const response = await api.delete(`/product/${id}`);
    
    return response;
};

export const uploadProductImage = async(productId: string, imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post(`/product/${productId}/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    
    return response;
};

export const uploadProductImage2 = async(productId: string, imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post(`/product/${productId}/image-2`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    
    return response;
};

export const uploadProductImage3 = async(productId: string, imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post(`/product/${productId}/image-3`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    
    return response;
};

export const deleteProductImage = async(productId: string, imageField?: 'image' | 'image_2' | 'image_3') => {
    const queryParam = imageField ? `?image_field=${imageField}` : '';
    const response = await api.delete(`/product/${productId}/image${queryParam}`);
    
    return response;
};