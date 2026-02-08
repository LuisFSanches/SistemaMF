import styled from "styled-components";

export const FooterContainer = styled.footer`
    background-color: #2d3748;
    color: #e2e8f0;
    width: 100%;
    margin-top: auto;
`;

export const FooterContent = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 20px 40px;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
    gap: 40px;

    @media (max-width: 968px) {
        grid-template-columns: 1fr 1fr;
        gap: 30px;
    }

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
        gap: 30px;
    }
`;

export const FooterColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;

    img {
        max-width: 100px;
        align-self: anchor-center;
    }
`;

export const FooterTitle = styled.h3`
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
    margin-bottom: 8px;
`;

export const FooterDescription = styled.p`
    font-size: 14px;
    line-height: 1.6;
    color: #cbd5e0;
    margin: 0;
`;

export const FooterLinkList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const FooterLink = styled.a`
    color: #cbd5e0;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s ease;

    &:hover {
        color: #ffffff;
    }
`;

export const ContactItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: #cbd5e0;
    padding: 8px 12px;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 6px;

    svg {
        font-size: 16px;
        color: #90cdf4;
    }

    span {
        flex: 1;
    }
`;

export const FooterBottom = styled.div`
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 600px) {
        flex-direction: column;
        gap: 16px;
        text-align: center;
    }
`;

export const Copyright = styled.p`
    margin: 0;
    font-size: 14px;
    color: #a0aec0;
`;

export const BottomLinks = styled.div`
    display: flex;
    gap: 24px;

    @media (max-width: 600px) {
        flex-direction: column;
        gap: 12px;
    }
`;
