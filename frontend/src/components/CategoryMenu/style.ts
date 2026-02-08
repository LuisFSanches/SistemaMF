import styled from 'styled-components';

export const MenuContainer = styled.div`
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px auto;
    padding: 0 20px;
    background: white;
    border-bottom: 1px solid #e0e0e0;

    @media (max-width: 768px) {
        padding: 0 20px;
        margin: 0px auto;
    }
`;

export const CarouselWrapper = styled.div`
    width: 100%;
    max-width: 1400px;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    padding: 5px 0;
    
    /* Ocultar scrollbar mas manter funcionalidade */
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
        display: none;
    }
`;

export const CategoryList = styled.div`
    display: flex;
    gap: 30px;
    justify-content: flex-start;
    min-width: min-content;
    padding: 0 10px;

    @media (max-width: 768px) {
        gap: 20px;
    }
`;

export const CategoryItem = styled.button<{ $active?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 120px;
    padding: 10px;
    border-radius: 12px;
    
    &:hover {
        transform: translateY(-5px);
    }

    @media (max-width: 768px) {
        min-width: 100px;
        gap: 8px;
    }
`;

export const CategoryImage = styled.img`
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid ${props => props.theme?.active ? 'var(--primary-color)' : '#e0e0e0'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    ${CategoryItem}:hover & {
        border-color: var(--primary-color);
        box-shadow: 0 6px 20px rgba(236, 72, 153, 0.3);
    }

    ${CategoryItem}[data-active="true"] & {
        border-color: var(--primary-color);
        box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
    }

    @media (max-width: 768px) {
        width: 80px;
        height: 80px;
    }
`;

export const CategoryImagePlaceholder = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-color) 0%, #ec4899 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #e0e0e0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    span {
        color: white;
        font-size: 32px;
        font-weight: 700;
        text-transform: uppercase;
    }

    ${CategoryItem}:hover & {
        border-color: var(--primary-color);
        box-shadow: 0 6px 20px rgba(236, 72, 153, 0.3);
        transform: scale(1.05);
    }

    ${CategoryItem}[data-active="true"] & {
        border-color: var(--primary-color);
        box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
    }

    @media (max-width: 768px) {
        width: 80px;
        height: 80px;

        span {
            font-size: 26px;
        }
    }
`;

export const CategoryName = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: var(--text-body);
    text-align: center;
    max-width: 135px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: color 0.3s ease;

    ${CategoryItem}:hover & {
        color: var(--primary-color);
    }

    ${CategoryItem}[data-active="true"] & {
        color: var(--primary-color);
    }

    @media (max-width: 768px) {
        font-size: 12px;
        max-width: 100px;
    }
`;

export const NavigationButton = styled.button<{ $position: 'left' | 'right' }>`
    position: absolute;
    ${props => props.$position}: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;

    &:hover {
        background: var(--primary-color);
        color: white;
        transform: translateY(-50%) scale(1.1);
        box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
    }

    &:active {
        transform: translateY(-50%) scale(0.95);
    }

    svg {
        font-size: 16px;
    }

    @media (max-width: 768px) {
        width: 35px;
        height: 35px;
        ${props => props.$position}: 5px;

        svg {
            font-size: 14px;
        }
    }
`;

// Remover exports antigos não utilizados
export const MenuWrapper = styled.div``;

