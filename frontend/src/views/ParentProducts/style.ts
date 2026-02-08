import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    height: 100%;
    padding: 1rem;
    overflow-y: auto;
`;

export const SearchContainer = styled.div`
    display: flex;
    justify-content: flex-start;
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

export const SearchButton = styled.button`
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 0.4rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;

    &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
    }
`;

export const AddButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: #10b981;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;

    svg {
        font-size: 1rem;
    }

    &:hover {
        background: #059669;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    @media (max-width: 768px) {
        padding: 0.65rem 1.2rem;
        font-size: 0.9rem;
    }
`;

export const ProductsTable = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
`;

export const ProductRow = styled.div`
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background: var(--white-background);
    padding: 1.2rem;
    border-radius: 0.8rem;
    border: 1px solid #e5e7eb;
    transition: all 0.2s;

    &:hover {
        border-color: var(--primary-color);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
`;

export const ProductImage = styled.div`
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    border-radius: 0.5rem;
    overflow: hidden;
    background: #f3f4f6;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    @media (max-width: 768px) {
        width: 100%;
        height: 150px;
    }
`;

export const ProductInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    h3 {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-title);
        margin: 0;
    }

    .details {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;

        span {
            font-size: 0.9rem;
            color: var(--text-body);

            &.price {
                font-weight: 600;
                color: var(--primary-color);
                font-size: 1rem;
            }

            &.unity {
                padding: 0.25rem 0.6rem;
                background: #e0e7ff;
                color: #4f46e5;
                border-radius: 0.3rem;
                font-weight: 500;
            }

            &.stock {
                color: #6b7280;
            }
        }
    }

    .status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;

        span {
            padding: 0.25rem 0.7rem;
            border-radius: 0.3rem;
            font-size: 0.85rem;
            font-weight: 500;

            &.enabled {
                background: #d1fae5;
                color: #059669;
            }

            &.disabled {
                background: #fee2e2;
                color: #dc2626;
            }

            &.visible {
                background: #dbeafe;
                color: #2563eb;
            }
        }
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

export const ProductActions = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;

    @media (max-width: 768px) {
        width: 100%;
        justify-content: flex-end;
    }
`;

export const ActionButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    border: none;
    border-radius: 0.4rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    svg {
        font-size: 0.9rem;
    }

    &.edit {
        background: var(--primary-color);
        color: white;

        &:hover {
            opacity: 0.9;
            transform: translateY(-2px);
        }
    }

    &.delete {
        background: #ef4444;
        color: white;

        &:hover {
            background: #dc2626;
            transform: translateY(-2px);
        }
    }

    @media (max-width: 768px) {
        flex: 1;
        justify-content: center;
    }
`;

export const EmptyState = styled.div`
    text-align: center;
    padding: 3rem 1rem;
    color: var(--text-body);
    font-size: 1.1rem;
`;

export const UnauthorizedMessage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
    padding: 2rem;

    h2 {
        color: var(--text-title);
        font-size: 1.8rem;
        margin-bottom: 1rem;
    }

    p {
        color: var(--text-body);
        font-size: 1.1rem;
        max-width: 500px;
    }
`;
