import styled from 'styled-components';

export const BannerCarouselContainer = styled.div`
    width: 100%;
    max-width: 1440px;
    height: 285px;
    margin: 0 auto;
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
    height: 285px;
    object-fit: cover;
    display: block;

    @media (max-width: 768px) {
        height: 150px;
        object-fit: fill;
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
