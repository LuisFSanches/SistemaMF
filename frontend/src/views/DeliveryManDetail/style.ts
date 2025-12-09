import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
    padding: 2rem;
    max-width: 98vw;
    margin: 0 auto;

    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

export const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    flex-wrap: wrap;

    .back-button {
        background: #EC4899;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
        color: white;
        font-size: 1.2rem;

        &:hover {
            opacity: 0.8;
            transform: translateY(-2px);
        }
    }

    .client-info {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        flex: 1;
        justify-content: space-between;

        .info-left {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }

        .info-right {
            margin-right: 90px;
        }

        .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            font-weight: bold;
            color: white;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

            &.delivery {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            }
        }

        h1 {
            font-size: 1.8rem;
            color: #1f2937;
            margin: 0 0 0.5rem 0;
        }

        .phone {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #6b7280;
            font-size: 1rem;
            margin: 0 0 0.25rem 0;

            svg {
                color: #666;
            }
        }

        .member-since {
            color: #9ca3af;
            font-size: 0.9rem;
            margin: 0;
        }
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        padding: 1.5rem;

        .client-info {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
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

export const MetricCard = styled.div<{ color: string }>`
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-left: 4px solid ${props => props.color};
    transition: all 0.2s;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
    }

    .metric-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;

        .icon {
            width: 48px;
            height: 48px;
            border-radius: 10px;
            background: ${props => props.color}15;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${props => props.color};
            font-size: 1.3rem;
        }

        .metric-label {
            font-size: 0.95rem;
            color: #6b7280;
            font-weight: 500;
        }
    }

    .metric-value {
        font-size: 2rem;
        font-weight: bold;
        color: #1f2937;
        margin-bottom: 0.5rem;
    }

    .metric-trend {
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;

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
        font-size: 1.4rem;
        color: #1f2937;
        margin: 0 0 0.5rem 0;
        display: flex;
        align-items: center;
        gap: 0.75rem;

        svg {
            color: #EC4899;
        }
    }

    .subtitle {
        color: #6b7280;
        font-size: 0.9rem;
        margin: 0 0 1.5rem 0;
    }

    @media (max-width: 768px) {
        padding: 1.5rem;
    }
`;

export const TableSection = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;

    @media (max-width: 768px) {
        padding: 1.5rem;
    }
`;

export const TableHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
`;

export const TableTitle = styled.div`
    h2 {
        font-size: 1.4rem;
        color: #1f2937;
        margin: 0 0 0.5rem 0;
        display: flex;
        align-items: center;
        gap: 0.75rem;

        svg {
            color: #EC4899;
        }
    }

    .subtitle {
        color: #6b7280;
        font-size: 0.9rem;
        margin: 0;
    }
`;

export const TableFilters = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;

    @media (max-width: 768px) {
        width: 100%;
        flex-direction: column;
    }
`;

export const TableContent = styled.div`

    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;

        thead {
            background: #f9fafb;

            th {
                padding: 1rem;
                text-align: center;
                font-weight: 600;
                color: #374151;
                font-size: 0.9rem;
                border-bottom: 2px solid #e5e7eb;
            }
        }

        tbody {
            tr {
                border-bottom: 1px solid #e5e7eb;
                transition: background 0.2s;

                &:hover {
                    background: #f9fafb;
                }

                td {
                    padding: 1rem;
                    color: #4b5563;

                    &.order-code {
                        font-weight: 600;
                        color: #EC4899;
                    }

                    &.delivery-fee {
                        font-weight: 600;
                        color: #10b981;
                    }

                    .status-badge {
                        display: inline-block;
                        padding: 0.35rem 0.75rem;
                        border-radius: 6px;
                        font-size: 0.85rem;
                        font-weight: 500;

                        &.paid {
                            background: #d1fae5;
                            color: #065f46;
                        }

                        &.pending {
                            background: #fef3c7;
                            color: #92400e;
                        }
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        padding: 1.5rem;
        overflow-x: auto;
        padding-top: 0px;

        table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;

            thead {
                display: none;
            }

            tbody {
                display: block;

                tr {
                    display: block;
                    margin-bottom: 1rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 1rem;

                    td {
                        display: flex;
                        justify-content: space-between;
                        padding: 0.5rem 0;
                        border: none;

                        &:before {
                            content: attr(data-label);
                            font-weight: 600;
                            color: #6b7280;
                        }
                    }
                }
            }
        }
    }
`;

export const EmptyState = styled.div`
    text-align: center;
    padding: 3rem 2rem;
    color: #6b7280;

    .icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.3;
    }

    h3 {
        font-size: 1.3rem;
        color: #374151;
        margin: 0 0 0.5rem 0;
    }

    p {
        font-size: 1rem;
        margin: 0;
    }
`;
