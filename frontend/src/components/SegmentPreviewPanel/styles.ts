import styled from 'styled-components';

export const PreviewContainer = styled.div`
    padding: 0.5rem 0 1rem;
`;

export const PreviewSummary = styled.div`
    background-color: #f9f9f9;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    text-align: center;

    strong {
        font-size: 1.4rem;
        color: #EC4899;
    }
`;

export const ClientList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 320px;
    overflow-y: auto;
`;

export const ClientRow = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0.6rem 0.9rem;
    background-color: #f9f9f9;
    border-radius: 0.375rem;
    font-size: 0.9rem;
`;
