import { useCallback } from 'react';

declare global {
    interface Window {
        dataLayer: any[];
    }
}

export const useGTM = () => {
    const pushToDataLayer = useCallback((data: any) => {
        // Não enviar eventos em ambiente de desenvolvimento (localhost)
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname.includes('localhost');
        
        // Não enviar eventos em rotas do backoffice
        const isBackoffice = window.location.pathname.startsWith('/backoffice');
        
        if (isLocalhost) {
            return;
        }
        
        if (isBackoffice) {
            return;
        }
        
        if (typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push(data);
        }
    }, []);

    // Page View - rastrear visualização de página
    const trackPageView = useCallback((pageTitle: string) => {
        pushToDataLayer({
            event: 'page_view',
            page_title: pageTitle,
        });
    }, [pushToDataLayer]);

    // View Item List - rastrear visualização de lista de produtos
    const trackViewItemList = useCallback((products: any[], listName: string) => {
        pushToDataLayer({
            event: 'view_item_list',
            ecommerce: {
                currency: 'BRL',
                item_list_name: listName,
                items: products.map((product, index) => ({
                    item_id: product.id || product.product_id || product.product?.id,
                    item_name: product.name || product.product?.name,
                    item_category: product.category || product.product?.category?.name,
                    price: parseFloat(product.price || product.product?.price || 0),
                    index: index,
                })),
            },
        });
    }, [pushToDataLayer]);

    // View Item - rastrear visualização de produto (PDP)
    const trackViewItem = useCallback((product: any) => {
        pushToDataLayer({
            event: 'view_item',
            ecommerce: {
                currency: 'BRL',
                value: parseFloat(product.price || product.product?.price || 0),
                items: [{
                    item_id: product.id || product.product_id || product.product?.id,
                    item_name: product.name || product.product?.name,
                    item_category: product.category || product.product?.category?.name,
                    price: parseFloat(product.price || product.product?.price || 0),
                    quantity: 1,
                }],
            },
        });
    }, [pushToDataLayer]);

    // Add to Cart - rastrear adição ao carrinho
    const trackAddToCart = useCallback((product: any, quantity: number) => {
        pushToDataLayer({
            event: 'add_to_cart',
            ecommerce: {
                currency: 'BRL',
                value: parseFloat(product.price || product.product?.price || 0) * quantity,
                items: [{
                    item_id: product.id || product.product_id || product.product?.id,
                    item_name: product.name || product.product?.name,
                    item_category: product.category || product.product?.category?.name,
                    price: parseFloat(product.price || product.product?.price || 0),
                    quantity: quantity,
                }],
            },
        });
    }, [pushToDataLayer]);

    // Remove from Cart - rastrear remoção do carrinho
    const trackRemoveFromCart = useCallback((product: any, quantity: number) => {
        pushToDataLayer({
            event: 'remove_from_cart',
            ecommerce: {
                currency: 'BRL',
                value: parseFloat(product.price || product.product?.price || 0) * quantity,
                items: [{
                    item_id: product.id || product.product_id || product.product?.id,
                    item_name: product.name || product.product?.name,
                    item_category: product.category || product.product?.category?.name,
                    price: parseFloat(product.price || product.product?.price || 0),
                    quantity: quantity,
                }],
            },
        });
    }, [pushToDataLayer]);

    // View Cart - rastrear visualização do carrinho
    const trackViewCart = useCallback((cartItems: any[], cartTotal: number) => {
        pushToDataLayer({
            event: 'view_cart',
            ecommerce: {
                currency: 'BRL',
                value: cartTotal,
                items: cartItems.map((item, index) => ({
                    item_id: item.id || item.product_id || item.product?.id,
                    item_name: item.name || item.product?.name,
                    item_category: item.category || item.product?.category?.name,
                    price: parseFloat(item.price || item.product?.price || 0),
                    quantity: item.quantity,
                    index: index,
                })),
            },
        });
    }, [pushToDataLayer]);

    // Begin Checkout - rastrear início do processo de checkout
    const trackBeginCheckout = useCallback((cartItems: any[], cartTotal: number) => {
        pushToDataLayer({
            event: 'begin_checkout',
            ecommerce: {
                currency: 'BRL',
                value: cartTotal,
                items: cartItems.map((item, index) => ({
                    item_id: item.id || item.product_id || item.product?.id,
                    item_name: item.name || item.product?.name,
                    item_category: item.category || item.product?.category?.name,
                    price: parseFloat(item.price || item.product?.price || 0),
                    quantity: item.quantity,
                    index: index,
                })),
            },
        });
    }, [pushToDataLayer]);

    // Add Shipping Info - rastrear informações de entrega no checkout
    const trackAddShippingInfo = useCallback((cartItems: any[], cartTotal: number, deliveryFee: number) => {
        pushToDataLayer({
            event: 'add_shipping_info',
            ecommerce: {
                currency: 'BRL',
                value: cartTotal + deliveryFee,
                shipping_tier: 'Delivery',
                items: cartItems.map((item, index) => ({
                    item_id: item.id || item.product_id || item.product?.id,
                    item_name: item.name || item.product?.name,
                    item_category: item.category || item.product?.category?.name,
                    price: parseFloat(item.price || item.product?.price || 0),
                    quantity: item.quantity,
                    index: index,
                })),
            },
            shipping_cost: deliveryFee,
        });
    }, [pushToDataLayer]);

    // Purchase - rastrear compra finalizada
    const trackPurchase = useCallback((
        orderId: string,
        cartItems: any[],
        cartTotal: number,
        deliveryFee: number,
        paymentMethod: string
    ) => {
        pushToDataLayer({
            event: 'purchase',
            ecommerce: {
                transaction_id: orderId,
                currency: 'BRL',
                value: cartTotal + deliveryFee,
                shipping: deliveryFee,
                payment_type: paymentMethod,
                items: cartItems.map((item, index) => ({
                    item_id: item.id || item.product_id || item.product?.id,
                    item_name: item.name || item.product?.name,
                    item_category: item.category || item.product?.category?.name,
                    price: parseFloat(item.price || item.product?.price || 0),
                    quantity: item.quantity,
                    index: index,
                })),
            },
        });
    }, [pushToDataLayer]);

    return {
        trackPageView,
        trackViewItemList,
        trackViewItem,
        trackAddToCart,
        trackRemoveFromCart,
        trackViewCart,
        trackBeginCheckout,
        trackAddShippingInfo,
        trackPurchase,
    };
};
