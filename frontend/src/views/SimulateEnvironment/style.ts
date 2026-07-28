import styled from 'styled-components';

export const PageContainer = styled.div`
    min-height: 100vh;
    background: var(--background);
    padding: 2rem;

    @media (max-width: 750px) {
        padding: 1rem;
    }
`;

export const Header = styled.div`
    text-align: center;
    margin-bottom: 2rem;

    h1 {
        font-size: 2rem;
        color: var(--text-title);
        margin-bottom: 0.5rem;
    }

    p {
        color: var(--text-light);
        font-size: 1rem;
    }
`;

export const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    max-width: 500px;
    margin: 0 auto 2rem;
    background: var(--white-background);
    border-radius: 2rem;
    padding: 0.75rem 1.5rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

    svg {
        color: var(--text-light);
    }

    input {
        border: none;
        outline: none;
        flex: 1;
        font-size: 1rem;
        background: transparent;
    }
`;

export const ProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
`;

export const ProductCard = styled.div`
    position: relative;
    background: var(--white-background);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
`;

export const SelectCheckbox = styled.input.attrs({ type: 'checkbox' })`
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    width: 22px;
    height: 22px;
    z-index: 1;
    cursor: pointer;
    accent-color: var(--primary-color);
`;

export const ProductImage = styled.div`
    width: 100%;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--background);

    img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
`;

export const ProductInfo = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;

    h3 {
        font-size: 1.05rem;
        color: var(--text-title);
        margin: 0;
    }

    span {
        font-size: 0.85rem;
        color: var(--text-light);
    }
`;

export const ViewButton = styled.button`
    margin: 0 1rem 1rem;
    padding: 0.75rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: filter 0.2s;

    &:hover {
        filter: brightness(1.1);
    }
`;

export const EmptyState = styled.div`
    text-align: center;
    color: var(--text-light);
    padding: 3rem 1rem;
`;

export const SelectionBar = styled.div`
    position: fixed;
    left: 50%;
    bottom: 1.5rem;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 1.25rem;
    background: var(--white-background);
    border-radius: 2rem;
    padding: 0.75rem 1.5rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
    z-index: 10;

    span {
        font-size: 0.9rem;
        color: var(--text-title);
        font-weight: 500;
        white-space: nowrap;
    }

    @media (max-width: 500px) {
        left: 1rem;
        right: 1rem;
        transform: none;
        justify-content: space-between;
    }
`;

export const SelectionBarButton = styled.button`
    padding: 0.65rem 1.25rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: filter 0.2s;

    &:hover {
        filter: brightness(1.1);
    }
`;
