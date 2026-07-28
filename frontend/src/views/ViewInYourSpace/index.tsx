import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { listPublic3DModelProducts } from '../../services/product3dModelService';
import { IPublicProductWith3DModel } from '../../interfaces/IProduct3DModel';
import { PageContainer, BackButton, TilesGrid, Tile, TileName, ViewerBox, EmptyState } from './style';

export function ViewInYourSpace() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const requestedIds = (searchParams.get('ids') || '').split(',').filter(Boolean);

    const [products, setProducts] = useState<IPublicProductWith3DModel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        import('@google/model-viewer');
    }, []);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const response = await listPublic3DModelProducts('');
                const all: IPublicProductWith3DModel[] = response.data || [];
                const found = requestedIds
                    .map((id) => all.find((p) => p.id === id))
                    .filter((p): p is IPublicProductWith3DModel => !!p);
                setProducts(found);
            } catch (error) {
                console.error('Failed to load products:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return (
        <PageContainer>
            <BackButton onClick={() => navigate('/simule-seu-ambiente')}>
                <FontAwesomeIcon icon={faArrowLeft} />
                Voltar
            </BackButton>

            {!loading && products.length === 0 && (
                <EmptyState>Nenhum produto encontrado ou sem modelo 3D disponível.</EmptyState>
            )}

            {products.length > 0 && (
                <TilesGrid>
                    {products.map((product) => (
                        <Tile key={product.id}>
                            <TileName>{product.name}</TileName>
                            <ViewerBox>
                                <model-viewer
                                    src={product.model3d.model_url}
                                    camera-controls
                                    auto-rotate
                                    ar
                                    ar-modes="webxr scene-viewer quick-look"
                                    reveal="auto"
                                />
                            </ViewerBox>
                        </Tile>
                    ))}
                </TilesGrid>
            )}
        </PageContainer>
    );
}
