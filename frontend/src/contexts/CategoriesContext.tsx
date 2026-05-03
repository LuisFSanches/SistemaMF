import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import categoryService from '../services/categoryService';
import { ICategory } from '../interfaces/ICategory';

interface CategoriesContextData {
    categories: ICategory[];
    loading: boolean;
    error: string | null;
    refreshCategories: () => Promise<void>;
}

interface CategoriesProviderProps {
    children: ReactNode;
}

const CategoriesContext = createContext<CategoriesContextData>({} as CategoriesContextData);

export function CategoriesProvider({ children }: CategoriesProviderProps) {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cacheExpiry, setCacheExpiry] = useState<number | null>(null);

    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

    const loadCategories = async () => {
        const now = Date.now();
        
        // Verifica se o cache ainda é válido
        if (cacheExpiry && now < cacheExpiry && categories.length > 0) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await categoryService.getAllCategories();
            setCategories(data);
            setCacheExpiry(now + CACHE_DURATION);
        } catch (err) {
            console.error('Erro ao carregar categorias:', err);
            setError('Erro ao carregar categorias');
        } finally {
            setLoading(false);
        }
    };

    const refreshCategories = async () => {
        setCacheExpiry(null); // Invalida o cache
        await loadCategories();
    };

    useEffect(() => {
        loadCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <CategoriesContext.Provider
            value={{
                categories,
                loading,
                error,
                refreshCategories
            }}
        >
            {children}
        </CategoriesContext.Provider>
    );
}

export function useCategories() {
    const context = useContext(CategoriesContext);

    if (!context) {
        throw new Error('useCategories must be used within a CategoriesProvider');
    }

    return context;
}
