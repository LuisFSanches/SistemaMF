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
    ImageInfo
} from './style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
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
                    enabled: formData.enabled
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

                    <Switch>
                        <span>
                            {watch("enabled") ? "Ativado" : "Desativado"}
                        </span>
                        <Input id="switch" type="checkbox" defaultChecked placeholder='Ativo' {...register("enabled")}/>
                        <StyledSwitch htmlFor="switch" $checked={watch("enabled")} />
                    </Switch>
                    
                    
                    <button type="submit" className="create-button">
                        {action === "create" ? "Criar" : "Editar"}
                    </button>
                </Form>
            </ModalContainer>
        </Modal>
    )
}
