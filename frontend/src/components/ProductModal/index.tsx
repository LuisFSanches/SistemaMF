import { useEffect, useState, useRef, useCallback } from "react";
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
    SwitchActions,
    TabsContainer,
    TabsList,
    TabButton,
    TabContent,
    CategoriesContainer,
    CategoryCheckboxList,
    CategoryCheckboxItem,
    SelectedCategoriesPreview,
    CategoriesInfo,
    CategoriesLoadingMessage,
    MultiImageGrid,
    ImageSlot,
    ImageSlotLabel
} from './style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCloudArrowUp, faQrcode, faPrint, faDownload } from "@fortawesome/free-solid-svg-icons";
import { IProduct } from "../../interfaces/IProduct";
import { createProduct, updateProduct, uploadProductImage, uploadProductImage2, uploadProductImage3, deleteProductImage } from "../../services/productService";
import { createStoreProduct } from "../../services/storeProductService";
import { getProductCategories, updateProductCategories } from "../../services/productCategoryService";
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
import { useProducts } from "../../contexts/ProductsContext";
import { useAdminData } from "../../contexts/AuthContext";
import { UNITIES } from "../../constants";
import { Loader } from "../Loader";
import categoryService from "../../services/categoryService";
import { ICategory } from "../../interfaces/ICategory";

