import { createContext, useContext, useEffect, useState } from "react";
import { listProducts } from "../services/productService";
import { IProduct } from "../interfaces/IProduct";


interface ProductsContextType {
    products: IProduct[];
    loadAvailableProducts: () => Promise<void>;
    addProduct: (product: IProduct) => void;
    editProduct: (product: IProduct) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC = ({ children }) => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const token = localStorage.getItem("token");

    const loadAvailableProducts = async () => {
        if (window.location.pathname === "/produtos") {
        const { data: { products } } = await listProducts(1,100);
        setProducts(products);
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
            loadAvailableProducts();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ProductsContext.Provider value={{ products, addProduct, editProduct, loadAvailableProducts }}>
        {children}
        </ProductsContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) throw new Error("useProducts must be used within a ProductsProvider");
    return context;
};
