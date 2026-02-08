import styled from 'styled-components';

export const ProductCard = styled.div`
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;

    &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        transform: translateY(-2px);
    }

    &.disabled {
        opacity: 0.6;
    }
`;

export const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;
    background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f4 100%);
`;

export const ProductImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 12px;
`;

export const EditButton = styled.button`
    position: absolute;
    top: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    color: var(--primary-color);
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    &:hover {
        background: white;
        transform: scale(1.1);
        color: var(--secondary-color);
    }

    &:active {
        transform: scale(0.95);
    }
`;

export const ProductContent = styled.div`
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
`;

export const ProductTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #2d3748;
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 44px;
`;

export const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
`;

export const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const InfoIcon = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;

    &.price {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    &.stock {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
    }
`;

export const InfoContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
`;

export const InfoLabel = styled.span`
    font-size: 11px;
    font-weight: 500;
    color: #718096;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

export const InfoValue = styled.span`
    font-size: 14px;
    font-weight: 700;
    color: #2d3748;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const StatusBadge = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    align-self: flex-start;
    margin-top: auto;

    &.enabled {
        background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        color: white;
        box-shadow: 0 2px 6px rgba(72, 187, 120, 0.3);
    }

    &.disabled {
        background: linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%);
        color: white;
        box-shadow: 0 2px 6px rgba(160, 174, 192, 0.3);
    }
`;