interface ProductModalProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
    loadData: (storeId: string) => Promise<void>;
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
    
    // Tabs state
    const [activeTab, setActiveTab] = useState<'basic' | 'image' | 'categories'>('basic');
    
    // Categories state
    const [allCategories, setAllCategories] = useState<ICategory[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 100 * 1024) {
                alert("A imagem deve ter no máximo 100KB. Escolha outra imagem por favor.");
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
            if (file.size > 100 * 1024) {
                alert("A imagem deve ter no máximo 100KB. Escolha outra imagem por favor.");
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
            if (file.size > 100 * 1024) {
                alert("A imagem deve ter no máximo 100KB. Escolha outra imagem por favor.");
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
                await deleteProductImage(currentProduct.id, 'image');
                setImagePreview("");
                setImageFile(null);
                setValue("image", "");
                if (adminData.store_id) {
                    loadAvailableProducts(adminData.store_id, 1, 30, "");
                }
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

    const handleRemoveImage2 = async () => {
        if (currentProduct.id && currentProduct.image_2) {
            try {
                setShowLoader(true);
                await deleteProductImage(currentProduct.id, 'image_2');
                setImagePreview2("");
                setImageFile2(null);
                setValue("image_2", "");
                if (adminData.store_id) {
                    loadAvailableProducts(adminData.store_id, 1, 30, "");
                }
                setShowLoader(false);
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
                await deleteProductImage(currentProduct.id, 'image_3');
                setImagePreview3("");
                setImageFile3(null);
                setValue("image_3", "");
                if (adminData.store_id) {
                    loadAvailableProducts(adminData.store_id, 1, 30, "");
                }
                setShowLoader(false);
            } catch (error) {
                setShowLoader(false);
                alert("Erro ao remover imagem 3");
            }
        } else {
            setImagePreview3("");
            setImageFile3(null);
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

    // Load categories
    const loadCategories = useCallback(async () => {
        setLoadingCategories(true);
        try {
            const categories = await categoryService.getAllCategories();
            setAllCategories(categories);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        } finally {
            setLoadingCategories(false);
        }
    }, []);

    // Load product categories when editing
    const loadProductCategories = useCallback(async (productId: string) => {
        try {
            const productCategories = await getProductCategories(productId);
            const categoryIds = productCategories.map(pc => pc.category_id);
            setSelectedCategories(categoryIds);
        } catch (error) {
            console.error("Erro ao carregar categorias do produto:", error);
        }
    }, []);

    // Toggle category selection
    const toggleCategory = (categoryId: string) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
        } else {
            setSelectedCategories([...selectedCategories, categoryId]);
        }
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

                // Upload sequencial das imagens
                if (productData.id) {
                    if (imageFile) {
                        await uploadProductImage(productData.id, imageFile);
                    }
                    if (imageFile2) {
                        await uploadProductImage2(productData.id, imageFile2);
                    }
                    if (imageFile3) {
                        await uploadProductImage3(productData.id, imageFile3);
                    }
                }

                // Atualizar categorias do produto
                if (selectedCategories.length > 0 && productData.id) {
                    await updateProductCategories(productData.id, selectedCategories);
                }

                // Se for criação e tiver store_id, criar automaticamente o store_product
                if (adminData.store_id && productData.id) {
                    await createStoreProduct({
                        product_id: productData.id,
                        store_id: adminData.store_id,
                        price: parseFloat(formData.price as any) || 0,
                        stock: parseFloat(formData.stock as any) || 0,
                        enabled: formData.enabled,
                        visible_for_online_store: formData.visible_in_store || false,
                    });
                    showSuccess("Produto criado e adicionado à loja com sucesso!");
                } else {
                    showSuccess("Produto criado com sucesso!");
                }

                addProduct(productData);
                
                if (adminData.store_id) {
                    await loadData(adminData.store_id);
                }
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

                // Upload sequencial das imagens
                if (currentProduct.id) {
                    if (imageFile) {
                        await uploadProductImage(currentProduct.id, imageFile);
                    }
                    if (imageFile2) {
                        await uploadProductImage2(currentProduct.id, imageFile2);
                    }
                    if (imageFile3) {
                        await uploadProductImage3(currentProduct.id, imageFile3);
                    }
                }

                // Atualizar categorias do produto
                if (selectedCategories.length > 0 && currentProduct.id) {
                    await updateProductCategories(currentProduct.id, selectedCategories);
                }

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
        setValue("name", currentProduct.name);
        setValue("price", currentProduct.price || null);
        setValue("unity", currentProduct.unity);
        setValue("stock", currentProduct.stock);
        setValue("enabled", Boolean(currentProduct.enabled));
        setValue("visible_in_store", Boolean(currentProduct.visible_in_store));
        
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

        // Load categories when modal opens
        if (isOpen) {
            loadCategories();
            
            // Load product categories if editing
            if (action === "edit" && currentProduct.id) {
                loadProductCategories(currentProduct.id);
            } else {
                setSelectedCategories([]);
            }
            
            // Reset to first tab
            setActiveTab('basic');
        }
    }, [currentProduct, setValue, isOpen, action, loadCategories, loadProductCategories]);

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
                                Imagem
                            </TabButton>
                            <TabButton 
                                type="button"
                                $active={activeTab === 'categories'} 
                                onClick={() => setActiveTab('categories')}
                            >
                                Categorias
                            </TabButton>
                        </TabsList>

                        {activeTab === 'basic' && (
                            <TabContent>
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
                                            </>
                                        ) : (
                                            <ImagePreviewBox onClick={() => fileInputRef.current?.click()}>
                                                <UploadLabel>
                                                    <FontAwesomeIcon icon={faCloudArrowUp} />
                                                    <span>Clique aqui</span>
                                                    <span style={{ fontSize: "0.65rem" }}>Máx. 100KB</span>
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
                                            </>
                                        ) : (
                                            <ImagePreviewBox onClick={() => fileInputRef2.current?.click()}>
                                                <UploadLabel>
                                                    <FontAwesomeIcon icon={faCloudArrowUp} />
                                                    <span>Clique aqui</span>
                                                    <span style={{ fontSize: "0.65rem" }}>Máx. 100KB</span>
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
                                            </>
                                        ) : (
                                            <ImagePreviewBox onClick={() => fileInputRef3.current?.click()}>
                                                <UploadLabel>
                                                    <FontAwesomeIcon icon={faCloudArrowUp} />
                                                    <span>Clique aqui</span>
                                                    <span style={{ fontSize: "0.65rem" }}>Máx. 100KB</span>
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
                            </TabContent>
                        )}

                        {activeTab === 'categories' && (
                            <TabContent>
                                <CategoriesContainer>
                                    {loadingCategories ? (
                                        <CategoriesLoadingMessage>
                                            Carregando categorias...
                                        </CategoriesLoadingMessage>
                                    ) : allCategories.length === 0 ? (
                                        <CategoriesLoadingMessage>
                                            Nenhuma categoria cadastrada. Cadastre categorias antes de associá-las aos produtos.
                                        </CategoriesLoadingMessage>
                                    ) : (
                                        <>
                                            <CategoryCheckboxList>
                                                {allCategories.map(category => (
                                                    <CategoryCheckboxItem key={category.id}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCategories.includes(category.id)}
                                                            onChange={() => toggleCategory(category.id)}
                                                        />
                                                        <span>{category.name}</span>
                                                    </CategoryCheckboxItem>
                                                ))}
                                            </CategoryCheckboxList>

                                            <SelectedCategoriesPreview>
                                                <strong>Categorias Selecionadas:</strong>
                                                {selectedCategories.length > 0 ? (
                                                    <div className="categories-list">
                                                        {selectedCategories.map(catId => {
                                                            const category = allCategories.find(c => c.id === catId);
                                                            return category ? (
                                                                <span key={catId} className="category-badge">
                                                                    {category.name}
                                                                </span>
                                                            ) : null;
                                                        })}
                                                    </div>
                                                ) : (
                                                    <span className="no-categories">Nenhuma categoria selecionada</span>
                                                )}
                                            </SelectedCategoriesPreview>

                                            <CategoriesInfo>
                                                Selecione uma ou mais categorias para classificar este produto
                                            </CategoriesInfo>
                                        </>
                                    )}
                                </CategoriesContainer>
                            </TabContent>
                        )}
                    </TabsContainer>

                    <button type="submit" className="create-button">
                        {action === "create" ? "Criar" : "Editar"}
                    </button>
                </Form>
            </ModalContainer>
        </Modal>
    )
}
