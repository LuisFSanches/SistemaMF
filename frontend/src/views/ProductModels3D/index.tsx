import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash, faEye, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import { DataTable, ColumnDef } from '../../components/DataTable';
import { RowActions, IconButton } from '../../components/DataTable/style';
import { Product3DModelModal } from '../../components/Product3DModelModal';
import { AddProduct3DModelModal } from '../../components/AddProduct3DModelModal';
import { listProducts3DModels, deleteProduct3DModel } from '../../services/product3dModelService';
import { IProductWith3DModel } from '../../interfaces/IProduct3DModel';
import { Container, ProductCell, PreviewModalBox, AddButton } from './styles';
import { PageHeader } from '../../styles/global';
import placeholder_products from '../../assets/images/placeholder_products.png';

export function ProductModels3D() {
    const [products, setProducts] = useState<IProductWith3DModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<IProductWith3DModel | null>(null);
    const [previewProduct, setPreviewProduct] = useState<IProductWith3DModel | null>(null);

    useEffect(() => {
        import('@google/model-viewer');
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const response = await listProducts3DModels(searchTerm);
            setProducts(response.data || []);
        } catch (error) {
            console.error('Failed to load products:', error);
            alert('Erro ao carregar produtos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    const handleOpenModal = (product: IProductWith3DModel) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentProduct(null);
    };

    const handleSave = () => {
        loadProducts();
    };

    const handleDelete = async (product: IProductWith3DModel) => {
        if (window.confirm(`Tem certeza que deseja remover o modelo 3D de ${product.name}?`)) {
            try {
                await deleteProduct3DModel(product.id);
                alert('Modelo 3D removido com sucesso');
                loadProducts();
            } catch (error) {
                console.error('Failed to delete 3d model:', error);
                alert('Erro ao remover modelo 3D');
            }
        }
    };

    const formatFileSize = (bytes: number) => {
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const columns: ColumnDef<IProductWith3DModel>[] = [
        {
            key: 'product',
            header: 'Produto',
            render: (product) => (
                <ProductCell>
                    <img src={product.image || placeholder_products} alt={product.name} />
                    <span>{product.name}</span>
                </ProductCell>
            ),
        },
        {
            key: 'category',
            header: 'Categoria',
            render: (product) => (
                <span>{product.categories?.map((c) => c.category.name).join(', ') || '-'}</span>
            ),
        },
        {
            key: 'filename',
            header: 'Arquivo',
            render: (product) => <span>{product.model3d?.original_filename || '-'}</span>,
        },
        {
            key: 'uploadDate',
            header: 'Enviado em',
            render: (product) => (
                <span>{product.model3d ? moment(product.model3d.created_at).format('DD/MM/YYYY HH:mm') : '-'}</span>
            ),
        },
        {
            key: 'size',
            header: 'Tamanho',
            render: (product) => <span>{product.model3d ? formatFileSize(product.model3d.file_size) : '-'}</span>,
        },
        {
            key: 'actions',
            header: 'Ações',
            render: (product) => (
                <RowActions>
                    <IconButton $tone="view" title="Visualizar modelo 3D" onClick={() => setPreviewProduct(product)}>
                        <FontAwesomeIcon icon={faEye} />
                    </IconButton>
                    <IconButton $tone="edit" title="Substituir modelo" onClick={() => handleOpenModal(product)}>
                        <FontAwesomeIcon icon={faUpload} />
                    </IconButton>
                    <IconButton $tone="delete" title="Remover modelo" onClick={() => handleDelete(product)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                </RowActions>
            ),
        },
    ];

    return (
        <Container>
            <PageHeader>
                <div>
                    <h1>🧊 Modelos 3D dos Produtos</h1>
                </div>
                <AddButton onClick={() => setIsAddModalOpen(true)}>
                    <FontAwesomeIcon icon={faPlus} />
                    Adicionar Modelo 3D
                </AddButton>
            </PageHeader>

            <DataTable
                columns={columns}
                data={products}
                rowKey={(product) => product.id}
                loading={loading}
                searchPlaceholder="Buscar por nome do produto..."
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                emptyTitle="Nenhum modelo 3D cadastrado"
                emptyDescription="Clique em 'Adicionar Modelo 3D' para cadastrar o primeiro modelo."
            />

            <Product3DModelModal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                onSave={handleSave}
                product={currentProduct}
            />

            <AddProduct3DModelModal
                isOpen={isAddModalOpen}
                onRequestClose={() => setIsAddModalOpen(false)}
                onSave={handleSave}
            />

            <Modal
                isOpen={!!previewProduct}
                onRequestClose={() => setPreviewProduct(null)}
                overlayClassName="react-modal-overlay"
                className="react-modal-content"
            >
                <button type="button" onClick={() => setPreviewProduct(null)} className="modal-close">
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                {previewProduct?.model3d && (
                    <PreviewModalBox>
                        <model-viewer
                            src={previewProduct.model3d.model_url}
                            camera-controls
                            auto-rotate
                            reveal="auto"
                        />
                    </PreviewModalBox>
                )}
            </Modal>
        </Container>
    );
}
