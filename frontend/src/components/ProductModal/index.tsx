import { useEffect, useState, useRef } from "react";
import Modal from 'react-modal';
import { useForm } from "react-hook-form";
import {
    ModalContainer,
    Form,
    Input,
    ErrorMessage,
    Select,
    InlineFormField,
    FormField,
    Switch,
    StyledSwitch
} from '../../styles/global';
import { 
    ImageUploadContainer,
    ImagePreviewBox,
    UploadLabel,
    HiddenFileInput,
    ImageActions,
    ImageActionButton,
    ImageInfo,
    QRCodeContainer,
    QRCodeTitle,
    QRCodeImageBox,
    QRCodeActions,
    QRCodeButton,
    QRCodeInfo,
    SwitchActions
} from './style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCloudArrowUp, faQrcode, faPrint, faDownload } from "@fortawesome/free-solid-svg-icons";
import { IProduct } from "../../interfaces/IProduct";
import { createProduct, updateProduct, uploadProductImage, deleteProductImage } from "../../services/productService";
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
import { useProducts } from "../../contexts/ProductsContext";
import { UNITIES } from "../../constants";
import { Loader } from "../Loader";

interface ProductModalProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
    loadData: () => void;
    action: string;
    currentProduct: IProduct;
}

export function ProductModal({
    isOpen,
    onRequestClose,
    loadData,
    action,
    currentProduct
}:ProductModalProps){
    const { addProduct, editProduct, loadAvailableProducts } = useProducts();
    const { showSuccess } = useSuccessMessage();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch
    } = useForm<IProduct>();
    const [showLoader, setShowLoader] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 100 * 1024) {
                alert("A imagem deve ter no máximo 100KB. Escolha outra imagem por favor.");
            }

            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                alert("Formato inválido. Use JPEG, JPG, PNG.");
                return;
            }

            setImageFile(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = async () => {
        if (currentProduct.id && currentProduct.image) {
            try {
                setShowLoader(true);
                await deleteProductImage(currentProduct.id);
                setImagePreview("");
                setImageFile(null);
                setValue("image", "");
                loadAvailableProducts(1, 400, "");
                setShowLoader(false);
            } catch (error) {
                setShowLoader(false);
                alert("Erro ao remover imagem");
            }
        } else {
            setImagePreview("");
            setImageFile(null);
        }
    };

    const handlePrintQRCode = () => {
        if (!currentProduct.qr_code) return;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>QR Code - ${currentProduct.name}</title>
                        <style>
                            body {
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                min-height: 100vh;
                                margin: 0;
                                font-family: Arial, sans-serif;
                            }
                            img {
                                max-width: 400px;
                                height: auto;
                            }
                            h2 {
                                margin-top: 1rem;
                                text-align: center;
                            }
                            @media print {
                                body {
                                    margin: 2cm;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <img src="${currentProduct.qr_code}" alt="QR Code ${currentProduct.name}" />
                        <h2>${currentProduct.name}</h2>
                        <p>ID: ${currentProduct.id}</p>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
            }, 250);
        }
    };

    const handleDownloadQRCode = () => {
        if (!currentProduct.qr_code) return;

        const link = document.createElement('a');
        link.href = currentProduct.qr_code;
        link.download = `qrcode-${currentProduct.name.replace(/\s+/g, '-').toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleProduct = async (formData: IProduct) => {
        setShowLoader(true);
        try {
            if (action === "create") {
                const { data: productData } = await createProduct({
                    name: formData.name,
                    price: formData.price,
                    unity: formData.unity,
                    stock: formData.stock,
                    enabled: formData.enabled,
                    visible_in_store: formData.visible_in_store,
                });

                if (imageFile && productData.id) {
                    await uploadProductImage(productData.id, imageFile);
                }

                addProduct(productData);
                loadAvailableProducts(1, 400, "");
                showSuccess("Produto criado com sucesso!");
                onRequestClose();
            }

            if (action === "edit") {
                const { data: productData } = await updateProduct({
                    id: currentProduct.id,
                    name: formData.name,
                    price: formData.price,
                    unity: formData.unity,
                    stock: formData.stock,
                    enabled: formData.enabled,
                    visible_in_store: formData.visible_in_store,
                });

                if (imageFile && currentProduct.id) {
                    await uploadProductImage(currentProduct.id, imageFile);
                }

                editProduct(productData);
                loadAvailableProducts(1, 400, "");
                showSuccess("Produto atualizado com sucesso!");
                onRequestClose();
            }

            setShowLoader(false);
        } catch (error) {
            setShowLoader(false);
            alert("Erro ao salvar produto");
        }
    }

    useEffect(() => {
        setValue("name", currentProduct.name);
        setValue("price", currentProduct.price || null);
        setValue("unity", currentProduct.unity);
        setValue("stock", currentProduct.stock);
        setValue("enabled", currentProduct.enabled);
        setValue("visible_in_store", currentProduct.visible_in_store);
        
        if (currentProduct.image) {
            setImagePreview(currentProduct.image);
        } else {
            setImagePreview("");
        }
        
        setImageFile(null);
    }, [currentProduct, setValue]);

    if (!currentProduct) {
        return null;
    }

    return(
        <Modal 
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <Loader show={showLoader} />
            <button type="button" onClick={onRequestClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark}/>
            </button>

            <ModalContainer>
                <Form onSubmit={handleSubmit(handleProduct)}>
                    <h2>{action === "create" ? "Novo" : "Editar"} Produto</h2>
                    <SwitchActions>
                        <Switch>
                            <span>
                                {watch("enabled") ? "Ativado" : "Desativado"}
                            </span>
                            <Input id="switch" type="checkbox" defaultChecked placeholder='Ativo' {...register("enabled")}/>
                            <StyledSwitch htmlFor="switch" $checked={watch("enabled")} />
                        </Switch>

                        <Switch>
                            <span>
                                {watch("visible_in_store") ? "Visível para o cliente" : "Oculto para o cliente"}
                            </span>
                            <Input
                                id="switch-visible"
                                type="checkbox"
                                defaultChecked placeholder='Visível na Loja' {...register("visible_in_store")}/>
                            <StyledSwitch htmlFor="switch-visible" $checked={watch("visible_in_store") ?? false} />
                        </Switch>
                    </SwitchActions>

                    <Input placeholder='Nome' {...register("name", {required: "Nome inválido"})}/>
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    <Input type="number" step="0.01" placeholder='Preço' {...register("price", { required: "Preço inválido" })}/>
                    {errors.price && <ErrorMessage>{errors.price.message}</ErrorMessage>}
                    <InlineFormField fullWidth>
                        <FormField style={{ marginTop: "0px"}}>
                            <Select placeholder='Unidade' {...register("unity", { required: "Unidade invária" })} style={{ height: "4rem" }}>
                                <option value="">Selecione a unidade</option>
                                {Object.entries(UNITIES).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </Select>
                            {errors.unity && <ErrorMessage>{errors.unity.message}</ErrorMessage>}
                        </FormField>

                        <FormField style={{ marginTop: "0px"}}>
                            <Input type="number" placeholder='Estoque'
                                {...register("stock", { required: "Estoque inválido" })}
                                style={{ marginBottom: "0px" }}
                            />
                            {errors.stock && <ErrorMessage>{errors.stock.message}</ErrorMessage>}
                        </FormField>
                    </InlineFormField>

                    <ImageUploadContainer>
                        <HiddenFileInput
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageChange}
                        />

                        {imagePreview ? (
                            <>
                                <ImagePreviewBox>
                                    <img src={imagePreview} alt="Preview" />
                                </ImagePreviewBox>
                                <ImageActions>
                                    <ImageActionButton
                                        type="button"
                                        className="change"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Trocar Imagem
                                    </ImageActionButton>
                                    <ImageActionButton
                                        type="button"
                                        className="remove"
                                        onClick={handleRemoveImage}
                                    >
                                        Remover Imagem
                                    </ImageActionButton>
                                </ImageActions>
                            </>
                        ) : (
                            <ImagePreviewBox onClick={() => fileInputRef.current?.click()}>
                                <UploadLabel>
                                    <FontAwesomeIcon icon={faCloudArrowUp} />
                                    <span>Clique para selecionar uma imagem</span>
                                    <span style={{ fontSize: "0.75rem" }}>JPEG, JPG, PNG (máx. 100KB)</span>
                                </UploadLabel>
                            </ImagePreviewBox>
                        )}
                        
                        {imageFile && (
                            <ImageInfo>
                                Arquivo selecionado: {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                            </ImageInfo>
                        )}
                    </ImageUploadContainer>

                    {action === "edit" && currentProduct.qr_code && (
                        <QRCodeContainer>
                            <QRCodeTitle>
                                <FontAwesomeIcon icon={faQrcode as any} />
                                QR Code do Produto
                            </QRCodeTitle>
                            <QRCodeImageBox>
                                <img src={currentProduct.qr_code} alt={`QR Code - ${currentProduct.name}`} />
                            </QRCodeImageBox>
                            <QRCodeInfo>
                                Use este QR Code para adicionar o produto rapidamente ao pedido
                            </QRCodeInfo>
                            <QRCodeActions>
                                <QRCodeButton
                                    type="button"
                                    className="print"
                                    onClick={handlePrintQRCode}
                                >
                                    <FontAwesomeIcon icon={faPrint as any} />
                                    Imprimir QR Code
                                </QRCodeButton>
                                <QRCodeButton
                                    type="button"
                                    className="download"
                                    onClick={handleDownloadQRCode}
                                >
                                    <FontAwesomeIcon icon={faDownload as any} />
                                    Baixar QR Code
                                </QRCodeButton>
                            </QRCodeActions>
                        </QRCodeContainer>
                    )}
                    <button type="submit" className="create-button">
                        {action === "create" ? "Criar" : "Editar"}
                    </button>
                </Form>
            </ModalContainer>
        </Modal>
    )
}
