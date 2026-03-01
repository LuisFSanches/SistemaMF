import { createContext, useContext, useState, useEffect } from "react";
import { IProduct } from "../interfaces/IProduct";

interface ICartProduct extends IProduct {
    quantity: number;
}

export interface IDeliveryInfo {
    fee: number;
    distance_km: number;
    cep: string;
    city: string;
    state: string;
    neighborhood: string;
    street: string;
}

interface CartContextType {
    cartItems: ICartProduct[];
    cartCount: number;
    cartTotal: number;
    observations: string;
    deliveryInfo: IDeliveryInfo | null;
    isDeliveryCalculated: boolean;
    addToCart: (product: IProduct, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    setObservations: (observations: string) => void;
    setDeliveryInfo: (info: IDeliveryInfo) => void;
    clearDeliveryInfo: () => void;
    clearCart: () => void;
}

interface CartProviderProps {
    slug: string;
    children: React.ReactNode;
}

const CART_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

function saveWithExpiry<T>(storageKey: string, value: T): void {
    localStorage.setItem(storageKey, JSON.stringify({
        value,
        expiresAt: Date.now() + CART_TTL_MS,
    }));
}

function getWithExpiry<T>(storageKey: string): T | null {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (Date.now() > parsed.expiresAt) {
            localStorage.removeItem(storageKey);
            return null;
        }
        return parsed.value as T;
    } catch {
        localStorage.removeItem(storageKey);
        return null;
    }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<CartProviderProps> = ({ slug, children }) => {
    const key = (name: string) => `${slug}:${name}`;

    const [cartItems, setCartItems] = useState<ICartProduct[]>(() => {
        return getWithExpiry<ICartProduct[]>(key("cart")) ?? [];
    });

    const [observations, setObservations] = useState<string>(() => {
        return getWithExpiry<string>(key("cart_observations")) ?? "";
    });

    const [deliveryInfo, setDeliveryInfoState] = useState<IDeliveryInfo | null>(() => {
        return getWithExpiry<IDeliveryInfo>(key("cart_delivery_info")) ?? null;
    });

    useEffect(() => {
        saveWithExpiry(key("cart"), cartItems);
    }, [cartItems]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        saveWithExpiry(key("cart_observations"), observations);
    }, [observations]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (deliveryInfo) {
            saveWithExpiry(key("cart_delivery_info"), deliveryInfo);
        } else {
            localStorage.removeItem(key("cart_delivery_info"));
        }
    }, [deliveryInfo]); // eslint-disable-line react-hooks/exhaustive-deps

    const isDeliveryCalculated = deliveryInfo !== null;

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const cartTotal = cartItems.reduce((total, item) => {
        return total + (item.price || 0) * item.quantity;
    }, 0);

    const addToCart = (product: IProduct, quantity: number = 1) => {
        console.log('[CartContext] ', { id: product.id, name: product.name, quantity });
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

    const setDeliveryInfo = (info: IDeliveryInfo) => {
        setDeliveryInfoState(info);
    };

    const clearDeliveryInfo = () => {
        setDeliveryInfoState(null);
    };

    const clearCart = () => {
        setCartItems([]);
        setObservations("");
        setDeliveryInfoState(null);
        localStorage.removeItem(key("cart"));
        localStorage.removeItem(key("cart_observations"));
        localStorage.removeItem(key("cart_delivery_info"));
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                cartTotal,
                observations,
                deliveryInfo,
                isDeliveryCalculated,
                addToCart,
                removeFromCart,
                updateQuantity,
                setObservations,
                setDeliveryInfo,
                clearDeliveryInfo,
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
