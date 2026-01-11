import styled from 'styled-components';

export const BannerCarouselContainer = styled.div`
    width: 100%;
    height: 250px;
    position: relative;
    overflow: hidden;

    @media (max-width: 768px) {
        height: 150px;
    }
`;

export const BannerSlide = styled.div<{ isActive: boolean }>`
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: ${props => props.isActive ? 1 : 0};
    transition: opacity 0.6s ease-in-out;
`;

export const Banner = styled.img`
    width: 100%;
    height: 250px;
    object-fit: cover;
    display: block;

    @media (max-width: 768px) {
        height: 150px;
    }
`;

export const CarouselButton = styled.button<{ direction: 'left' | 'right' }>`
    position: absolute;
    top: 50%;
    ${props => props.direction === 'left' ? 'left: 15px' : 'right: 15px'};
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: all 0.3s ease;
    z-index: 10;

    &:hover {
        background: rgba(0, 0, 0, 0.7);
        transform: translateY(-50%) scale(1.1);
    }

    @media (max-width: 768px) {
        width: 35px;
        height: 35px;
        font-size: 16px;
    }
`;

export const CarouselDots = styled.div`
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 10;
`;

export const CarouselDot = styled.button<{ isActive: boolean }>`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
    background: ${props => props.isActive ? 'white' : 'transparent'};
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.7);
    }
`;

export const Header = styled.header`
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;

    @media (max-width: 768px) {
        padding: 15px 20px;
    }
`;

export const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    cursor: pointer;
    transition: opacity 0.3s ease;

    &:hover {
        opacity: 0.8;
    }
`;

export const Logo = styled.img`
    height: 50px;
    border-radius: 8px;

    @media (max-width: 768px) {
        height: 40px;
    }
`;

export const StoreName = styled.h1`
    font-size: 24px;
    color: var(--primary-color);
    font-weight: 700;
    margin: 0;

    @media (max-width: 768px) {
        font-size: 18px;
    }

    @media (max-width: 480px) {
        display: none;
    }
`;

export const HeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

export const BackButton = styled.button`
    background: transparent;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
        background: var(--primary-color);
        color: white;
    }

    @media (max-width: 768px) {
        padding: 8px 15px;
        font-size: 14px;
    }
`;

export const CartButton = styled.button`
    position: relative;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: all 0.3s ease;

    &:hover {
        background: #d93f7c;
        transform: scale(1.05);
    }

    @media (max-width: 768px) {
        width: 45px;
        height: 45px;
        font-size: 18px;
    }
`;

export const CartBadge = styled.span`
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff4444;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
`;
