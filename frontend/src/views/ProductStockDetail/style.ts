import styled from 'styled-components';

export const Container = styled.div`
    max-width: 98vw;
    width: 100%;
    background: #f5f5f5;
    min-height: 100vh;
    overflow-x: hidden;
    padding: 20px;
`;

export const Header = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .back-button {
        background: #EC4899;
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
            opacity: 0.8;
        }
    }

    .product-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
        margin-left: 1rem;

        img {
            width: 60px;
            height: 60px;
            border-radius: 8px;
            object-fit: cover;
        }

        .current-price {
            font-weight: bold;
            color: #10b981;
        }

        h1 {
            font-size: 1.8rem;
            color: var(--text-color);
            margin: 0;
        }

        p {
            color: #666;
            margin: 0;
        }
    }
`;

export const MetricsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1rem;
`;

export const MetricCard = styled.div<{ color: string }>`
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-left: 4px solid ${props => props.color};
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .metric-header {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;

        .icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: ${props => props.color}15;
            color: ${props => props.color};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            margin-right: 10px;
        }
    }

    .metric-label {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }

    .metric-value {
        font-size: 1.8rem;
        font-weight: bold;
        color: var(--text-color);
        margin-bottom: 0.5rem;
    }

    .metric-trend {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;

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
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;

    h2 {
        font-size: 1.3rem;
        color: var(--text-color);
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .subtitle {
        color: #666;
        font-size: 0.9rem;
        margin-top: -0.5rem;
        margin-bottom: 1rem;
    }
`;

export const TableSection = styled.div`
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    h2 {
        font-size: 1.3rem;
        color: var(--text-color);
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .subtitle {
        color: #666;
        font-size: 0.9rem;
        margin-top: -0.5rem;
        margin-bottom: 1rem;
    }

    table {
        width: 100%;
        border-collapse: collapse;

        thead {
            background: #f9fafb;

            th {
                padding: 1rem;
                font-weight: 600;
                color: #374151;
                font-size: 0.9rem;
                border-bottom: 2px solid #e5e7eb;
            }
        }

        tbody {
            tr {
                transition: background 0.2s;

                &:hover {
                    background: #f9fafb;
                }

                td {
                    padding: 1rem;
                    color: #4b5563;
                    border-bottom: 1px solid #e5e7eb;

                    &.supplier {
                        font-weight: 700;
                        color: #EC4899;
                    }

                    &.total-price {
                        font-weight: 600;
                        color: var(--text-color);
                    }
                }
            }
        }

        tfoot {
            tr {
                background: #f9fafb;
                font-weight: bold;

                td {
                    padding: 1rem;
                    border-top: 2px solid #e5e7eb;
                    color: var(--text-color);
                }
            }
        }
    }
`;

export const EmptyState = styled.div`
    text-align: center;
    padding: 4rem 2rem;
    color: #9ca3af;

    .icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }

    h3 {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
        color: #6b7280;
    }

    p {
        color: #9ca3af;
    }
`;
