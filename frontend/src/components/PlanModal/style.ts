import styled from 'styled-components';

export const ModalContent = styled.div`
    h2 {
        color: var(--text-title);
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
    }
`;

export const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

export const FullWidthField = styled.div`
    display: flex;
    flex-direction: column;
    grid-column: 1 / -1;
`;

export const CycleSelector = styled.div`
    display: flex;
    gap: 1rem;
    margin: 1rem 0;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

export const CycleOption = styled.label<{ selected: boolean }>`
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border: 2px solid ${({ selected }) => selected ? 'var(--primary-color)' : '#e7b7c2'};
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s;
    background: ${({ selected }) => selected ? 'var(--light-background)' : 'white'};

    &:hover {
        border-color: var(--primary-color);
    }

    input[type="radio"] {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }

    .cycle-info {
        flex: 1;

        h4 {
            font-size: 1rem;
            color: var(--text-body);
            margin-bottom: 0.25rem;
        }

        p {
            font-size: 0.85rem;
            color: var(--text-light);
        }
    }
`;

export const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 2rem;

    button {
        flex: 1;
        padding: 1rem;
        border: none;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;

        &.cancel {
            background: #e5e7eb;
            color: var(--text-body);

            &:hover {
                background: #d1d5db;
            }
        }

        &.submit {
            background: var(--primary-color);
            color: white;

            &:hover {
                background: #d14766;
            }

            &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        }
    }

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;
