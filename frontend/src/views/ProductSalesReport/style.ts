import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    max-width: 1500px;
    margin: 0 auto;
    padding: 2rem;
    background: #f9fafb;
    min-height: 100vh;

    @media (max-width: 768px) {
        width: 95%;
        padding: 1rem;
    }
`;

export const Header = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;

    h1 {
        font-size: 2rem;
        color: #111827;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;

        svg {
            color: var(--primary-color);
        }
    }

    p {
        color: #6b7280;
        font-size: 1rem;
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 1.5rem;
        flex-wrap: wrap;
    }

    @media (max-width: 768px) {
        padding: 1.5rem;

        h1 {
            font-size: 1.5rem;
        }

        .header-actions {
            flex-direction: column;
            align-items: stretch;
        }
    }
`;

export const ExportButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #EC4899;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    svg {
        font-size: 1.1rem;
    }

    &:hover {
        background: #EC6C79;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        transform: none;
    }
`;

export const SearchContainer = styled.div`
    position: relative;
    flex: 1;
    min-width: 250px;

    .search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #6b7280;
        font-size: 1rem;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

export const SearchInput = styled.input`
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid #DBCED0;
    background-color: #F4E5E8;
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.2s;

    &:focus {
        outline: none;
        border-color: var(--primary-color);
        background-color: white;
    }

    &::placeholder {
        color: #9ca3af;
    }
`;

export const TableSection = styled.div`
    border; 1px solid white;
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-bottom: 2rem;
`;

export const TableHeader = styled.div`
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #e5e7eb;

    @media (max-width: 768px) {
        padding: 1.25rem 1.5rem;
    }
`;

export const TableTitle = styled.div`
    h2 {
        font-size: 1.5rem;
        color: #111827;
        margin-bottom: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        svg {
            color: var(--primary-color);
        }
    }

    .subtitle {
        color: #6b7280;
        font-size: 0.875rem;
        margin: 0;
    }

    @media (max-width: 768px) {
        h2 {
            font-size: 1.25rem;
        }
    }
`;

export const TableContent = styled.div`
    overflow-x: auto;

    .responsive-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid white;

        thead {
            background: #f9fafb;
            
            th {
                padding: 1rem 1.5rem;
                text-align: center;
                font-size: 1rem;
                font-weight: 700;
                color: #374151;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                border-bottom: 2px solid #e5e7eb;
            }
        }

        tbody {
            tr {
                border-bottom: 1px solid #f2d4d4;
                transition: background 0.2s;

                &:hover {
                    background: #f9fafb;
                }

                &:last-child {
                    border-bottom: none;
                }

                td {
                    padding: 0.5rem 1.5rem;
                    font-size: 1rem;
                    color: #374151;

                    &.name {
                        font-weight: 500;
                        color: #111827;
                    }

                    &.number {
                        text-align: center;
                        font-weight: 600;
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        .responsive-table {
            thead {
                display: none;
            }

            tbody {
                tr {
                    display: block;
                    margin-bottom: 1rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 1rem;

                    td {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0.75rem 0;
                        border-bottom: 1px solid #f3f4f6;

                        &:last-child {
                            border-bottom: none;
                        }

                        &::before {
                            content: attr(data-label);
                            font-weight: 600;
                            color: #6b7280;
                            text-transform: uppercase;
                            font-size: 0.75rem;
                            letter-spacing: 0.05em;
                        }

                        &.name, &.number {
                            text-align: right;
                        }
                    }
                }
            }
        }
    }
`;

export const EmptyState = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 4rem 2rem;
    text-align: center;

    .icon {
        font-size: 4rem;
        color: #d1d5db;
        margin-bottom: 1rem;
    }

    h3 {
        font-size: 1.25rem;
        color: #374151;
        margin-bottom: 0.5rem;
    }

    p {
        color: #6b7280;
        font-size: 1rem;
    }
`;

export const LoadingContainer = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 4rem 2rem;
    text-align: center;

    .spinner {
        width: 50px;
        height: 50px;
        margin: 0 auto 1rem;
        border: 4px solid #f3f4f6;
        border-top: 4px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    p {
        color: #6b7280;
        font-size: 1rem;
    }
`;

export const ProductImage = styled.img`
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
`;

export const PaginationContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        padding: 1.5rem 1rem;
    }
`;

export const PaginationButton = styled.button`
    padding: 0.625rem 1.5rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
        background: #EC6C79;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    &:disabled {
        background: #d1d5db;
        color: #9ca3af;
        cursor: not-allowed;
        transform: none;
    }
`;

export const PageInfo = styled.span`
    font-size: 0.95rem;
    color: #374151;
    font-weight: 500;
`;
