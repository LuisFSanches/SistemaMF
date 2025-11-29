import styled from 'styled-components';

export const Container = styled.div`
    padding: 2rem;
    width: 100%;
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
    margin-bottom: 0.7rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid #f3f4f6;

    .back-button {
        min-width: 42px;
        width: 48px;
        height: 48px;
        margin-right: 1rem;
        border-radius: 12px;
        border: none;
        background: #EC4899;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            opacity: 0.7;
        }
    }

    .order-info-container {
        max-width: 98vw;
        width: 100%;
        display: flex;
        align-items: center;
        flex: 1;
        padding: 2rem;
        border-radius: 12px;
        background: white;

        h1 {
            font-size: 1.75rem;
            color: #111827;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;

            .order-code {
                color: #ec4899;
                font-weight: 700;
            }

            .type-badge {
                padding: 0.25rem 0.75rem;
                border-radius: 6px;
                font-size: 0.875rem;
                font-weight: 600;

                &.online {
                    background: #dbeafe;
                    color: #1e40af;
                    border: 1px solid #1e40af;
                }

                &.whatsapp {
                    background: rgb(84, 142, 142);
                    color: white;
                }

                &.on_store {
                    background: #71265D;
                    color: white;
                }

                &.pdv {
                    background: #EC4899;
                    color: white;
                }
            }
        }

        .description {
            font-size: 1.1rem;
            color: #6b7280;
            margin-bottom: 0.75rem;
        }

        .order-meta {
            display: flex;
            gap: 2rem;
            flex-wrap: wrap;
            align-items: center;

            p {
                font-size: 0.875rem;
                color: #6b7280;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin: 0;

                svg {
                    color: #ec4899;
                }

                strong {
                    color: #374151;
                    font-weight: 600;
                }
            }

            .delivery-date {
                color: #9ca3af;
            }

            .order-status {
                color: #6b7280;
            }

            .created-by {
                color: #6b7280;
            }
        }
    }

    @media (max-width: 768px) {
        width: 100%;
        flex-direction: column;
        align-items: flex-start;

        .order-info {
            h1 {
                font-size: 1.5rem;
                flex-direction: column;
                align-items: flex-start;
            }

            .order-meta {
                flex-direction: column;
                gap: 0.5rem;
                align-items: flex-start;
            }
        }
    }
`;

export const MetricsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

interface MetricCardProps {
    color: string;
}

export const MetricCard = styled.div<MetricCardProps>`
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    border-left: 4px solid ${props => props.color};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;

    &:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }

    .metric-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;

        .icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: ${props => props.color}15;
            color: ${props => props.color};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
        }

        .metric-label {
            font-size: 0.875rem;
            color: #6b7280;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    }

    .metric-value {
        font-size: 1.75rem;
        font-weight: 700;
        color: #111827;
        margin-bottom: 0.5rem;
    }

    .metric-trend {
        font-size: 0.875rem;
        color: #9ca3af;

        &.positive {
            color: #10b981;
        }

        &.negative {
            color: #ef4444;
        }

        &.neutral {
            color: #6b7280;
        }

        svg {
            margin-right: 0.25rem;
        }
    }
`;

export const InfoSection = styled.div`
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    &.flex-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }

    h2 {
        font-size: 1.25rem;
        color: #111827;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;

        svg {
            color: #ec4899;
        }
    }

    .subtitle {
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: 1.5rem;
    }

    .description-items {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        .description-item {
            padding: 0.75rem 1rem;
            background: #f9fafb;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            color: #4B5462;
            border-left: 3px solid #ec4899;
        }
    }

    .info-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .info-item {
        .label {
            font-size: 0.75rem;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }

        .value {
            font-size: 1rem;
            color: #111827;
            font-weight: 500;
        }
    }

    .address-block {
        border-radius: 8px;

        .address-line {
            margin-bottom: 0.5rem;
            color: #374151;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    .card-message-block {
        padding: 1rem;
        background: #fef3f8;
        border-radius: 8px;
        border-left: 4px solid #ec4899;
        margin-bottom: 1.2rem;

        .card-header {
            font-size: 0.875rem;
            color: #9ca3af;
            margin-bottom: 0.5rem;
        }

        .card-message {
            font-size: 1rem;
            color: #374151;
            font-style: italic;
            margin-bottom: 1rem;
        }

        .card-signature {
            display: flex;
            gap: 1rem;
            font-size: 0.875rem;
            color: #6b7280;

            span {
                font-weight: 600;
            }
        }
    }

    @media (max-width: 768px) {
        .info-grid {
            grid-template-columns: 1fr;
        }
    }
`;

export const InfoSectionDetail = styled.div`
    display: flex;
    flex-direction: column;
    border-right: 2px solid #ec4899;
    margin-right: 15px;

    @media (max-width: 900px) {
        margin-bottom: 1.2rem;
        border-right: none;
    }
`;

export const StatusBadge = styled.span`
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;

    &.paid {
        background: #d1fae5;
        color: #065f46;
    }

    &.pending {
        background: #fed7aa;
        color: #92400e;
    }
`;

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
        font-size: 0.875rem;
        color: #9ca3af;
    }
`;
