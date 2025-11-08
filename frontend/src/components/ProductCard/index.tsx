import { useState } from 'react';
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
} from './style';

interface IProduct {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

type ProductCardProps = {
    product: IProduct;
    image: string;
    onAdd: (product: IProduct, quantity: number, price: number) => void;
};

export function ProductCard({ product, image, onAdd }: ProductCardProps){
    const [quantity, setQuantity] = useState<number>(1);
    const [initialPrice, setInitialPrice] = useState<any>(product.price);

    const handleAddClick = () => {
        if (quantity > 0) {
            onAdd(product, quantity, initialPrice);
        }
    };

    return (
        <Card>
            <ProductImage src={image} alt={product.name} />
            <Info>
                <ProductName>{product.name}</ProductName>
                <PriceInputWrapper>
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
                <BottomActions>
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
