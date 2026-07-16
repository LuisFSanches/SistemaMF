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

    .section-title {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 30px;
        font-size: 40px;

        strong {
            color: #e95578;
            margin-left: 10px;
        }

        @media (max-width: 768px) {
            font-size: 20px;
            margin-bottom: 20px;
        }
    }
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

export const FloatingWhatsAppButton = styled.button`
    position: fixed;
    bottom: 30px;
    right: 20px;
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
    gap: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 999;
    padding: 0;

    &:hover .whatsapp-bubble {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
    }

    &:hover .whatsapp-avatar {
        transform: scale(1.06);
    }

    @media (max-width: 768px) {
        bottom: 20px;
        right: 20px;
        gap: 8px;
    }
`;

export const WhatsAppBubble = styled.span`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: #25d366;
    color: #fff;
    padding: 8px 16px 8px 14px;
    border-radius: 18px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    text-align: left;
    line-height: 1.25;

    strong {
        font-size: 13px;
        font-weight: 700;
    }

    span {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 500;
        opacity: 0.95;
    }

    svg {
        width: 13px;
        height: 13px;
        flex-shrink: 0;
    }
`;

export const WhatsAppAvatarWrapper = styled.span`
    position: relative;
    width: 75px;
    height: 75px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
    transition: transform 0.25s ease;

    .whatsapp-status-dot {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 16px;
        height: 16px;
        background: #25d366;
        border: 2px solid #fff;
        border-radius: 50%;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }

    @media (max-width: 768px) {
        width: 70px;
        height: 70px;
    }
`;