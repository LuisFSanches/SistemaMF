import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    padding: 2rem;
    background: var(--background);

    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

export const ContentWrapper = styled.div`
    max-width: 1400px;
    margin: 0 auto;
`;

export const StatsCards = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
`;

export const StatCard = styled.div`
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;

    .icon {
        width: 3rem;
        height: 3rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: white;

        &.active {
            background: linear-gradient(135deg, #10B981, #059669);
        }

        &.inactive {
            background: linear-gradient(135deg, #EF4444, #DC2626);
        }

        &.total {
            background: linear-gradient(135deg, #3B82F6, #2563EB);
        }
    }

    .info {
        flex: 1;

        h4 {
            font-size: 0.9rem;
            color: var(--text-light);
            margin-bottom: 0.5rem;
        }

        p {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text-body);
        }
    }
`;

export const TableWrapper = styled.div`
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

export const TableHeader = styled.div`
    padding: 1.5rem;
    border-bottom: 2px solid var(--light-background);
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
        font-size: 1.5rem;
        color: var(--text-title);
    }

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }
`;

export const PlansTable = styled.table`
    width: 100%;
    border-spacing: 0;

    thead {
        background: var(--light-background);

        th {
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            color: var(--text-title);
            font-size: 0.95rem;

            &:last-child {
                text-align: center;
                width: 200px;
            }
        }
    }

    tbody {
        tr {
            border-bottom: 1px solid #f0f0f0;
            transition: background 0.2s;

            &:hover {
                background: #fafafa;
            }

            td {
                padding: 1.25rem 1rem;
                color: var(--text-body);
                font-size: 0.95rem;

                &:last-child {
                    text-align: center;
                }
            }
        }
    }

    @media (max-width: 768px) {
        display: block;

        thead {
            display: none;
        }

        tbody {
            display: block;

            tr {
                display: block;
                margin-bottom: 1rem;
                border: 1px solid #e5e7eb;
                border-radius: 0.5rem;
                padding: 1rem;

                td {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid #f0f0f0;

                    &:last-child {
                        border-bottom: none;
                        justify-content: flex-start;
                        gap: 0.5rem;
                    }

                    &::before {
                        content: attr(data-label);
                        font-weight: 600;
                        color: var(--text-light);
                    }
                }
            }
        }
    }
`;

export const PlanName = styled.div`
    font-weight: 600;
    font-size: 1.05rem;
`;

export const PlanDescription = styled.div`
    color: var(--text-light);
    font-size: 0.9rem;
    margin-top: 0.25rem;
`;

export const PlanPrice = styled.div`
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--primary-color);
`;

export const PlanCycle = styled.div<{ cycle: string }>`
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 0.8rem;
    border-radius: 2rem;
    font-size: 0.85rem;
    font-weight: 600;
    background: ${({ cycle }) => cycle === 'MONTHLY' ? '#DBEAFE' : '#FEF3C7'};
    color: ${({ cycle }) => cycle === 'MONTHLY' ? '#1E40AF' : '#92400E'};
`;

export const StatusBadge = styled.div<{ active: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.8rem;
    border-radius: 2rem;
    font-size: 0.85rem;
    font-weight: 600;
    background: ${({ active }) => active ? '#D1FAE5' : '#FEE2E2'};
    color: ${({ active }) => active ? '#065F46' : '#991B1B'};

    svg {
        font-size: 0.75rem;
    }
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 0.5rem;
    justify-content: center;

    button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.5rem;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &.edit {
            background: #DBEAFE;
            color: #1E40AF;

            &:hover {
                background: #BFDBFE;
            }
        }

        &.toggle {
            background: #FEF3C7;
            color: #92400E;

            &:hover {
                background: #FDE68A;
            }
        }

        &.delete {
            background: #FEE2E2;
            color: #991B1B;

            &:hover {
                background: #FECACA;
            }
        }
    }

    @media (max-width: 768px) {
        justify-content: flex-start;
    }
`;

export const EmptyState = styled.div`
    padding: 4rem 2rem;
    text-align: center;
    color: var(--text-light);

    svg {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    h3 {
        font-size: 1.3rem;
        margin-bottom: 0.5rem;
    }

    p {
        font-size: 1rem;
    }
`;

export const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    font-size: 1.1rem;
    color: var(--text-light);
`;
