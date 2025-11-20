import styled from 'styled-components';

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

export const Logo = styled.img`
    height: 50px;
    cursor: pointer;

    @media (max-width: 768px) {
        height: 40px;
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
