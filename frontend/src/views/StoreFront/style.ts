import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, #fef5f8 0%, #fff 100%);
    display: flex;
    flex-direction: column;
`;

export const Content = styled.main`
    width: 100%;
    margin: 0 auto;
    padding: 30px 12px;
    background: linear-gradient(135deg, hsl(346 77% 95%) 0%, hsl(346 77% 98%) 50%, hsl(142 71% 95%) 100%);
`;

export const PageTitle = styled.h1`
    color: var(--primary-color);
    font-size: 32px;
    text-align: center;
    margin-bottom: 40px;

    @media (max-width: 768px) {
        font-size: 24px;
        margin-bottom: 30px;
    }
`;

export const ProductGrid = styled.div`
    max-width: 1400px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(205px, 1fr));
    gap: 24px;
    margin: 0 auto;
    margin-bottom: 40px;

    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 16px;
    }
`;

export const EmptyState = styled.div`
    text-align: center;
    padding: 60px 20px;
    color: #999;

    svg {
        font-size: 64px;
        margin-bottom: 20px;
        color: #ddd;
    }

    h3 {
        font-size: 24px;
        margin-bottom: 10px;
        color: #666;
    }

    p {
        font-size: 16px;
    }
`;

export const LoaderContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
`;

export const DeliverySession = styled.section`
    padding: 40px;
    background: #fbfbfc;

    @media (max-width: 768px) {
        padding: 20px 10px;
    }
`;

export const ReviewSession = styled.section`
    padding: 40px;

    @media (max-width: 768px) {
        padding: 20px;
    }
`;

export const SessionTitle = styled.h2`
    text-align: center;
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 10px;

    strong {
        color: #e95578;
    }

    @media (max-width: 768px) {
        font-size: 18px;
        margin-bottom: 16px;
    }
`;

export const SessionContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    p {
        max-width: 700px;
        line-height: 1.6;
        color: #71717A;
        font-weight: 600;
        text-align: center;
        margin-bottom: 18px;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        img {
            max-width: 100%;
        }
    }
`;