import styled from 'styled-components';

export const MenuContainer = styled.div`
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    padding: 0 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;

    @media (max-width: 768px) {
        padding: 0 10px;
    }
`;

export const CarouselWrapper = styled.div`
    width: 100%;
    max-width: 1400px;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    padding: 15px 0;
    
    /* Ocultar scrollbar mas manter funcionalidade */
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
        display: none;
    }
`;

export const CategoryList = styled.div`
    display: flex;
    gap: 20px;
    justify-content: flex-start;
    min-width: min-content;
    padding: 0 10px;

    @media (max-width: 768px) {
        gap: 15px;
    }
`;

export const CategoryItem = styled.button<{ $active?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 100px;
    padding: 10px;
    border-radius: 12px;
    
    &:hover {
        transform: translateY(-3px);
    }

    @media (max-width: 768px) {
        min-width: 85px;
        gap: 8px;
        padding: 8px;
    }
`;

export const CategoryImage = styled.img`
    width: 70px;
    height: 70px;
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
        width: 60px;
        height: 60px;
    }
`;

export const CategoryImagePlaceholder = styled.div`
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: linear-gradient(135deg, #EC4899 0%, #F472B6 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #e0e0e0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    span {
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
        text-transform: uppercase;
    }

    ${CategoryItem}:hover & {
        border-color: var(--primary-color);
        box-shadow: 0 6px 20px rgba(236, 72, 153, 0.3);
    }

    ${CategoryItem}[data-active="true"] & {
        border-color: var(--primary-color);
        box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
    }

    @media (max-width: 768px) {
        width: 60px;
        height: 60px;

        span {
            font-size: 1.25rem;
        }
    }
`;

export const CategoryName = styled.span`
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    text-align: center;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    ${CategoryItem}:hover & {
        color: var(--primary-color);
        font-weight: 600;
    }

    ${CategoryItem}[data-active="true"] & {
        color: var(--primary-color);
        font-weight: 600;
    }

    @media (max-width: 768px) {
        font-size: 0.75rem;
        max-width: 85px;
    }
`;

export const NavigationButton = styled.button<{ $position: 'left' | 'right' }>`
    position: absolute;
    ${props => props.$position}: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    border: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    svg {
        color: #374151;
        font-size: 1rem;
    }

    &:hover {
        background: var(--primary-color);
        border-color: var(--primary-color);
        transform: translateY(-50%) scale(1.1);
        box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);

        svg {
            color: white;
        }
    }

    @media (max-width: 768px) {
        width: 35px;
        height: 35px;

        svg {
            font-size: 0.875rem;
        }
    }
`;
