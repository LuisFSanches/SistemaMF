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
    StyledSwitch,
    Textarea
} from '../../styles/global';
import { 
    ImageUploadContainer,
    ImagePreviewBox,
    HiddenFileInput,
    ImageInfo,
    GlobalImageBadge,
    QRCodeContainer,
    QRCodeTitle,
    QRCodeImageBox,
    QRCodeActions,
    QRCodeButton,
    QRCodeInfo,
    SwitchActions,
    TabsContainer,
    TabsList,
    TabButton,
    TabContent,
    MultiImageGrid,
    ImageSlot,
    ImageSlotLabel,
    ImageActions,
    ImageActionButton,
    SyncConfirmationModal,
    SyncConfirmationBox,
    SyncConfirmationActions
} from './style';
import { 
    SearchContainer,
    SearchInput,
    SearchResults,
    ProductSearchItem,
    ProductSearchImage,
    ProductSearchInfo,
    NoResultsMessage,
    CreateNewProductButton,
    ValidationWarning
} from './style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faQrcode, faPrint, faDownload, faSearch, faPlus, faCloudArrowUp, faInfoCircle, faBox } from "@fortawesome/free-solid-svg-icons";
import { UploadLabel } from './style';
import { IProduct } from "../../interfaces/IProduct";
import { createStoreProduct, updateStoreProduct, uploadStoreProductImage, uploadStoreProductImage2, uploadStoreProductImage3, deleteStoreProductImage, syncStoreProductImageToGlobal } from "../../services/storeProductService";
import { searchProducts } from "../../services/productService";
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
import { useProducts } from "../../contexts/ProductsContext";
import { useAdminData } from "../../contexts/AuthContext";
import { UNITIES } from "../../constants";
import { Loader } from "../Loader";
import { ProductModal } from "../ProductModal";
import placeholder_products from "../../assets/images/placeholder_products.png";

interface StoreProductModalProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
    loadData: (storeId: string) => Promise<void>;
    action: string;
    currentProduct: IProduct;
}

