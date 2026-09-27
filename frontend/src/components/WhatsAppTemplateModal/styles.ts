import styled from 'styled-components';

export const HelpText = styled.small`
    display: block;
    margin-top: 0.25rem;
    margin-bottom: 0.75rem;
    color: #777;
    font-size: 0.85rem;
`;

export const SectionTitle = styled.h3`
    font-size: 1.1rem;
    font-weight: 600;
    color: #555;
    margin-top: 0;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #f3f4f6;
`;

export const VariableRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;

    span {
        min-width: 90px;
        font-weight: 600;
        color: #555;
        font-size: 0.9rem;
    }

    select {
        flex: 1;
    }

    button {
        border: none;
        background: none;
        color: #d33;
        cursor: pointer;
        font-size: 0.85rem;
    }
`;

export const MediaPreview = styled.img`
    display: block;
    max-width: 100%;
    max-height: 220px;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
    margin-bottom: 0.75rem;
    object-fit: contain;
`;

export const FieldRow = styled.div`
    display: flex;
    gap: 1rem;

    > div {
        flex: 1;
        min-width: 0;
    }

    @media (max-width: 640px) {
        flex-direction: column;
        gap: 0;
    }
`;

export const AddVariableButton = styled.button`
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
    border: 1px dashed #EC4899;
    background: none;
    color: #EC4899;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.9rem;
`;
