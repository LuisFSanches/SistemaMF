import { useEffect, useState } from "react";
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { IProduct } from "../../interfaces/IProduct";
import { createProduct, updateProduct } from "../../services/productService";
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

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch
    } = useForm<IProduct>();
    const [showLoader, setShowLoader] = useState(false);

    const handleProduct = async (formData: IProduct) => {
        setShowLoader(true);
        if (action === "create") {
            const { data: adminData } = await createProduct({
                name: formData.name,
                price: formData.price,
                unity: formData.unity,
                stock: formData.stock,
                enabled: formData.enabled,
            });
            addProduct(adminData);
            loadAvailableProducts();
            onRequestClose();
        }

        if (action === "edit") {
            const { data: adminData } = await updateProduct({
                id: currentProduct.id,
                name: formData.name,
                price: formData.price,
                unity: formData.unity,
                stock: formData.stock,
                enabled: formData.enabled
            });
            editProduct(adminData);
            loadAvailableProducts();
            onRequestClose();
        }

        setShowLoader(false);
    }

    useEffect(() => {
        setValue("name", currentProduct.name);
        setValue("price", currentProduct.price || null);
        setValue("unity", currentProduct.unity);
        setValue("stock", currentProduct.stock);
        setValue("enabled", currentProduct.enabled);
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
                    <Input type="number" placeholder='Preço' {...register("price", { required: "Preço inválido" })}/>
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