export function StoreProductModal({
    isOpen,
    onRequestClose,
    loadData,
    action,
    currentProduct
}:StoreProductModalProps){
    const { addProduct, editProduct } = useProducts();
    const { showSuccess } = useSuccessMessage();
    const { adminData } = useAdminData();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch
    } = useForm<IProduct>();
    const [showLoader, setShowLoader] = useState(false);
    
    // Estados para as 3 imagens
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [imageFile2, setImageFile2] = useState<File | null>(null);
    const [imagePreview2, setImagePreview2] = useState<string>("");
    const fileInputRef2 = useRef<HTMLInputElement>(null);
    
    const [imageFile3, setImageFile3] = useState<File | null>(null);
    const [imagePreview3, setImagePreview3] = useState<string>("");
    const fileInputRef3 = useRef<HTMLInputElement>(null);
    
    // Estados para busca de produtos
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<IProduct[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedParentProduct, setSelectedParentProduct] = useState<IProduct | null>(null);
    
    // Estados para ProductModal
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    
    // Tabs state
    const [activeTab, setActiveTab] = useState<'basic' | 'image' | 'qrcode'>('basic');
    
    // Sync confirmation state
    const [syncConfirmation, setSyncConfirmation] = useState<{
        show: boolean;
        imageFields: Array<'image' | 'image_2' | 'image_3'>;
        parentProduct: IProduct | null;
    }>({
        show: false,
        imageFields: [],
        parentProduct: null
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 150 * 1024) {
                alert("A imagem deve ter no máximo 150KB. Escolha outra imagem por favor.");
                return;
            }

            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert("Formato inválido. Use JPEG, JPG, PNG, WEBP.");
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

    const handleImageChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 150 * 1024) {
                alert("A imagem deve ter no máximo 150KB. Escolha outra imagem por favor.");
                return;
            }

            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert("Formato inválido. Use JPEG, JPG, PNG, WEBP.");
                return;
            }

            setImageFile2(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview2(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 150 * 1024) {
                alert("A imagem deve ter no máximo 150KB. Escolha outra imagem por favor.");
                return;
            }

            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert("Formato inválido. Use JPEG, JPG, PNG, WEBP.");
                return;
            }

            setImageFile3(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview3(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = async () => {
        if (currentProduct.id && currentProduct.image) {
            try {
                setShowLoader(true);
                await deleteStoreProductImage(currentProduct.id, 'image');
                setImagePreview("");
                setImageFile(null);
                setValue("image", "");
                if (adminData.store_id) {
                    await loadData(adminData.store_id);
                }
                setShowLoader(false);
                showSuccess("Imagem removida com sucesso!");
            } catch (error) {
                setShowLoader(false);
                alert("Erro ao remover imagem");
            }
        } else {
            setImagePreview("");
            setImageFile(null);
        }
    };

    const handleRemoveImage2 = async () => {
        if (currentProduct.id && currentProduct.image_2) {
            try {
                setShowLoader(true);
                await deleteStoreProductImage(currentProduct.id, 'image_2');
                setImagePreview2("");
                setImageFile2(null);
                setValue("image_2", "");
                if (adminData.store_id) {
                    await loadData(adminData.store_id);
                }
                setShowLoader(false);
                showSuccess("Imagem 2 removida com sucesso!");
            } catch (error) {
                setShowLoader(false);
                alert("Erro ao remover imagem 2");
            }
        } else {
            setImagePreview2("");
            setImageFile2(null);
        }
    };

    const handleRemoveImage3 = async () => {
        if (currentProduct.id && currentProduct.image_3) {
            try {
                setShowLoader(true);
                await deleteStoreProductImage(currentProduct.id, 'image_3');
                setImagePreview3("");
                setImageFile3(null);
                setValue("image_3", "");
                if (adminData.store_id) {
                    await loadData(adminData.store_id);
                }
                setShowLoader(false);
                showSuccess("Imagem 3 removida com sucesso!");
            } catch (error) {
                setShowLoader(false);
                alert("Erro ao remover imagem 3");
            }
        } else {
            setImagePreview3("");
            setImageFile3(null);
        }
    };

    const handleSyncImageToGlobal = async (imageFields: Array<'image' | 'image_2' | 'image_3'>) => {
        if (!currentProduct.id || imageFields.length === 0) return;

        try {
            setShowLoader(true);
            
            // Sincronizar todas as imagens sequencialmente
            for (const imageField of imageFields) {
                await syncStoreProductImageToGlobal(currentProduct.id, imageField);
            }
            
            setShowLoader(false);
            const message = imageFields.length === 1 
                ? "Imagem sincronizada com o catálogo global com sucesso!"
                : `${imageFields.length} imagens sincronizadas com o catálogo global com sucesso!`;
            showSuccess(message);
            setSyncConfirmation({ show: false, imageFields: [], parentProduct: null });
            onRequestClose();
        } catch (error: any) {
            setShowLoader(false);
            const errorMessage = error.response?.data?.message || "Erro ao sincronizar imagem";
            alert(errorMessage);
            setSyncConfirmation({ show: false, imageFields: [], parentProduct: null });
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

    const handleSelectParentProduct = (product: IProduct) => {
        setSelectedParentProduct(product);
        setValue("name", product.name);
        setValue("price", product.price);
        setValue("unity", product.unity);
        setValue("stock", 0);
        setValue("enabled", true);
        setValue("visible_for_online_store", false);
        setImagePreview(product.image || "");
    };

    const handleCreateNewProduct = () => {
        setIsProductModalOpen(true);
    };

    const handleProductModalClose = () => {
        setIsProductModalOpen(false);
    };

    const handleAfterProductCreated = async (storeId: string) => {
        // Recarrega os dados após criar o produto pai
        await loadData(storeId);
        setIsProductModalOpen(false);
    };

    const handleProduct = async (formData: IProduct) => {
        setShowLoader(true);
        console.log('formData', formData); 
        try {
            if (action === "create") {
                if (!selectedParentProduct) {
                    alert("Selecione um produto do catálogo global");
                    setShowLoader(false);
                    return;
                }

                const { data: productData } = await createStoreProduct({
                    product_id: selectedParentProduct.id as string,
                    store_id: adminData.store_id as string,
                    price: parseFloat(formData.price as any) as number,
                    stock: parseFloat(formData.stock as any) as number,
                    enabled: formData.enabled,
                    visible_for_online_store: formData.visible_for_online_store ?? false,
                });

                addProduct(productData);
                showSuccess("Produto adicionado à loja com sucesso!");
                if (adminData.store_id) {
                    await loadData(adminData.store_id);
                }
                onRequestClose();
            }

            if (action === "edit") {
                const { data: productData } = await updateStoreProduct({
                    id: currentProduct.id as string,
                    price: parseFloat(formData.price as any) as number,
                    stock: parseFloat(formData.stock as any) as number,
                    enabled: formData.enabled,
                    visible_for_online_store: formData.visible_for_online_store ?? false,
                    description: formData.description || undefined,
                });

                // Upload sequencial das imagens se houver novos arquivos
                const uploadedImageFields: Array<'image' | 'image_2' | 'image_3'> = [];

                if (currentProduct.id) {
                    if (imageFile) {
                        await uploadStoreProductImage(currentProduct.id, imageFile);
                        uploadedImageFields.push('image');
                    }
                    if (imageFile2) {
                        await uploadStoreProductImage2(currentProduct.id, imageFile2);
                        uploadedImageFields.push('image_2');
                    }
                    if (imageFile3) {
                        await uploadStoreProductImage3(currentProduct.id, imageFile3);
                        uploadedImageFields.push('image_3');
                    }
                }

                editProduct(productData);
                showSuccess("Produto atualizado com sucesso!");
                
                if (adminData.store_id) {
                    await loadData(adminData.store_id);
                }

                // Verificar se deve mostrar modal de sincronização
                // Mostra modal para todas as imagens enviadas nesta sessão
                if (uploadedImageFields.length > 0) {
                    setSyncConfirmation({
                        show: true,
                        imageFields: uploadedImageFields,
                        parentProduct: { name: currentProduct.name } as IProduct
                    });
                } else {
                    onRequestClose();
                }
            }

            setShowLoader(false);
        } catch (error) {
            setShowLoader(false);
            alert("Erro ao salvar produto");
        }
    }

    useEffect(() => {
        if (action === "edit") {
            setValue("name", currentProduct.name);
            setValue("price", currentProduct.price || null);
            setValue("unity", currentProduct.unity);
            setValue("stock", currentProduct.stock);
            setValue("enabled", Boolean(currentProduct.enabled));
            setValue("visible_for_online_store", Boolean(currentProduct.visible_for_online_store));
            setValue("description", currentProduct.description || "");
            
            // Carregar preview das 3 imagens
            if (currentProduct.image) {
                setImagePreview(currentProduct.image);
            } else {
                setImagePreview("");
            }
            
            if (currentProduct.image_2) {
                setImagePreview2(currentProduct.image_2);
            } else {
                setImagePreview2("");
            }
            
            if (currentProduct.image_3) {
                setImagePreview3(currentProduct.image_3);
            } else {
                setImagePreview3("");
            }
            
            // Resetar arquivos selecionados
            setImageFile(null);
            setImageFile2(null);
            setImageFile3(null);
        } else {
            // Reset para criação
            setSearchQuery("");
            setSearchResults([]);
            setSelectedParentProduct(null);
            setValue("name", "");
            setValue("price", null);
            setValue("unity", "");
            setValue("stock", 0);
            setValue("enabled", true);
            setValue("visible_for_online_store", false);
            setImagePreview("");
            setImagePreview2("");
            setImagePreview3("");
            setImageFile(null);
            setImageFile2(null);
            setImageFile3(null);
        }
        
        // Reset to first tab when modal opens
        if (isOpen) {
            setActiveTab('basic');
        }
    }, [currentProduct, setValue, action, isOpen]);

    // Debounce para busca de produtos
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const debounceTimer = setTimeout(async () => {
            try {
                const { data } = await searchProducts(searchQuery);
                setSearchResults(data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 2000);

        return () => {
            clearTimeout(debounceTimer);
        };
    }, [searchQuery]);

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
                {action === "create" && !selectedParentProduct ? (
                    <>
                        <h2>Adicionar Produto à Loja</h2>
                        <SearchContainer>
                            <FontAwesomeIcon icon={faSearch as any} />
                            <SearchInput
                                type="text"
                                placeholder="Buscar produto no catálogo global..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </SearchContainer>

                        {isSearching && <p style={{ textAlign: 'center', margin: '1rem 0' }}>Buscando...</p>}

                        {!isSearching && searchQuery && searchResults.length === 0 && (
                            <>
                                <NoResultsMessage>
                                    Nenhum produto do catálogo global foi encontrado com o termo "{searchQuery}".
                                    <br />
                                    <strong>Crie um novo produto no catálogo global para adicioná-lo à sua loja.</strong>
                                </NoResultsMessage>
                                <ValidationWarning>
                                    ⚠️ O produto criado será validado pela nossa equipe.
                                </ValidationWarning>
                                <CreateNewProductButton type="button" onClick={handleCreateNewProduct}>
                                    <FontAwesomeIcon icon={faPlus as any} />
                                    Criar Novo Produto
                                </CreateNewProductButton>
                            </>
                        )}

                        {searchResults.length > 0 && (
                            <SearchResults>
                                {searchResults.map((product) => (
                                    <ProductSearchItem
                                        key={product.id}
                                        onClick={() => handleSelectParentProduct(product)}
                                    >
                                        <ProductSearchImage>
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} />
                                            ) : (
                                                <img src={placeholder_products} alt="Placeholder" />
                                            )}
                                        </ProductSearchImage>
                                        <ProductSearchInfo>
                                            <h3>{product.name}</h3>
                                            <p>
                                                Preço: R$ {product.price?.toFixed(2)} | 
                                                Unidade: {UNITIES[product.unity as keyof typeof UNITIES]}
                                            </p>
                                        </ProductSearchInfo>
                                    </ProductSearchItem>
                                ))}
                            </SearchResults>
                        )}
                    </>
                ) : (
                    <Form onSubmit={handleSubmit(handleProduct)}>
                        <h2>{action === "create" ? "Configurar Produto para sua Loja" : "Editar Produto"}</h2>
                        
                        {action === "create" && selectedParentProduct && (
                            <div style={{ 
                                background: 'var(--background)', 
                                padding: '1rem', 
                                borderRadius: '8px', 
                                marginBottom: '1rem',
                                border: '1px solid var(--border-color)'
                            }}>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                                    <strong>Produto selecionado:</strong> {selectedParentProduct.name}
                                </p>
                                <button 
                                    type="button" 
                                    onClick={() => setSelectedParentProduct(null)}
                                    style={{ 
                                        marginTop: '0.5rem', 
                                        padding: '0.5rem 1rem', 
                                        background: 'transparent',
                                        border: '1px solid var(--primary-color)',
                                        color: 'var(--primary-color)',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    Escolher outro produto
                                </button>
                            </div>
                        )}

                        <SwitchActions>
                            <Switch>
                                <span>
                                    {watch("enabled") ? "Ativado" : "Desativado"}
                                </span>
                                <Input 
                                    id="switch" 
                                    type="checkbox" 
                                    checked={watch("enabled")}
                                    placeholder='Ativo' 
                                    {...register("enabled")}
                                />
                                <StyledSwitch htmlFor="switch" $checked={watch("enabled")} />
                            </Switch>

                            <Switch>
                                <span>
                                    {watch("visible_for_online_store") ? "Visível para o cliente" : "Oculto para o cliente"}
                                </span>
                                <Input
                                    id="switch-visible"
                                    type="checkbox"
                                    checked={watch("visible_for_online_store") ?? false}
                                    placeholder='Visível na Loja' 
                                    {...register("visible_for_online_store")}
                                />
                                <StyledSwitch htmlFor="switch-visible" $checked={watch("visible_for_online_store") ?? false} />
                            </Switch>
                        </SwitchActions>

                        {action === "edit" ? (
                            <TabsContainer>
                                <TabsList>
                                    <TabButton 
                                        type="button"
                                        $active={activeTab === 'basic'} 
                                        onClick={() => setActiveTab('basic')}
                                    >
                                        Dados Básicos
                                    </TabButton>
                                    <TabButton 
                                        type="button"
                                        $active={activeTab === 'image'} 
                                        onClick={() => setActiveTab('image')}
                                    >
                                        Imagens
                                    </TabButton>
                                    <TabButton 
                                        type="button"
                                        $active={activeTab === 'qrcode'} 
                                        onClick={() => setActiveTab('qrcode')}
                                    >
                                        QR Code
                                    </TabButton>
                                </TabsList>

                                {activeTab === 'basic' && (
                                    <TabContent>
                                        <Input 
                                            placeholder='Nome' 
                                            {...register("name", {required: "Nome inválido"})}
                                            disabled={true}
                                        />
                                        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                                        <Input type="number" step="0.01" placeholder='Preço' {...register("price", { required: "Preço inválido" })}/>
                                        {errors.price && <ErrorMessage>{errors.price.message}</ErrorMessage>}
                                        <InlineFormField fullWidth>
                                            <FormField style={{ marginTop: "0px"}}>
                                                <Select 
                                                    placeholder='Unidade' 
                                                    {...register("unity", { required: "Unidade invária" })} 
                                                    style={{ height: "4rem" }}
                                                    disabled={true}
                                                >
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
                                        <Textarea 
                                            placeholder='Descrição do produto' 
                                            rows={5}
                                            {...register("description")}
                                        />
                                        {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
                                        {(currentProduct.is_description_from_parent && currentProduct.description) && (
                                            <GlobalImageBadge style={{ marginTop: '0px' }}>
                                                <FontAwesomeIcon icon={faBox} />
                                                Descrição do catálogo global
                                            </GlobalImageBadge>
                                        )}
                                    </TabContent>
                                )}

                                {activeTab === 'image' && (
                                    <TabContent>
                                        <MultiImageGrid>
                                            {/* Imagem 1 - Principal */}
                                            <ImageSlot>
                                                <ImageSlotLabel>
                                                    Imagem 1 <span className="badge">Principal</span>
                                                </ImageSlotLabel>
                                                <HiddenFileInput
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                                    onChange={handleImageChange}
                                                />
                                                {imagePreview ? (
                                                    <>
                                                        <ImagePreviewBox>
                                                            <img src={imagePreview} alt="Preview 1" />
                                                        </ImagePreviewBox>
                                                        {currentProduct.is_image_from_parent ? (
                                                            <>
                                                                <GlobalImageBadge>
                                                                    <FontAwesomeIcon icon={faBox} />
                                                                    Imagem do catálogo global
                                                                </GlobalImageBadge>
                                                                <ImageActions>
                                                                    <ImageActionButton
                                                                        type="button"
                                                                        className="change"
                                                                        onClick={() => fileInputRef.current?.click()}
                                                                    >
                                                                        Adicionar imagem personalizada
                                                                    </ImageActionButton>
                                                                </ImageActions>
                                                            </>
                                                        ) : (
                                                            <ImageActions>
                                                                <ImageActionButton
                                                                    type="button"
                                                                    className="change"
                                                                    onClick={() => fileInputRef.current?.click()}
                                                                >
                                                                    Trocar
                                                                </ImageActionButton>
                                                                <ImageActionButton
                                                                    type="button"
                                                                    className="remove"
                                                                    onClick={handleRemoveImage}
                                                                >
                                                                    Remover
                                                                </ImageActionButton>
                                                            </ImageActions>
                                                        )}
                                                    </>
                                                ) : (
                                                    <ImagePreviewBox onClick={() => fileInputRef.current?.click()}>
                                                        <UploadLabel>
                                                            <FontAwesomeIcon icon={faCloudArrowUp} />
                                                            <span>Clique aqui</span>
                                                            <span style={{ fontSize: "0.65rem" }}>Máx. 150KB</span>
                                                        </UploadLabel>
                                                    </ImagePreviewBox>
                                                )}
                                                {imageFile && (
                                                    <ImageInfo>
                                                        {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                                                    </ImageInfo>
                                                )}
                                            </ImageSlot>

                                            {/* Imagem 2 */}
                                            <ImageSlot>
                                                <ImageSlotLabel>
                                                    Imagem 2
                                                </ImageSlotLabel>
                                                <HiddenFileInput
                                                    ref={fileInputRef2}
                                                    type="file"
                                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                                    onChange={handleImageChange2}
                                                />
                                                {imagePreview2 ? (
                                                    <>
                                                        <ImagePreviewBox>
                                                            <img src={imagePreview2} alt="Preview 2" />
                                                        </ImagePreviewBox>
                                                        {currentProduct.is_image_2_from_parent ? (
                                                            <>
                                                                <GlobalImageBadge>
                                                                    <FontAwesomeIcon icon={faBox} />
                                                                    Imagem do catálogo global
                                                                </GlobalImageBadge>
                                                                <ImageActions>
                                                                    <ImageActionButton
                                                                        type="button"
                                                                        className="change"
                                                                        onClick={() => fileInputRef2.current?.click()}
                                                                    >
                                                                        Adicionar imagem personalizada
                                                                    </ImageActionButton>
                                                                </ImageActions>
                                                            </>
                                                        ) : (
                                                            <ImageActions>
                                                                <ImageActionButton
                                                                    type="button"
                                                                    className="change"
                                                                    onClick={() => fileInputRef2.current?.click()}
                                                                >
                                                                    Trocar
                                                                </ImageActionButton>
                                                                <ImageActionButton
                                                                    type="button"
                                                                    className="remove"
                                                                    onClick={handleRemoveImage2}
                                                                >
                                                                    Remover
                                                                </ImageActionButton>
                                                            </ImageActions>
                                                        )}
                                                    </>
                                                ) : (
                                                    <ImagePreviewBox onClick={() => fileInputRef2.current?.click()}>
                                                        <UploadLabel>
                                                            <FontAwesomeIcon icon={faCloudArrowUp} />
                                                            <span>Clique aqui</span>
                                                            <span style={{ fontSize: "0.65rem" }}>Máx. 150KB</span>
                                                        </UploadLabel>
                                                    </ImagePreviewBox>
                                                )}
                                                {imageFile2 && (
                                                    <ImageInfo>
                                                        {imageFile2.name} ({(imageFile2.size / 1024).toFixed(2)} KB)
                                                    </ImageInfo>
                                                )}
                                            </ImageSlot>

                                            {/* Imagem 3 */}
                                            <ImageSlot>
                                                <ImageSlotLabel>
                                                    Imagem 3
                                                </ImageSlotLabel>
                                                <HiddenFileInput
                                                    ref={fileInputRef3}
                                                    type="file"
                                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                                    onChange={handleImageChange3}
                                                />
                                                {imagePreview3 ? (
                                                    <>
                                                        <ImagePreviewBox>
                                                            <img src={imagePreview3} alt="Preview 3" />
                                                        </ImagePreviewBox>
                                                        {currentProduct.is_image_3_from_parent ? (
                                                            <>
                                                                <GlobalImageBadge>
                                                                    <FontAwesomeIcon icon={faBox} />
                                                                    Imagem do catálogo global
                                                                </GlobalImageBadge>
                                                                <ImageActions>
                                                                    <ImageActionButton
                                                                        type="button"
                                                                        className="change"
                                                                        onClick={() => fileInputRef3.current?.click()}
                                                                    >
                                                                        Adicionar imagem personalizada
                                                                    </ImageActionButton>
                                                                </ImageActions>
                                                            </>
                                                        ) : (
                                                            <ImageActions>
                                                                <ImageActionButton
                                                                    type="button"
                                                                    className="change"
                                                                    onClick={() => fileInputRef3.current?.click()}
                                                                >
                                                                    Trocar
                                                                </ImageActionButton>
                                                                <ImageActionButton
                                                                    type="button"
                                                                    className="remove"
                                                                    onClick={handleRemoveImage3}
                                                                >
                                                                    Remover
                                                                </ImageActionButton>
                                                            </ImageActions>
                                                        )}
                                                    </>
                                                ) : (
                                                    <ImagePreviewBox onClick={() => fileInputRef3.current?.click()}>
                                                        <UploadLabel>
                                                            <FontAwesomeIcon icon={faCloudArrowUp} />
                                                            <span>Clique aqui</span>
                                                            <span style={{ fontSize: "0.65rem" }}>Máx. 150KB</span>
                                                        </UploadLabel>
                                                    </ImagePreviewBox>
                                                )}
                                                {imageFile3 && (
                                                    <ImageInfo>
                                                        {imageFile3.name} ({(imageFile3.size / 1024).toFixed(2)} KB)
                                                    </ImageInfo>
                                                )}
                                            </ImageSlot>
                                        </MultiImageGrid>
                                    </TabContent>
                                )}

                                {activeTab === 'qrcode' && (
                                    <TabContent>
                                        {currentProduct.qr_code ? (
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
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                                                Este produto ainda não possui QR Code
                                            </div>
                                        )}
                                    </TabContent>
                                )}
                            </TabsContainer>
                        ) : (
                            <>
                                {/* Form fields for create mode */}
                                <Input 
                                    placeholder='Nome' 
                                    {...register("name", {required: "Nome inválido"})}
                                    disabled={action === "create"}
                                />
                                {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                                <Input type="number" step="0.01" placeholder='Preço' {...register("price", { required: "Preço inválido" })}/>
                                {errors.price && <ErrorMessage>{errors.price.message}</ErrorMessage>}
                                <InlineFormField fullWidth>
                                    <FormField style={{ marginTop: "0px"}}>
                                        <Select 
                                            placeholder='Unidade' 
                                            {...register("unity", { required: "Unidade invária" })} 
                                            style={{ height: "4rem" }}
                                            disabled={true}
                                        >
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
                                        disabled
                                    />

                                    {imagePreview ? (
                                        <>
                                            <ImagePreviewBox>
                                                <img src={imagePreview} alt="Preview" />
                                            </ImagePreviewBox>
                                        </>
                                    ) : (
                                        <ImagePreviewBox style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                                            <img src={placeholder_products} alt="Placeholder" />
                                        </ImagePreviewBox>
                                    )}
                                    
                                    {imageFile && (
                                        <ImageInfo>
                                            Arquivo selecionado: {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                                        </ImageInfo>
                                    )}
                                </ImageUploadContainer>
                            </>
                        )}

                        <button type="submit" className="create-button">
                            {action === "create" ? "Adicionar à Loja" : "Editar"}
                        </button>
                    </Form>
                )}
            </ModalContainer>

            {/* Modal para criar produto pai */}
            <ProductModal
                isOpen={isProductModalOpen}
                onRequestClose={handleProductModalClose}
                loadData={handleAfterProductCreated}
                action="create"
                currentProduct={{
                    id: "",
                    name: "",
                    price: null,
                    unity: "",
                    stock: 0,
                    enabled: true,
                    visible_for_online_store: false
                }}
            />

            {/* Sync Confirmation Modal */}
            {syncConfirmation.show && (
                <SyncConfirmationModal onClick={() => setSyncConfirmation({ show: false, imageFields: [], parentProduct: null })}>
                    <SyncConfirmationBox onClick={(e) => e.stopPropagation()}>
                        <h3>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Sincronizar com Catálogo Global?
                        </h3>
                        <p>
                            Você adicionou <strong>{syncConfirmation.imageFields.length}</strong> {syncConfirmation.imageFields.length === 1 ? 'imagem' : 'imagens'} ao produto <strong>{syncConfirmation.parentProduct?.name}</strong>.
                        </p>
                        <p>
                            Podemos usar {syncConfirmation.imageFields.length === 1 ? 'esta imagem' : 'estas imagens'} no catálogo global? Isso permitirá que outras lojas também vejam 
                            {syncConfirmation.imageFields.length === 1 ? ' esta imagem' : ' estas imagens'} quando adicionarem este produto e nos ajudará a manter o catálogo atualizado para todos os lojistas.
                        </p>
                        <SyncConfirmationActions>
                            <button 
                                type="button" 
                                className="cancel"
                                onClick={() => {
                                    setSyncConfirmation({ show: false, imageFields: [], parentProduct: null });
                                    onRequestClose();
                                }}
                            >
                                Não, manter apenas na minha loja
                            </button>
                            <button 
                                type="button" 
                                className="confirm"
                                onClick={() => {
                                    if (syncConfirmation.imageFields.length > 0) {
                                        handleSyncImageToGlobal(syncConfirmation.imageFields);
                                    }
                                }}
                            >
                                Sim, sincronizar {syncConfirmation.imageFields.length > 1 ? `todas as ${syncConfirmation.imageFields.length} imagens` : 'imagem'}
                            </button>
                        </SyncConfirmationActions>
                    </SyncConfirmationBox>
                </SyncConfirmationModal>
            )}
        </Modal>
    )
}
