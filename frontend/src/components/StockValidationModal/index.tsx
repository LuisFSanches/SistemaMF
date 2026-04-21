import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faXmark,
    faExclamationTriangle,
    faBoxOpen,
    faTimesCircle,
    faCheckCircle
} from "@fortawesome/free-solid-svg-icons";
import { InvalidStockItem } from "../../services/stockService";
import {
    ModalContainer,
    ModalHeader,
    ModalBody,
    CloseButton,
    IntroText,
    InvalidItemsList,
    InvalidItemCard,
    ItemHeader,
    ItemName,
    StatusBadge,
    ItemDetails,
    ActionButtons,
    CancelButton,
    ConfirmButton
} from "./style";

Modal.setAppElement("#root");

interface StockValidationModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    invalidItems: InvalidStockItem[];
    onRemoveItems: (itemIds: string[]) => void;
}

export function StockValidationModal({
    isOpen,
    onRequestClose,
    invalidItems,
    onRemoveItems
}: StockValidationModalProps) {
    
    const getItemStatus = (item: InvalidStockItem): 'unavailable' | 'out_of_stock' => {
        if (!item.is_enabled || !item.is_visible) {
            return 'unavailable';
        }
        return 'out_of_stock';
    };

    const getStatusLabel = (item: InvalidStockItem): string => {
        if (!item.is_enabled || !item.is_visible) {
            return 'Indisponível';
        }
        return 'Sem Estoque';
    };

    const getItemMessage = (item: InvalidStockItem): string => {
        if (!item.is_enabled) {
            return 'Este produto não está mais disponível para venda.';
        }
        if (!item.is_visible) {
            return 'Este produto não está disponível para loja online.';
        }
        if (!item.has_stock) {
            return `Estoque insuficiente. Disponível: ${item.available_stock}, Solicitado: ${item.requested_quantity}`;
        }
        return 'Produto indisponível.';
    };

    const handleRemoveInvalidItems = () => {
        const itemIds = invalidItems.map(item => item.store_product_id);
        onRemoveItems(itemIds);
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
            style={{
                content: {
                    maxWidth: "600px",
                    margin: "auto",
                    padding: "0",
                }
            }}
        >
            <ModalContainer>
                <ModalHeader>
                    <h2>
                        <FontAwesomeIcon icon={faExclamationTriangle as any} />
                        Produtos Indisponíveis
                    </h2>
                    <CloseButton onClick={onRequestClose}>
                        <FontAwesomeIcon icon={faXmark as any} />
                    </CloseButton>
                </ModalHeader>

                <ModalBody>
                    <IntroText>
                        Ops! Parece que alguém chegou primeiro 😬 Alguns produtos do seu carrinho não estão mais disponíveis.
                        Revise e remova para seguir com o pedido.
                    </IntroText>

                    <InvalidItemsList>
                        {invalidItems.map((item) => (
                            <InvalidItemCard key={item.store_product_id}>
                                <ItemHeader>
                                    <ItemName>{item.product_name}</ItemName>
                                    <StatusBadge type={getItemStatus(item)}>
                                        {getStatusLabel(item)}
                                    </StatusBadge>
                                </ItemHeader>
                                
                                <ItemDetails>
                                    <div>
                                        <FontAwesomeIcon icon={faTimesCircle as any} />
                                        <span>{getItemMessage(item)}</span>
                                    </div>
                                    
                                    {!item.has_stock && item.available_stock > 0 && (
                                        <div>
                                            <FontAwesomeIcon icon={faBoxOpen as any} />
                                            <span>
                                                Você solicitou <strong>{item.requested_quantity}</strong> unidade(s), 
                                                mas temos apenas <strong>{item.available_stock}</strong> disponível(is)
                                            </span>
                                        </div>
                                    )}
                                </ItemDetails>
                            </InvalidItemCard>
                        ))}
                    </InvalidItemsList>

                    <ActionButtons>
                        <CancelButton onClick={onRequestClose}>
                            <FontAwesomeIcon icon={faXmark as any} />
                            Revisar Carrinho
                        </CancelButton>
                        <ConfirmButton onClick={handleRemoveInvalidItems}>
                            <FontAwesomeIcon icon={faCheckCircle as any} />
                            Remover Itens Indisponíveis
                        </ConfirmButton>
                    </ActionButtons>
                </ModalBody>
            </ModalContainer>
        </Modal>
    );
}
