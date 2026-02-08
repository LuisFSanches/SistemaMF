import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBill, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import placeholder_products from '../../assets/images/placeholder_products.png';
import { 
    ProductCard, 
    ImageContainer, 
    ProductImage,
    EditButton,
    ProductContent,
    ProductTitle,
    InfoGrid,
    InfoItem,
    InfoIcon,
    InfoContent,
    InfoLabel,
    InfoValue,
    StatusBadge
} from './style';

interface ProductItemProps {
    product: {
        id: string;
        name: string;
        image?: string;
        price: number;
        unity: string;
        stock: number;
        enabled: boolean;
    };
    onEdit: (product: any) => void;
}

export function ProductItem({ product, onEdit }: ProductItemProps) {
    return (
        <ProductCard className={product.enabled ? "enabled" : "disabled"}>
            <ImageContainer>
                <ProductImage 
                    src={product.image || placeholder_products} 
                    alt={product.name} 
                />
                <EditButton onClick={() => onEdit(product)}>
                    <FontAwesomeIcon icon={faPen} />
                </EditButton>
            </ImageContainer>

            <ProductContent>
                <ProductTitle>{product.name}</ProductTitle>

                <InfoGrid>
                    <InfoItem>
                        <InfoIcon className="price">
                            <FontAwesomeIcon icon={faMoneyBill} />
                        </InfoIcon>
                        <InfoContent>
                            <InfoLabel>Preço</InfoLabel>
                            <InfoValue>R$ {product.price.toFixed(2)}</InfoValue>
                        </InfoContent>
                    </InfoItem>

                    <InfoItem>
                        <InfoIcon className="stock">
                            <FontAwesomeIcon icon={faBoxArchive} />
                        </InfoIcon>
                        <InfoContent>
                            <InfoLabel>Estoque</InfoLabel>
                            <InfoValue>{product.stock} {product.unity}</InfoValue>
                        </InfoContent>
                    </InfoItem>
                </InfoGrid>

                <StatusBadge className={product.enabled ? "enabled" : "disabled"}>
                    {product.enabled ? "Ativo" : "Desativado"}
                </StatusBadge>
            </ProductContent>
        </ProductCard>
    );
}
