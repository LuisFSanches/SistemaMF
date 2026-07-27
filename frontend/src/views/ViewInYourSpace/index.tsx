import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { listPublic3DModelProducts } from '../../services/product3dModelService';
import { IPublicProductWith3DModel } from '../../interfaces/IProduct3DModel';
import { PageContainer, BackButton, ProductName, ViewerBox, EmptyState } from './style';

export function ViewInYourSpace() {
    const navigate = useNavigate();
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<IPublicProductWith3DModel | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        import('@google/model-viewer');
    }, []);

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            try {
                const response = await listPublic3DModelProducts('');
                const found = (response.data || []).find((p: IPublicProductWith3DModel) => p.id === productId);
                setProduct(found || null);
            } catch (error) {
                console.error('Failed to load product:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [productId]);

    return (
        <PageContainer>
            <BackButton onClick={() => navigate('/simule-seu-ambiente')}>
                <FontAwesomeIcon icon={faArrowLeft} />
                Voltar
            </BackButton>

            {!loading && !product && (
                <EmptyState>Produto não encontrado ou sem modelo 3D disponível.</EmptyState>
            )}

            {product && (
                <>
                    <ProductName>{product.name}</ProductName>
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
                </>
            )}
        </PageContainer>
    );
}
