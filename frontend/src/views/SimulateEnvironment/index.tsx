import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { listPublic3DModelProducts } from '../../services/product3dModelService';
import { IPublicProductWith3DModel } from '../../interfaces/IProduct3DModel';
import {
    PageContainer,
    Header,
    SearchContainer,
    ProductGrid,
    ProductCard,
    ProductImage,
    ProductInfo,
    ViewButton,
    EmptyState,
} from './style';
import placeholder_products from '../../assets/images/placeholder_products.png';

export function SimulateEnvironment() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<IPublicProductWith3DModel[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const response = await listPublic3DModelProducts(searchTerm);
            setProducts(response.data || []);
        } catch (error) {
            console.error('Failed to load 3d model products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    return (
        <PageContainer>
            <Header>
                <h1>Simule seu Ambiente</h1>
                <p>Escolha um produto e visualize como ele fica no seu espaço</p>
            </Header>

            <SearchContainer>
                <FontAwesomeIcon icon={faSearch} />
                <input
                    type="text"
                    placeholder="Buscar produto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </SearchContainer>

            {!loading && products.length === 0 && (
                <EmptyState>Nenhum produto com modelo 3D disponível no momento.</EmptyState>
            )}

            <ProductGrid>
                {products.map((product) => (
                    <ProductCard key={product.id}>
                        <ProductImage>
                            <img src={product.image || placeholder_products} alt={product.name} />
                        </ProductImage>
                        <ProductInfo>
                            <h3>{product.name}</h3>
                            <span>{product.categories?.map((c) => c.category.name).join(', ') || 'Sem categoria'}</span>
                        </ProductInfo>
                        <ViewButton onClick={() => navigate(`/view-in-your-space/${product.id}`)}>
                            Ver no Seu Espaço
                        </ViewButton>
                    </ProductCard>
                ))}
            </ProductGrid>
        </PageContainer>
    );
}
