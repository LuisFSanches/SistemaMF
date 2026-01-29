import styled from 'styled-components';

export const Header = styled.header`
    background: white;
    padding: 15px 30px 10px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 900;
    gap: 20px;
        border-bottom: 1px solid #e0e0e0;

    @media (max-width: 768px) {
        padding: 15px 20px;
        flex-wrap: wrap;
    }
`;

export const SearchContainer = styled.div`
    flex: 1;
    max-width: 500px;
    margin: 0 20px;
    position: relative;

    @media (max-width: 768px) {
        order: 3;
        flex-basis: 100%;
        max-width: 100%;
        margin: 10px 0 0 0;
    }
`;

export const SearchInput = styled.input`
    width: 100%;
    padding: 12px 20px;
    border: 2px solid #fcc5d0;
    border-radius: 25px;
    font-size: 15px;
    outline: none;
    transition: all 0.3s ease;

    &:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }

    &::placeholder {
        color: #999;
    }

    @media (max-width: 768px) {
        padding: 10px 15px;
        font-size: 14px;
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

export const SearchDropdown = styled.div`
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    right: 0;
    background: white;
    border: 2px solid #fcc5d0;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    max-height: 400px;
    overflow-y: auto;
    z-index: 1000;

    /* Scrollbar customizada */
    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--primary-color);
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #d93f7c;
    }
`;

export const SearchResultItem = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px 15px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: #fff5f8;
    }
`;

export const SearchResultImage = styled.img`
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    border: 2px solid #fcc5d0;
`;

export const SearchResultInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

export const SearchResultName = styled.div`
    font-size: 15px;
    font-weight: 600;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

export const SearchResultPrice = styled.div`
    font-size: 16px;
    font-weight: 700;
    color: var(--primary-color);
`;

export const EmptySearchResults = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 30px 20px;
    color: #999;

    svg {
        font-size: 32px;
        color: #ddd;
    }

    span {
        font-size: 14px;
    }
`;

export const SearchLoader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 30px 20px;
    color: var(--primary-color);

    svg {
        font-size: 28px;
    }

    span {
        font-size: 14px;
        font-weight: 500;
    }
`;
