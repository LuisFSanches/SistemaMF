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
        background: #2563eb;
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

export const TabsContainer = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

export const TabsList = styled.div`
    display: flex;
    border-bottom: 2px solid #e5e7eb;
    overflow-x: auto;
    
    &::-webkit-scrollbar {
        height: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 4px;
    }
`;

export const Tab = styled.button<{ active: boolean }>`
    flex: 1;
    min-width: 140px;
    padding: 1rem 1.5rem;
    background: ${props => props.active ? '#EC4899' : 'transparent'};
    color: ${props => props.active ? 'white' : '#6b7280'};
    border: none;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    white-space: nowrap;

    svg {
        font-size: 1.1rem;
    }

    &:hover {
        background: ${props => props.active ? '#EC4899' : '#f3f4f6'};
    }

    @media (max-width: 768px) {
        min-width: 120px;
        padding: 0.875rem 1rem;
        font-size: 0.875rem;
    }
`;

export const TabContent = styled.div`
    padding: 2rem;

    @media (max-width: 768px) {
        padding: 1.5rem;
    }
`;

export const MetricsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

export const MetricCard = styled.div<{ color?: string }>`
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-left: 4px solid ${props => props.color || 'var(--primary-color)'};
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .metric-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;

        .icon {
            width: 48px;
            height: 48px;
            background: ${props => props.color || 'var(--primary-color)'}15;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${props => props.color || 'var(--primary-color)'};
            font-size: 1.5rem;
        }

        .metric-label {
            flex: 1;
            margin-left: 1rem;
            font-size: 0.875rem;
            color: #6b7280;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    }

    .metric-value {
        font-size: 2rem;
        font-weight: 700;
        color: #111827;
        margin-bottom: 0.5rem;
    }

    .metric-trend {
        font-size: 0.875rem;
        color: #6b7280;
        display: flex;
        align-items: center;
        gap: 0.25rem;

        &.positive {
            color: #10b981;
        }

        &.negative {
            color: #ef4444;
        }

        &.neutral {
            color: #6b7280;
        }
    }
`;

export const ChartSection = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;

    h2 {
        font-size: 1.25rem;
        color: #111827;
        margin-bottom: 0.5rem;
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
        margin-bottom: 1.5rem;
    }

    @media (max-width: 768px) {
        padding: 1.5rem;
    }
`;

export const TableSection = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

export const TableHeader = styled.div`
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;

    @media (max-width: 768px) {
        padding: 1.25rem 1.5rem;
        flex-direction: column;
        align-items: flex-start;
    }
`;

export const TableTitle = styled.div`
    h2 {
        font-size: 1.25rem;
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
    }
`;

export const TableContent = styled.div`
    overflow-x: auto;

    table {
        width: 100%;
        border-collapse: collapse;

        thead {
            background: #f9fafb;

            tr {
                th {
                    padding: 1rem 1.5rem;
                    text-align: left;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #374151;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border-bottom: 2px solid #e5e7eb;
                }
            }
        }

        tbody {
            tr {
                transition: background 0.2s;

                &:hover {
                    background: #f9fafb;
                }

                td {
                    padding: 1rem 1.5rem;
                    font-size: 0.95rem;
                    color: #374151;
                    border-bottom: 1px solid #f3f4f6;

                    &.name {
                        font-weight: 500;
                        color: #111827;
                    }

                    &.number {
                        font-weight: 600;
                        font-variant-numeric: tabular-nums;
                    }

                    &.positive {
                        color: #10b981;
                        font-weight: 500;
                    }

                    .status-badge {
                        display: inline-block;
                        padding: 0.375rem 0.75rem;
                        border-radius: 6px;
                        font-size: 0.875rem;
                        font-weight: 500;

                        &.low {
                            background: #fef2f2;
                            color: #dc2626;
                        }

                        &.medium {
                            background: #fffbeb;
                            color: #d97706;
                        }

                        &.high {
                            background: #f0fdf4;
                            color: #16a34a;
                        }
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        table {
            thead {
                display: none;
            }

            tbody {
                tr {
                    display: block;
                    margin-bottom: 1rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    overflow: hidden;

                    td {
                        display: flex;
                        justify-content: space-between;
                        padding: 0.75rem 1rem;
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
                            letter-spacing: 0.5px;
                        }
                    }
                }
            }
        }
    }
`;

export const EmptyState = styled.div`
    padding: 4rem 2rem;
    text-align: center;
    color: #6b7280;

    .icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        color: #d1d5db;
    }

    h3 {
        font-size: 1.25rem;
        color: #374151;
        margin-bottom: 0.5rem;
    }

    p {
        font-size: 1rem;
    }
`;

export const LoadingContainer = styled.div`
    padding: 4rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #e5e7eb;
        border-top-color: var(--primary-color);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    p {
        color: #6b7280;
        font-size: 1rem;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

export const RankBadge = styled.span<{ rank: number }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-weight: 700;
    font-size: 0.875rem;
    background: ${props => {
        if (props.rank === 1) return 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
        if (props.rank === 2) return 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)';
        if (props.rank === 3) return 'linear-gradient(135deg, #d97706 0%, #c2410c 100%)';
        return '#e5e7eb';
    }};
    color: ${props => props.rank <= 3 ? 'white' : '#6b7280'};
    box-shadow: ${props => props.rank <= 3 ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'};
`;
