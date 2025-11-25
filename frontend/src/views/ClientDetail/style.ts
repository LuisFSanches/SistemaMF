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

    .client-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
        margin-left: 1rem;

        .avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #EC4899 0%, #8b5cf6 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
        }

        div {
            h1 {
                font-size: 1.8rem;
                color: var(--text-color);
                margin: 0;
            }

            .phone {
                color: #666;
                margin: 0.2rem 0;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .member-since {
                color: #999;
                font-size: 0.9rem;
                margin: 0;
            }
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
                text-align: left;
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

                    &.order-code {
                        font-weight: 700;
                        color: #EC4899;
                    }

                    &.total-price {
                        font-weight: 600;
                        color: var(--text-color);
                    }

                    .status-badge {
                        padding: 0.25rem 0.75rem;
                        border-radius: 12px;
                        font-size: 0.75rem;
                        font-weight: 600;
                        display: inline-block;

                        &.delivered {
                            background: #d1fae5;
                            color: #065f46;
                        }

                        &.in-progress {
                            background: #fef3c7;
                            color: #92400e;
                        }

                        &.cancelled {
                            background: #fee2e2;
                            color: #991b1b;
                        }
                    }

                    .order-type {
                        display: flex;
                        gap: 0.5rem;

                        .badge {
                            padding: 0.2rem 0.5rem;
                            border-radius: 4px;
                            font-size: 0.7rem;
                            font-weight: 600;

                            &.online {
                                background: #dbeafe;
                                color: #1e40af;
                            }

                            &.store {
                                background: #fce7f3;
                                color: #9f1239;
                            }

                            &.pickup {
                                background: #e0e7ff;
                                color: #3730a3;
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const AddressesSection = styled.div`
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

    .addresses-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
    }

    .address-card {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 1rem;
        transition: all 0.3s;

        &:hover {
            border-color: #EC4899;
            box-shadow: 0 2px 8px rgba(236, 72, 153, 0.15);
        }

        .address-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
            color: #EC4899;
            font-weight: 600;
        }

        .address-content {
            color: #4b5563;
            line-height: 1.6;

            p {
                margin: 0.25rem 0;
                font-size: 0.9rem;
            }

            .reference {
                color: #6b7280;
                font-style: italic;
                margin-top: 0.5rem;
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
