import styled, { keyframes } from 'styled-components';

const motoboyAnimation = keyframes`
    0% {
        left: -60px;
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        left: calc(100% + 20px);
        opacity: 0;
    }
`;

export const Container = styled.div<{ isPDP?: boolean }>`
    width: 100%;
    max-width: ${props => props.isPDP ? '550px' : '680px'};
    margin: ${props => props.isPDP ? '0px' : '10px auto'};
    padding: ${props => props.isPDP ? '0px' : '0 12px'};
    position: relative;

    @media (max-width: 768px) {
        margin-bottom: 30px;
        padding: ${props => props.isPDP ? '0px' : '0px'
    }
`;
export const DaysContainer = styled.div<{ isPDP?: boolean }>`
    display: flex;
    justify-content: space-between;
    gap: 8px;
    background: white;
    padding: ${props => props.isPDP ? '0px' : '20px'};
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        padding: 16px 5px;
        gap: 3px;
    }
`;

export const DayCard = styled.div<{ isAvailable: boolean; isPDP?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${props => props.isPDP ? '12px 0px' : '12px 8px'};
    min-width: ${props => props.isPDP ? '56px' : '70px'};
    position: relative;
    opacity: ${props => props.isAvailable ? 1 : 0.4};

    @media (max-width: 768px) {
        min-width: 42px;
        padding: 10px 6px;
    }
`;

export const CheckIcon = styled.div`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;

    svg {
        color: white;
        font-size: 12px;
    }

    @media (max-width: 768px) {
        width: 20px;
        height: 20px;
        margin-bottom: 6px;

        svg {
            font-size: 10px;
        }
    }
`;

export const DayLabel = styled.span`
    color: #333;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 11px;
        margin-bottom: 2px;
    }
`;

export const DateLabel = styled.span`
    color: #666;
    font-size: 12px;
    font-weight: 400;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 10px;
    }
`;

export const MotoboyContainer = styled.div`
    position: absolute;
    top: -50px;
    left: -60px;
    width: 50px;
    height: 50px;
    animation: ${motoboyAnimation} 5s linear infinite;
    z-index: 10;

    @media (max-width: 768px) {
        width: 40px;
        height: 40px;
        top: -45px;
    }
`;

export const MotoboyImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
`;
