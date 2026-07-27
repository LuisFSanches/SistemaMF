import styled from 'styled-components';

export const Container = styled.div`
    flex: 5;
    padding: 0.8rem 2rem;

    @media (max-width:750px) {
        padding: 0.4rem;
    }
`;

export const ProductCell = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;

    img {
        width: 40px;
        height: 40px;
        object-fit: contain;
        border-radius: 4px;
        background: var(--white-background);
    }

    span {
        font-weight: 500;
    }
`;

export const PreviewModalBox = styled.div`
    width: 100%;
    height: 320px;

    model-viewer {
        width: 100%;
        height: 100%;
    }
`;

export const AddButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: #EC4899;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    svg {
        font-size: 1.125rem;
    }
`;
