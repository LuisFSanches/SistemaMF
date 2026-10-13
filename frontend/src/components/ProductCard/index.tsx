import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
import { ColorSwatches } from "../ColorSwatches";
import { IStoreProductVariant } from "../../interfaces/IProductVariant";
import {
    Card,
    ProductImage,
    Info,
    ProductName,
    PriceInput,
    BottomActions,
    QuantityInput,
    QuantityButton,
    QuantityControl,
    AddButton,
    PriceInputWrapper,
    MoneySign,
    PriceDisplay,
    ClickableArea,
    SwatchRow,
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

    // Products grouped by color: the card shows the group and lets the user switch colors
    const variants: IStoreProductVariant[] = product.variants || [];
    const hasVariants = variants.length > 1;
    const [selectedVariantId, setSelectedVariantId] = useState<string>(product.id);
    const selectedVariant = variants.find(variant => variant.id === selectedVariantId);

    const activeProduct = selectedVariant && selectedVariant.id !== product.id
        ? { ...product, id: selectedVariant.id, name: selectedVariant.name, price: selectedVariant.price, image: selectedVariant.image || product.image }
        : product;
    const activeImage = selectedVariant && selectedVariant.id !== product.id
        ? selectedVariant.image || image
        : image;
    const displayName = hasVariants ? product.variant_group?.name || product.name : product.name;

    const handleSelectVariant = (variant: IStoreProductVariant) => {
        setSelectedVariantId(variant.id);
        setInitialPrice(variant.price);
    };

    const handleAddClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (quantity > 0) {
            onAdd(activeProduct, quantity, initialPrice);
            showSuccess(`x${quantity} ${activeProduct.name} adicionado ao pedido!`, 1800);
        }
    };

    const handleCardClick = () => {
        if (enableDetailView && slug) {
            navigate(`/${slug}/produto/${activeProduct.id}`);
        }
    };

    return (
        <Card onClick={handleCardClick} clickable={enableDetailView}>
            <ClickableArea>
                <ProductImage src={activeImage} alt={activeProduct.name} />
                <ProductName>{displayName}</ProductName>
                {hasVariants && (
                    <SwatchRow>
                        <ColorSwatches
                            variants={variants}
                            selectedId={selectedVariantId}
                            onSelect={handleSelectVariant}
                            maxVisible={6}
                            showSelectedLabel
                        />
                    </SwatchRow>
                )}
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
                    <QuantityControl>
                        <QuantityButton
                            type="button"
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        >−</QuantityButton>
                        <QuantityInput
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        />
                        <QuantityButton
                            type="button"
                            onClick={() => setQuantity(q => q + 1)}
                        >+</QuantityButton>
                    </QuantityControl>
                    <AddButton onClick={handleAddClick}>Adicionar</AddButton>
                </BottomActions>
            </Info>
        </Card>
    );
};
