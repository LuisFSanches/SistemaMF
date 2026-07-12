import styled from 'styled-components';

export const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    
    h2 {
        font-size: 2rem;
        color: var(--text-title);
        text-align: center;
        margin-bottom: 2rem;
    }
`;

export const TrialWarning = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: #FEF3C7;
    border: 2px solid #F59E0B;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
    gap: 0.75rem;

    svg {
        color: #F59E0B;
        font-size: 1.5rem;
    }

    span {
        color: #92400E;
        font-size: 1rem;
        
        strong {
            color: #B45309;
        }
    }
`;

export const PlansContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 2rem 0;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

export const PlanCard = styled.div<{ isRecommended?: boolean }>`
    position: relative;
    background: white;
    border: ${({ isRecommended }) => 
        isRecommended ? '3px solid #EC4899' : '2px solid #e7b7c2'};
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: ${({ isRecommended }) => 
        isRecommended ? '0 8px 16px rgba(236, 72, 153, 0.2)' : '0 4px 8px rgba(0, 0, 0, 0.1)'};
    transition: transform 0.3s, box-shadow 0.3s;
    transform: ${({ isRecommended }) => isRecommended ? 'scale(1.05)' : 'scale(1)'};

    &:hover {
        transform: ${({ isRecommended }) => isRecommended ? 'scale(1.08)' : 'scale(1.03)'};
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .recommended-badge {
        position: absolute;
        top: -12px;
        right: 20px;
        background: linear-gradient(135deg, #EC4899, #DB2777);
        color: white;
        padding: 0.4rem 1rem;
        border-radius: 2rem;
        font-size: 0.85rem;
        font-weight: 700;
        box-shadow: 0 4px 8px rgba(236, 72, 153, 0.3);
    }
`;

export const PlanHeader = styled.div`
    text-align: center;
    margin-bottom: 1.5rem;

    h3 {
        font-size: 1.5rem;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
    }

    p {
        color: var(--text-light);
        font-size: 0.95rem;
    }
`;

export const PlanPrice = styled.div`
    text-align: center;
    margin-bottom: 2rem;
    padding: 1.5rem 0;
    border-top: 1px solid #e7b7c2;
    border-bottom: 1px solid #e7b7c2;

    .price {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
    }

    .cycle {
        color: var(--text-light);
        font-size: 0.95rem;
    }
`;

export const PlanFeatures = styled.ul`
    list-style: none;
    padding: 0;
    margin: 1.5rem 0;

    li {
        display: flex;
        align-items: center;
        padding: 0.75rem 0;
        color: var(--text-body);
        
        svg {
            color: var(--green);
            margin-right: 0.75rem;
            font-size: 1.1rem;
            flex-shrink: 0;
        }

        span {
            font-size: 0.95rem;
        }

        &.highlight {
            background: #FEF3C7;
            padding: 0.75rem;
            border-radius: 0.5rem;
            margin-top: 0.5rem;

            svg {
                color: #F59E0B;
            }

            span {
                color: #92400E;
            }
        }
    }
`;

export const PlanFooter = styled.div`
    margin-top: 2rem;

    button {
        width: 100%;
        height: 3.5rem;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    }
`;

export const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
`;
