import { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { ModalContainer, ErrorMessage } from '../../styles/global';
import { PreviewBox, UploadLabel, HiddenFileInput, FileInfo, ProductInfoBox } from './style';
import { Loader } from '../Loader';
import { useSuccessMessage } from '../../contexts/SuccessMessageContext';
import { uploadProduct3DModel, replaceProduct3DModel } from '../../services/product3dModelService';
import { IProductWith3DModel } from '../../interfaces/IProduct3DModel';
import placeholder_products from '../../assets/images/placeholder_products.png';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

interface Product3DModelModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSave: () => void;
    product: IProductWith3DModel | null;
}

export function Product3DModelModal({ isOpen, onRequestClose, onSave, product }: Product3DModelModalProps) {
    const { showSuccess } = useSuccessMessage();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [error, setError] = useState('');
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        import('@google/model-viewer');
    }, []);

    useEffect(() => {
        if (isOpen) {
            setFile(null);
            setError('');
            setPreviewUrl(product?.model3d?.model_url || '');
        }
    }, [isOpen, product]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.files?.[0];
        if (!selected) return;

        setError('');

        if (!selected.name.toLowerCase().endsWith('.glb')) {
            setError('Formato inválido. Apenas arquivos .glb são permitidos.');
            return;
        }

        if (selected.size > MAX_FILE_SIZE) {
            setError('O arquivo deve ter no máximo 30MB.');
            return;
        }

        setFile(selected);
        setPreviewUrl(URL.createObjectURL(selected));
    };

    const handleSubmit = async () => {
        if (!product || !file) {
            setError('Selecione um arquivo .glb para enviar.');
            return;
        }

        setShowLoader(true);
        try {
            if (product.model3d) {
                await replaceProduct3DModel(product.id, file);
            } else {
                await uploadProduct3DModel(product.id, file);
            }

            showSuccess('Modelo 3D salvo com sucesso!');
            onSave();
            onRequestClose();
        } catch (err) {
            setError('Erro ao enviar o modelo 3D. Tente novamente.');
        } finally {
            setShowLoader(false);
        }
    };

    if (!product) {
        return null;
    }

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
                <h2>{product.model3d ? 'Substituir Modelo 3D' : 'Adicionar Modelo 3D'}</h2>

                <ProductInfoBox>
                    <img src={product.image || placeholder_products} alt={product.name} />
                    <h3>{product.name}</h3>
                </ProductInfoBox>

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
                            <span style={{ fontSize: '0.65rem' }}>Máx. 30MB</span>
                        </UploadLabel>
                    )}
                </PreviewBox>

                {file && (
                    <FileInfo>
                        {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </FileInfo>
                )}

                {error && <ErrorMessage>{error}</ErrorMessage>}

                <button type="button" className="create-button" onClick={handleSubmit}>
                    {product.model3d ? 'Substituir Modelo' : 'Enviar Modelo'}
                </button>
            </ModalContainer>
        </Modal>
    );
}
