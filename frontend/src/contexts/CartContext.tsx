import { createContext, useContext, useState, useEffect } from "react";
import { IProduct } from "../interfaces/IProduct";

interface ICartProduct extends IProduct {
    quantity: number;
}

interface CartContextType {
    cartItems: ICartProduct[];
    cartCount: number;
    cartTotal: number;
    observations: string;
    addToCart: (product: IProduct, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    setObservations: (observations: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC = ({ children }) => {
    const [cartItems, setCartItems] = useState<ICartProduct[]>(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [observations, setObservations] = useState<string>(() => {
        const savedObservations = localStorage.getItem("cart_observations");
        return savedObservations ? JSON.parse(savedObservations) : "";
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem("cart_observations", JSON.stringify(observations));
    }, [observations]);

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const cartTotal = cartItems.reduce((total, item) => {
        return total + (item.price || 0) * item.quantity;
    }, 0);

    const addToCart = (product: IProduct, quantity: number = 1) => {
        console.log('[CartContext] Produto sendo adicionado ao carrinho:', { id: product.id, name: product.name, quantity });
        setCartItems((prev) => {
            const existingIndex = prev.findIndex((item) => item.id === product.id);
            
            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity,
                };
                console.log('[CartContext] Produto já existe no carrinho, atualizando quantidade');
                return updated;
            } else {
                const newItem = { ...product, quantity };
                console.log('[CartContext] Novo produto adicionado:', newItem);
                return [...prev, newItem];
            }
        });
    };

    const removeFromCart = (productId: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        setObservations("");
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                cartTotal,
                observations,
                addToCart,
                removeFromCart,
                updateQuantity,
                setObservations,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
};
