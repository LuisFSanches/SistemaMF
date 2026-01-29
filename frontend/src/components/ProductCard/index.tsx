import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
import {
    Card,
    ProductImage,
    Info,
    ProductName,
    PriceInput,
    BottomActions,
    QuantityInput,
    AddButton,
    PriceInputWrapper,
    MoneySign,
    PriceDisplay,
    ClickableArea,
} from './style';

interface IProduct {
    id: string;
    name: string;
    price: number|any;
    quantity: number;
}

type ProductCardProps = {
    product: IProduct|any;
    image: string;
    onAdd: (product: IProduct, quantity: number, price: number) => void;
    editablePrice?: boolean;
    enableDetailView?: boolean;
};

export function ProductCard({ product, image, onAdd, editablePrice = true, enableDetailView = false }: ProductCardProps){
    const { showSuccess } = useSuccessMessage();
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();

    const [quantity, setQuantity] = useState<number>(1);
    const [initialPrice, setInitialPrice] = useState<any>(product.price);

    const handleAddClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (quantity > 0) {
            onAdd(product, quantity, initialPrice);
            showSuccess(`x${quantity} ${product.name} adicionado ao pedido!`, 1800);
        }
    };

    const handleCardClick = () => {
        if (enableDetailView && slug) {
            navigate(`/${slug}/produto/${product.id}`);
        }
    };

    return (
        <Card onClick={handleCardClick} clickable={enableDetailView}>
            <ClickableArea>
                <ProductImage src={image} alt={product.name} />
                <ProductName>{product.name}</ProductName>
                {editablePrice ? (
                    <PriceInputWrapper onClick={(e) => e.stopPropagation()}>
                        <MoneySign>R$</MoneySign>
                        <PriceInput
                            type="number"
                            step="0.01"
                            value={initialPrice}
                            onChange={(e) => {
                                const val = e.target.value;
                                setInitialPrice(val === "" ? "" : Number(val));
                            }}
                        />
                    </PriceInputWrapper>
                ) : (
                    <PriceDisplay>
                        R$ {Number(initialPrice).toFixed(2).replace('.', ',')}
                    </PriceDisplay>
                )}
            </ClickableArea>
            <Info>
                <BottomActions onClick={(e) => e.stopPropagation()}>
                    <QuantityInput
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                    <AddButton onClick={handleAddClick}>Adicionar</AddButton>
                </BottomActions>
            </Info>
        </Card>
    );
};
