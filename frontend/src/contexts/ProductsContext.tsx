import { createContext, useContext, useEffect, useState } from "react";
import { listProducts } from "../services/productService";
import { IProduct } from "../interfaces/IProduct";


interface ProductsContextType {
    products: IProduct[];
    loadAvailableProducts: (page: number, pageSize: number, query: string) => Promise<void>;
    totalProducts: number;
    addProduct: (product: IProduct) => void;
    editProduct: (product: IProduct) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC = ({ children }) => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const token = localStorage.getItem("token");

    const loadAvailableProducts = async (page: number, pageSize: number, query: string) => {
        if (true) {
        const { data: { products, total } } = await listProducts(page, pageSize, query);
            setProducts(products);
            setTotalProducts(total);
        }
    };

    const addProduct = (product: IProduct) => {
        setProducts((prevProducts) => [...prevProducts, product]);
    };
    
    const editProduct = (updatedClient: IProduct) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === updatedClient.id ? updatedClient : product
            )
        );
    };

    useEffect(() => {
        if (token) {
            loadAvailableProducts(1, 10, "");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ProductsContext.Provider value={{
            products,
            totalProducts,
            addProduct,
            editProduct,
            loadAvailableProducts
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
