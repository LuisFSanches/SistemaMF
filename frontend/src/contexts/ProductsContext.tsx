import { createContext, useContext, useState, useCallback, useRef } from "react";
import { listStoreProducts } from "../services/productService";
import { IProduct } from "../interfaces/IProduct";
interface ProductsContextType {
    products: IProduct[];
    loadAvailableProducts: (storeId: string, page: number, pageSize: number, query: string, forceRefresh?: boolean) => Promise<void>;
    totalProducts: number;
    addProduct: (product: IProduct) => void;
    editProduct: (product: IProduct) => void;
    refreshProducts: (storeId: string) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC = ({ children }) => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const cacheRef = useRef<Map<string, { products: IProduct[], total: number, timestamp: number }>>(new Map());
    const lastParamsRef = useRef<{ storeId: string, page: number, pageSize: number, query: string } | null>(null);
    const CACHE_DURATION = 240 * 60 * 1000; // 240 minutos

    const loadAvailableProducts = useCallback(async (
        storeId: string,
        page: number, 
        pageSize: number, 
        query: string,
        forceRefresh: boolean = false
    ) => {
        const cacheKey = `${storeId}-${page}-${pageSize}-${query}`;
        const now = Date.now();
        
        // Armazena os últimos parâmetros
        lastParamsRef.current = { storeId, page, pageSize, query };

        // Verifica se há cache válido e não está forçando refresh
        if (!forceRefresh && cacheRef.current.has(cacheKey)) {
            const cached = cacheRef.current.get(cacheKey)!;
            
            // Se o cache ainda é válido (menos de 5 minutos)
            if (now - cached.timestamp < CACHE_DURATION) {
                setProducts(cached.products);
                setTotalProducts(cached.total);
                return;
            }
        }

        // Busca os dados da API
        const { data: { products: fetchedProducts, total } } = await listStoreProducts(storeId, page, pageSize, query);
        console.log("Fetched products:", fetchedProducts);
        // Atualiza o cache
        cacheRef.current.set(cacheKey, {
            products: fetchedProducts,
            total,
            timestamp: now
        });

        setProducts(fetchedProducts);
        setTotalProducts(total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refreshProducts = useCallback(async (storeId: string) => {
        // Limpa todo o cache
        cacheRef.current.clear();
        
        // Recarrega os produtos com os últimos parâmetros usados
        if (lastParamsRef.current) {
            const { page, pageSize, query } = lastParamsRef.current;
            await loadAvailableProducts(storeId, page, pageSize, query, true);
        }
    }, [loadAvailableProducts]);

    const addProduct = useCallback((product: IProduct) => {
        setProducts((prevProducts) => [...prevProducts, product]);
        setTotalProducts((prevTotal) => prevTotal + 1);
        
        // Limpa o cache para forçar atualização na próxima busca
        cacheRef.current.clear();
    }, []);
    
    const editProduct = useCallback((updatedProduct: IProduct) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
            )
        );
        
        // Limpa o cache para forçar atualização na próxima busca
        cacheRef.current.clear();
    }, []);

    return (
        <ProductsContext.Provider value={{
            products,
            totalProducts,
            addProduct,
            editProduct,
            loadAvailableProducts,
            refreshProducts
        }}>
        {children}
        </ProductsContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) throw new Error("useProducts must be used within a ProductsProvider");
    return context;
};
