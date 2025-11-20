import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, #fef5f8 0%, #fff 100%);
    padding-bottom: 40px;
`;

export const Content = styled.main`
    max-width: 1400px;
    margin: 0 auto;
    padding: 30px 12px;
`;

export const PageTitle = styled.h1`
    color: var(--primary-color);
    font-size: 32px;
    text-align: center;
    margin-bottom: 40px;

    @media (max-width: 768px) {
        font-size: 24px;
        margin-bottom: 30px;
    }
`;

export const SearchContainer = styled.div`
    max-width: 600px;
    margin: 0 auto 40px;
    position: relative;
`;

export const SearchInput = styled.input`
    width: 100%;
    padding: 15px 20px;
    border: 2px solid #fcc5d0;
    border-radius: 25px;
    font-size: 16px;
    outline: none;
    transition: all 0.3s ease;

    &:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }

    &::placeholder {
        color: #999;
    }
`;

export const ProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 40px;

    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 16px;
    }
`;

export const EmptyState = styled.div`
    text-align: center;
    padding: 60px 20px;
    color: #999;

    svg {
        font-size: 64px;
        margin-bottom: 20px;
        color: #ddd;
    }

    h3 {
        font-size: 24px;
        margin-bottom: 10px;
        color: #666;
    }

    p {
        font-size: 16px;
    }
`;

export const LoaderContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
`;
