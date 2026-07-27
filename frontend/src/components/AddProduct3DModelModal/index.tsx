import { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { ModalContainer, Form, Input, Label, ErrorMessage } from '../../styles/global';
import { PreviewBox, UploadLabel, HiddenFileInput, FileInfo, SelectedProductBox } from './style';
import { Loader } from '../Loader';
import { useSuccessMessage } from '../../contexts/SuccessMessageContext';
import { uploadProduct3DModel } from '../../services/product3dModelService';
import { listProducts } from '../../services/productService';
import { IProduct } from '../../interfaces/IProduct';
import placeholder_products from '../../assets/images/placeholder_products.png';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

interface AddProduct3DModelModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSave: () => void;
}

export function AddProduct3DModelModal({ isOpen, onRequestClose, onSave }: AddProduct3DModelModalProps) {
    const { showSuccess } = useSuccessMessage();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<IProduct[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [error, setError] = useState('');
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        import('@google/model-viewer');
    }, []);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSuggestions([]);
            setShowSuggestions(false);
            setSelectedProduct(null);
            setFile(null);
            setPreviewUrl('');
            setError('');
        }
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchProducts = (text: string) => {
        setQuery(text);
        setError('');

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(async () => {
            const response = await listProducts(1, 20, text);
            setSuggestions(response.data?.products || []);
            setShowSuggestions(true);
        }, 500);
    };

    const handleSelectProduct = (product: IProduct) => {
        setSelectedProduct(product);
        setQuery(product.name);
        setShowSuggestions(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.files?.[0];
        if (!selected) return;

        setError('');

        if (!selected.name.toLowerCase().endsWith('.glb')) {
            setError('Formato inválido. Apenas arquivos .glb são permitidos.');
            return;
        }

        if (selected.size > MAX_FILE_SIZE) {
            setError('O arquivo deve ter no máximo 20MB.');
            return;
        }

        setFile(selected);
        setPreviewUrl(URL.createObjectURL(selected));
    };

    const handleSubmit = async () => {
        if (!selectedProduct) {
            setError('Selecione um produto.');
            return;
        }

        if (!file) {
            setError('Selecione um arquivo .glb para enviar.');
            return;
        }

        setShowLoader(true);
        try {
            await uploadProduct3DModel(selectedProduct.id as string, file);
            showSuccess('Modelo 3D adicionado com sucesso!');
            onSave();
            onRequestClose();
        } catch (err) {
            setError('Erro ao enviar o modelo 3D. Tente novamente.');
        } finally {
            setShowLoader(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <Loader show={showLoader} />
            <button type="button" onClick={onRequestClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark} />
            </button>

            <ModalContainer>
                <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <h2>Adicionar Modelo 3D</h2>

                    {selectedProduct ? (
                        <SelectedProductBox>
                            <div className="info">
                                <img src={selectedProduct.image || placeholder_products} alt={selectedProduct.name} />
                                <h3>{selectedProduct.name}</h3>
                            </div>
                            <button type="button" onClick={() => { setSelectedProduct(null); setQuery(''); }}>
                                Trocar
                            </button>
                        </SelectedProductBox>
                    ) : (
                        <div style={{ position: 'relative', width: '100%' }} ref={wrapperRef}>
                            <Label>Produto<span>*</span></Label>
                            <Input
                                placeholder="Buscar produto pelo nome..."
                                value={query}
                                onChange={(e) => handleSearchProducts(e.target.value)}
                                onFocus={() => query && setShowSuggestions(true)}
                            />

                            {showSuggestions && suggestions.length > 0 && query.length >= 2 && (
                                <ul className="suggestion-box">
                                    {suggestions.map((product) => (
                                        <li key={product.id} onClick={() => handleSelectProduct(product)}>
                                            {product.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {selectedProduct && (
                        <>
                            <HiddenFileInput
                                ref={fileInputRef}
                                type="file"
                                accept=".glb,model/gltf-binary"
                                onChange={handleFileChange}
                            />

                            <PreviewBox onClick={() => fileInputRef.current?.click()}>
                                {previewUrl ? (
                                    <model-viewer
                                        src={previewUrl}
                                        camera-controls
                                        auto-rotate
                                        reveal="auto"
                                    />
                                ) : (
                                    <UploadLabel>
                                        <FontAwesomeIcon icon={faCloudArrowUp} />
                                        <span>Clique para selecionar um arquivo .glb</span>
                                        <span style={{ fontSize: '0.65rem' }}>Máx. 20MB</span>
                                    </UploadLabel>
                                )}
                            </PreviewBox>

                            {file && (
                                <FileInfo>
                                    {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                                </FileInfo>
                            )}
                        </>
                    )}

                    {error && <ErrorMessage>{error}</ErrorMessage>}

                    <button type="submit" className="create-button">
                        Enviar Modelo
                    </button>
                </Form>
            </ModalContainer>
        </Modal>
    );
}
