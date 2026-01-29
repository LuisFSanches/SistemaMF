import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: linear-gradient(135deg, hsl(346 77% 95%) 0%, hsl(346 77% 98%) 50%, hsl(142 71% 95%) 100%);
`;

export const Content = styled.main`
    flex: 1;
    max-width: 1440px;
    margin: 0 auto;
    padding: 2rem;
    width: 100%;

    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

export const ProductContainer = styled.div`
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr;
    gap: 2rem;
    border-radius: 8px;

    @media (max-width: 1200px) {
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
`;

export const ImageSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const ImageCarousel = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    background: var(--background);
    border-radius: 8px;
    overflow: hidden;
`;

export const MainImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

export const CarouselButton = styled.button<{ position: 'left' | 'right' }>`
    position: absolute;
    top: 50%;
    ${props => props.position}: 1rem;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    color: var(--text-body);

    &:hover {
        background: white;
        transform: translateY(-50%) scale(1.1);
    }

    svg {
        font-size: 1.2rem;
    }
`;

export const ThumbnailContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    justify-content: center;
`;

export const Thumbnail = styled.img<{ isActive: boolean }>`
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid ${props => props.isActive ? 'var(--primary-color)' : 'transparent'};
    opacity: ${props => props.isActive ? 1 : 0.6};
    transition: all 0.3s;

    &:hover {
        opacity: 1;
        border-color: var(--primary-color);
    }
`;

export const InfoSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

export const SideColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    @media (max-width: 1200px) {
        grid-column: 1 / -1;
    }
`;

export const ProductTitle = styled.h1`
    font-size: 2rem;
    color: var(--text-body);
    font-weight: 600;
    line-height: 1.3;

    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

export const CategoryContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
`;

export const CategoryGroup = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
`;

export const CategoryBadge = styled.span`
    background: var(--light-background);
    color: var(--text-body);
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
`;

export const ProductPrice = styled.div`
    font-size: 2.5rem;
    color: var(--primary-color);
    font-weight: 700;
    display: flex;
    align-items: baseline;
    gap: 0.5rem;

    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;

export const ProductUnity = styled.span`
    font-size: 1rem;
    color: var(--text-light);
    font-weight: 500;
`;

export const StockInfo = styled.div<{ inStock: boolean }>`
    padding: 0.5rem 1rem;
    border-radius: 4px;
    background: ${props => props.inStock ? 'rgba(51, 204, 149, 0.1)' : 'rgba(229, 46, 64, 0.1)'};
    color: ${props => props.inStock ? 'var(--green)' : 'var(--red)'};
    font-weight: 600;
    font-size: 0.9rem;
    width: fit-content;
`;

export const ActionButtons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const BuyNowButton = styled.button`
    background: #EC4899;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(228, 191, 199, 0.4);
    }

    &:active {
        transform: translateY(0);
    }
`;

export const AddToCartButton = styled.button`
    background: white;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        background: var(--primary-color);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(228, 191, 199, 0.4);
    }

    &:active {
        transform: translateY(0);
    }
`;

export const WhatsAppButton = styled.button`
    background: #25D366;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover {
        background: #20BA5A;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
    }

    &:active {
        transform: translateY(0);
    }

    svg {
        font-size: 1.3rem;
    }
`;

export const DescriptionSection = styled.div`
    padding-top: 0.5rem;
    border-top: 1px solid var(--light-background);
`;

export const SectionTitle = styled.h2`
    font-size: 1.3rem;
    color: var(--text-body);
    font-weight: 600;
    margin-bottom: 20px;
`;

export const Description = styled.p`
    color: #939393;
    line-height: 1.6;
    font-size: 1rem;
`;

export const PaymentSection = styled.div`
    padding-top: 12px;
    border-top: 1px solid var(--light-background);

    h2 {
        margin-bottom: 10px;
    }
`;

export const PaymentMethods = styled.div`
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
`;

export const PaymentMethod = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    span {
        color: var(--text-body);
        font-size: 0.9rem;
        font-weight: 500;
    }
`;

export const PaymentIcon = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 8px;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    transition: all 0.3s;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
    }

    &.pix {
        color: #32BCAD;
    }

    &.card {
        color: #4169E1;
    }

    &.cash {
        color: #22C55E;
    }
`;

export const MercadoPagoInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.06);

    span {
        color: var(--text-light);
        font-size: 0.85rem;
    }
`;

export const MercadoPagoLogo = styled.img`
    height: 20px;
    width: auto;
`;

export const ObservationSection = styled.div`
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    h2 {
        margin-bottom: 10px;
    }
`;

export const ObservationText = styled.p`
    color: var(--text-body);
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 0.5rem;

    &:last-child {
        margin-bottom: 0;
    }

    strong {
        color: var(--primary-color);
    }
`;

export const ErrorContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
`;

export const ErrorMessage = styled.p`
    font-size: 1.2rem;
    color: var(--text-title);
`;
