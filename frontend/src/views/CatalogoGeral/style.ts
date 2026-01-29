import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    height: 100%;
    padding: 1rem;
    overflow-y: auto;
`;

export const HeaderActions = styled.div`
    display: flex;
    gap: 0.75rem;
    align-items: center;

    @media (max-width: 768px) {
        width: 100%;
        justify-content: flex-end;
    }
`;

export const ExcelButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.2rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;

    &.download {
        background: var(--primary-color);
        color: white;

        &:hover:not(:disabled) {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
        }
    }

    &.upload {
        background: #10b981;
        color: white;

        &:hover:not(:disabled) {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    svg {
        font-size: 1rem;
    }

    @media (max-width: 768px) {
        padding: 0.6rem 1rem;
        font-size: 0.85rem;
    }
`;

export const SearchContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin: 2rem 0;
    flex-wrap: wrap;

    .search-box {
        flex: 1;
        min-width: 300px;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        background: var(--white-background);
        padding: 3px 10px;
        border-radius: 0.5rem;
        border: 1px solid #e5e7eb;

        svg {
            color: var(--text-body);
            font-size: 1rem;
        }

        input {
            flex: 1;
            border: none;
            background: transparent;
            font-size: 0.95rem;
            
            &:focus {
                outline: none;
            }
        }
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;

        .search-box {
            min-width: 100%;
        }
    }
`;

export const ActionButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: #EC4899;
    color: white;
    border: none;
    padding: 0.9rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;

    svg {
        font-size: 1rem;
    }

    &:hover:not(:disabled) {
        background: #db2777;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
    }

    &:disabled {
        background: #d1d5db;
        cursor: not-allowed;
        opacity: 0.6;
    }

    @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
    }
`;

export const SelectAllContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 1rem;
    background: white;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    input[type="checkbox"] {
        width: 20px;
        height: 20px;
        cursor: pointer;
        accent-color: #EC4899;
    }

    label {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-body);
        cursor: pointer;
        user-select: none;
    }
`;

export const ProductsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
    }

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

export const ProductCard = styled.div<{ selected: boolean }>`
    background: white;
    border-radius: 0.8rem;
    padding: 8px;
    box-shadow: ${props => props.selected 
        ? '0 4px 12px rgba(236, 72, 153, 0.3)' 
        : '0 2px 8px rgba(0, 0, 0, 0.1)'};
    border: ${props => props.selected 
        ? '2px solid #EC4899' 
        : '2px solid transparent'};
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
`;

export const CardCheckbox = styled.div`
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 1;

    input[type="checkbox"] {
        width: 22px;
        height: 22px;
        cursor: pointer;
        accent-color: #EC4899;
    }
`;

export const CardImage = styled.div`
    width: 100%;
    height: 150px;
    border-radius: 0.6rem;
    overflow: hidden;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 100%;
        height: 100%;
        object-fit: fill;
    }
`;

export const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const CardTitle = styled.h3`
    font-size: 1.05rem;
    font-weight: 600;
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-align: center;
    background: #EC4899;
    padding: 5px;
    border-radius: 5px;
    color: white;
`;

export const CardInputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const CardLabel = styled.label`
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-title);
    text-transform: uppercase;
    letter-spacing: 0.3px;
`;

export const CardInput = styled.input<{ disabled?: boolean }>`
    width: 100%;
    padding: 0.7rem;
    border: 1px solid ${props => props.disabled ? '#e5e7eb' : '#d1d5db'};
    border-radius: 0.4rem;
    font-size: 0.95rem;
    transition: all 0.2s;
    background: ${props => props.disabled ? '#f9fafb' : 'white'};

    &:focus {
        outline: none;
        border-color: #EC4899;
        box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }

    &:disabled {
        cursor: not-allowed;
        color: #9ca3af;
    }

    /* Remove spinner do input number */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    &[type=number] {
        -moz-appearance: textfield;
    }
`;

export const EmptyState = styled.div`
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-title);
    font-size: 1.1rem;
    background: white;
    border-radius: 0.8rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const SearchButton = styled.button`
    background: #EC4899;
    color: white;
    border: none;
    border-radius: 0.4rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`