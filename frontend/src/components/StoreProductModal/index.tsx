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
    HiddenFileInput,
    ImageInfo,
    QRCodeContainer,
    QRCodeTitle,
    QRCodeImageBox,
    QRCodeActions,
    QRCodeButton,
    QRCodeInfo,
    SwitchActions
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
import { faXmark, faQrcode, faPrint, faDownload, faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { IProduct } from "../../interfaces/IProduct";
import { createStoreProduct, updateStoreProduct } from "../../services/storeProductService";
import { searchProducts } from "../../services/productService";
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
import { useProducts } from "../../contexts/ProductsContext";
import { useAdminData } from "../../contexts/AuthContext";
import { UNITIES } from "../../constants";
import { Loader } from "../Loader";
import { IStoreProduct } from "../../interfaces/IStoreProduct";
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
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Estados para busca de produtos
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<IProduct[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedParentProduct, setSelectedParentProduct] = useState<IProduct | null>(null);
    
    // Estados para ProductModal
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 100 * 1024) {
                alert("A imagem deve ter no máximo 100KB. Escolha outra imagem por favor.");
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
        setValue("visible_in_store", false);
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

    const handleProduct = async (formData: IStoreProduct) => {
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
                    visible_for_online_store: formData.visible_for_online_store || false,
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
                    stock: formData.stock as number,
                    enabled: formData.enabled,
                    visible_for_online_store: formData.visible_for_online_store || false,
                });

                editProduct(productData);
                showSuccess("Produto atualizado com sucesso!");
                if (adminData.store_id) {
                    await loadData(adminData.store_id);
                }
                onRequestClose();
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
            setValue("visible_in_store", Boolean(currentProduct.visible_in_store));
            
            if (currentProduct.image) {
                setImagePreview(currentProduct.image);
            } else {
                setImagePreview("");
            }
            
            setImageFile(null);
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
            setValue("visible_in_store", false);
            setImagePreview("");
            setImageFile(null);
        }
    }, [currentProduct, setValue, action]);

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
                                    {watch("visible_in_store") ? "Visível para o cliente" : "Oculto para o cliente"}
                                </span>
                                <Input
                                    id="switch-visible"
                                    type="checkbox"
                                    checked={watch("visible_in_store") ?? false}
                                    placeholder='Visível na Loja' 
                                    {...register("visible_in_store")}
                                />
                                <StyledSwitch htmlFor="switch-visible" $checked={watch("visible_in_store") ?? false} />
                            </Switch>
                        </SwitchActions>

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
                                    disabled={action === "create"}
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
                    visible_in_store: false
                }}
            />
        </Modal>
    )
}
