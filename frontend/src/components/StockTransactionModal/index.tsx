import { useState, useRef, useEffect } from "react";
import Modal from 'react-modal';
import { useForm } from "react-hook-form";
import { ModalContainer, Form, Input, InlineFormField, Label, EditFormField, ErrorMessage } from '../../styles/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { searchProducts } from "../../services/productService";
import { createStockTransaction } from "../../services/stockTransactionService";
import { Loader } from "../../components/Loader";
import { UNITIES } from "../../constants";
import { ProductModal } from "../../components/ProductModal";

interface StockTransactionModalProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
    loadData: () => void;
    action: string;
}

interface IStockTransaction {
    supplier: string;
    unity: string;
    quantity: number;
    unity_price: number;
    total_price: number;
    purchased_date: string;
    box_value: number;
    box_unities: number;
}
export function StockTransactionModal({
    isOpen,
    onRequestClose,
    loadData,
    action,
}:StockTransactionModalProps){
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors },
        watch
    } = useForm<IStockTransaction>();
    const [showLoader, setShowLoader] = useState(false);
    const [query, setQuery] = useState('');
    const [productSuggestions, setProductSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [productError, setProductError] = useState('');
    const [productModal, setProductModal] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleSearchProducts = (text: string) => {
        setQuery(text);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        
        debounceTimeout.current = setTimeout(async () => {
            if (text.length >= 2) {
                const response = await searchProducts(text);
                setProductSuggestions(response.data as any);
                setShowSuggestions(true);
            }
        }, 700);
    };

    const handleSelectProduct = (product: any) => {
        setSelectedProduct(product);
        setQuery(product.name);
        setShowSuggestions(false);
    };

    const handleStockTransaction = async (formData: IStockTransaction) => {
        if (formData.quantity === 0 || formData.unity_price === 0 || formData.total_price === 0) {
            if (formData.quantity === 0) {
                setError("quantity", {
                    type: "required",
                    message: "Quantidade é obrigatório",
                });
            } else if (formData.unity_price === 0) {
                setError("unity_price", {
                    type: "required",
                    message: "Preço é obrigatório",
                });
            } else if (formData.total_price === 0) {
                setError("total_price", {
                    type: "required",
                    message: "Total é obrigatório",
                });
            }
            return;
        }

        else if (!selectedProduct) {
            setProductError("Produto é obrigatório");
            return;
        }
        try {
            setShowLoader(true);
                const data = {
                product_id: selectedProduct.id,
                ...formData
            }

            await createStockTransaction(data);
            setShowLoader(false);
            onRequestClose();
            loadData();
        } catch(error) {
            setShowLoader(false);
        }
    }

    useEffect(() => {
        setValue("supplier", "");
        setValue("unity", "");
        setValue("quantity", 0);
        setValue("unity_price", 0);
        setValue("total_price", 0);
        setValue("purchased_date", "");
        setSelectedProduct(null);
        setQuery('');
        setValue("box_value", 0);
        setValue("box_unities", 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    useEffect(() => {
        if (watch("quantity") > 0 && watch("unity_price") > 0 && watch("unity") !== "CX") {
            setValue("total_price", watch("quantity") * watch("unity_price"));
            setValue("box_value", 0);
            setValue("box_unities", 0);
        } else if (watch("box_unities") > 0 && watch("box_value") > 0 && watch("unity") === "CX") {
            setValue("total_price", watch("quantity") * watch("box_value"));
            setValue("unity_price",   Number((watch("box_value") / watch("box_unities")).toFixed(2)))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch("quantity"), watch("unity_price"), watch("box_unities"), watch("box_value")],);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                <Form onSubmit={handleSubmit(handleStockTransaction)}>
                    <h2>{action === "create" ? "Nova" : "Editar"} compra</h2>
                    <div style={{ position: 'relative', width: '100%' }} ref={wrapperRef}>
                        <Label>Produto<span>*</span></Label>
                        <Input
                            placeholder="Produto"
                            value={query}
                            onChange={(e) => handleSearchProducts(e.target.value)}
                            onFocus={() => query && setShowSuggestions(true)}
                        />

                        {showSuggestions && productSuggestions.length > 0 && query.length >= 2 && (
                            <ul className="suggestion-box">
                            {productSuggestions.map((product: any) => (
                                <li key={product.id} onClick={() => handleSelectProduct(product)}>
                                {product.name} - R$ {product.price}
                                </li>
                            ))}
                            </ul>
                        )}
                        {productError && <ErrorMessage>{productError}</ErrorMessage>}
                    </div>
                    <button
                        className="new-product-button"
                        type="button"
                        onClick={() => setProductModal(true)}>Novo produto</button>
                    <InlineFormField fullWidth>
                        <EditFormField>
                            <Label>Unidade<span>*</span></Label>
                            <select placeholder='Unidade' {...register("unity", { required: "Unidade invária" })} style={{ height: "4rem" }}>
                                <option value="">Selecione a unidade</option>
                                {Object.entries(UNITIES).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                            {errors.unity && <ErrorMessage>{errors.unity.message}</ErrorMessage>}
                        </EditFormField>
                        <EditFormField>
                            <Label>Quantidade<span>*</span></Label>
                            <input type="number"
                                {...register("quantity", { required: "Quantidade é obrigatória" })}/>
                            {errors.quantity && <ErrorMessage>{errors.quantity.message}</ErrorMessage>}
                        </EditFormField>
                    </InlineFormField>
                    {watch("unity") === "CX" && 
                        <InlineFormField fullWidth>
                            <EditFormField>
                                <Label>Preço por caixa<span>*</span></Label>
                                <input type="number" step={0.01}
                                    {...register("box_value", { required: "Preço por caixa é obrigatório" })}/>
                                {errors.unity_price && <ErrorMessage>{errors.unity_price.message}</ErrorMessage>}
                            </EditFormField>
                            <EditFormField>
                                <Label>Unidades por caixa<span>*</span></Label>
                                <input type="number" step={0.01}
                                    {...register("box_unities", { required: "Unidades por caixa é obrigatório" })}/>
                                {errors.total_price && <ErrorMessage>{errors.total_price.message}</ErrorMessage>}
                            </EditFormField>
                        </InlineFormField>
                    }
                    <InlineFormField fullWidth>
                        <EditFormField>
                            <Label>Preço por unidade<span>*</span></Label>
                            <input type="number" step={0.01}
                                {...register("unity_price", { required: "Preço por unidade é obrigatório" })}/>
                            {errors.unity_price && <ErrorMessage>{errors.unity_price.message}</ErrorMessage>}
                        </EditFormField>
                        <EditFormField>
                            <Label>Preço total<span>*</span></Label>
                            <input type="number" step={0.01}
                                {...register("total_price", { required: "Preço total é obrigatório" })}/>
                            {errors.total_price && <ErrorMessage>{errors.total_price.message}</ErrorMessage>}
                        </EditFormField>
                    </InlineFormField>
                    <InlineFormField fullWidth>
                        <EditFormField>
                            <Label>Fornecedor<span>*</span></Label>
                            <input type="text"
                                {...register("supplier", { required: "Fornecedor é obrigatório" })}
                                placeholder="Fornecedor"
                            />
                            {errors.supplier && <ErrorMessage>{errors.supplier.message}</ErrorMessage>}
                        </EditFormField>
                        <EditFormField>
                            <Label>Data de compra<span>*</span></Label>
                            <Input type="date" {...register("purchased_date", {
								required: "Data de entrega é obrigatória",
							})} />
                            {errors.purchased_date && <ErrorMessage>{errors.purchased_date.message}</ErrorMessage>}
                        </EditFormField>
                    </InlineFormField>

                    <button type="submit" className="create-button">
                        {action === "create" ? "Criar" : "Editar"}
                    </button>
                </Form>
            </ModalContainer>
            <ProductModal 
                isOpen={productModal}
                onRequestClose={() => setProductModal(false)}
                loadData={() => {}}
                action={"create"}
                currentProduct={{
                    id: "",
                    name: "",
                    price: 0,
                    unity: "",
                    stock: 0,
                    enabled: false
                }}
            />
        </Modal>
    )
}
