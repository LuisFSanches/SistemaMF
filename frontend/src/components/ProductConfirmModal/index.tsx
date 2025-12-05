import { useState, useEffect } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";
import {
    ModalContainer,
    ModalHeader,
    ModalBody,
    CloseButton,
    ProductInfo,
    ProductImageBox,
    ProductDetails,
    InputGroup,
    Label,
    Input,
    ButtonGroup,
    ConfirmButton,
    CancelButton
} from "./style";

Modal.setAppElement("#root");

interface ProductConfirmModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    product: any;
    onConfirm: (quantity: number, price: number, image: string) => void;
    productImage?: string;
}

export function ProductConfirmModal({
    isOpen,
    onRequestClose,
    product,
    onConfirm,
    productImage
}: ProductConfirmModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(product?.price || 0);

    useEffect(() => {
        if (product) {
            setQuantity(1);
            setPrice(product.price || 0);
        }
    }, [product]);

    const handleConfirm = () => {
        if (quantity > 0 && price > 0) {
            onConfirm(quantity, price, productImage || product.image);
            onRequestClose();
        } else {
            alert("Quantidade e preço devem ser maiores que zero.");
        }
    };

    const handleCancel = () => {
        setQuantity(1);
        setPrice(product?.price || 0);
        onRequestClose();
    };

    if (!product) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleCancel}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
            style={{
                content: {
                    maxWidth: "500px",
                    margin: "auto"
                }
            }}
        >
            <ModalContainer>
                <ModalHeader>
                    <h2>Confirmar Adição do Produto</h2>
                    <CloseButton onClick={handleCancel}>
                        <FontAwesomeIcon icon={faXmark as any} />
                    </CloseButton>
                </ModalHeader>

                <ModalBody>
                    <ProductInfo>
                        <ProductImageBox>
                            <img 
                                src={productImage || product.image} 
                                alt={product.name}
                                onError={(e: any) => {
                                    e.target.src = '/placeholder_products.png';
                                }}
                            />
                        </ProductImageBox>
                        
                        <ProductDetails>
                            <h3>{product.name}</h3>
                            <p>Estoque: {product.stock} {product.unity}</p>
                        </ProductDetails>
                    </ProductInfo>

                    <InputGroup>
                        <div>
                            <Label>Quantidade</Label>
                            <Input
                                type="number"
                                min="1"
                                step="1"
                                value={quantity}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Number(e.target.value))}
                            />
                        </div>

                        <div>
                            <Label>Preço (R$)</Label>
                            <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={price}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(Number(e.target.value))}
                            />
                        </div>
                    </InputGroup>

                    <ProductDetails style={{ marginTop: '20px' }}>
                        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                            Total: R$ {(quantity * price).toFixed(2)}
                        </p>
                    </ProductDetails>

                    <ButtonGroup>
                        <CancelButton type="button" onClick={handleCancel}>
                            Cancelar
                        </CancelButton>
                        <ConfirmButton type="button" onClick={handleConfirm}>
                            <FontAwesomeIcon icon={faCheck as any} style={{ marginRight: '8px' }} />
                            Adicionar ao Pedido
                        </ConfirmButton>
                    </ButtonGroup>
                </ModalBody>
            </ModalContainer>
        </Modal>
    );
}
