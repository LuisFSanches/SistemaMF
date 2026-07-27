import styled from 'styled-components';

export const PageContainer = styled.div`
    min-height: 100vh;
    background: var(--background);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: 750px) {
        padding: 1rem;
    }
`;

export const BackButton = styled.button`
    align-self: flex-start;
    background: transparent;
    border: none;
    color: var(--text-title);
    font-size: 0.95rem;
    cursor: pointer;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        color: var(--primary-color);
    }
`;

export const ProductName = styled.h1`
    font-size: 1.5rem;
    color: var(--text-title);
    margin-bottom: 1rem;
    text-align: center;
`;

export const ViewerBox = styled.div`
    width: 100%;
    max-width: 800px;
    height: 500px;
    background: var(--white-background);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: hidden;

    model-viewer {
        width: 100%;
        height: 100%;
    }

    @media (max-width: 750px) {
        height: 360px;
    }
`;

export const EmptyState = styled.div`
    text-align: center;
    color: var(--text-light);
    padding: 3rem 1rem;
`;
