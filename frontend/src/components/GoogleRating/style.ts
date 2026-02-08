import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 0rem 1rem;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;

    @media (max-width: 768px) {
        padding: 2rem 1rem;
        gap: 0.75rem;
    }
`;

export const StarsContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 3rem;
    width: 50%;
    max-width: 450px;

    .star {
        font-size: 3.3rem;
        flex: 1;

        &.filled {
            color: #f59e0b;
            filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3));
        }

        &.empty {
            color: #d1d5db;
        }
    }

    @media (max-width: 768px) {
        width: 80%;
        gap: 0.5rem;

        .star {
            font-size: 2.5rem;
        }
    }

    @media (max-width: 480px) {
        width: 90%;

        .star {
            font-size: 2rem;
        }
    }
`;

export const RatingValue = styled.span`
    font-size: 5rem;
    font-weight: 800;
    color: #1f2937;
    line-height: 1;
    margin-top: 0.5rem;

    @media (max-width: 768px) {
        font-size: 3.5rem;
    }

    @media (max-width: 480px) {
        font-size: 3rem;
    }
`;

export const ReviewCount = styled.p`
    font-size: 1.25rem;
    color: #6b7280;
    margin: 0;
    font-weight: 500;

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

export const Tagline = styled.p`
    font-size: 1rem;
    color: #374151;
    font-weight: 600;
    text-align: center;
    margin-bottom: 10px;

    @media (max-width: 768px) {
        font-size: 1.125rem;
    }

    @media (max-width: 480px) {
        font-size: 1rem;
    }
`;

export const ReviewButton = styled.a`
    display: inline-block;
    padding: 1rem 2.5rem;
    background-color: var(--primary-color);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 700;
    font-size: 1.125rem;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    &:active {
        transform: translateY(-1px);
    }

    @media (max-width: 768px) {
        width: auto;
        padding: 0.875rem 2rem;
        font-size: 1rem;
    }

    @media (max-width: 480px) {
        width: 90%;
        text-align: center;
    }
`;
