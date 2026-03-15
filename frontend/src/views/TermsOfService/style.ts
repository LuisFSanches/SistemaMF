import styled from "styled-components";

const colors = {
    primary: "hsl(346, 77%, 60%)",
    primaryLight: "hsl(346, 77%, 70%)",
    primaryForeground: "#ffffff",
    background: "#ffffff",
    foreground: "hsl(240, 10%, 15%)",
    muted: "hsl(240, 4.8%, 95.9%)",
    mutedForeground: "hsl(240, 3.8%, 46.1%)",
    border: "hsl(240, 5.9%, 90%)",
};

export const PageContainer = styled.main`
    min-height: 100vh;
    background-color: ${colors.background};

    h1, h2, h3 {
        font-family: 'ubuntu' !important;
    }
`;

export const NavbarContainer = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid ${colors.border};
`;

export const NavbarContent = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
`;

export const NavbarInner = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 4rem;
`;

export const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    flex-shrink: 0;

    img {
        height: 2rem;
        width: auto;
    }
`;

export const LogoText = styled.span`
    font-size: 1.25rem;
    font-weight: 700;
    color: ${colors.foreground};
`;

export const DesktopNav = styled.div`
    display: none;

    @media (min-width: 768px) {
        display: flex;
        align-items: center;
        gap: 2rem;
    }
`;

export const NavButton = styled.button`
    background: none;
    border: none;
    color: ${colors.foreground};
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
        color: ${colors.primary};
    }
`;

export const MobileMenuButton = styled.button`
    display: block;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: ${colors.foreground};
    cursor: pointer;

    @media (min-width: 768px) {
        display: none;
    }
`;

export const MobileNav = styled.div`
    border-top: 1px solid ${colors.border};

    @media (min-width: 768px) {
        display: none;
    }
`;

export const MobileNavInner = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
`;

export const MobileNavButton = styled.button`
    background: none;
    border: none;
    color: ${colors.foreground};
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.75rem 1rem;
    text-align: left;
    cursor: pointer;
    border-radius: 0.375rem;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${colors.muted};
    }
`;

export const PrimaryButton = styled.button`
    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%);
    color: ${colors.primaryForeground};
    border: none;
    padding: 0.5rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    &:active {
        transform: translateY(0);
    }
`;

export const ContentSection = styled.section`
    padding: 5rem 1rem 3rem;
    background-color: ${colors.background};
    min-height: calc(100vh - 4rem);
`;

export const ContentContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
`;

export const ContentTitle = styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    color: ${colors.foreground};
    margin-bottom: 0.5rem;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;

export const LastUpdate = styled.p`
    font-size: 0.875rem;
    color: ${colors.mutedForeground};
    text-align: center;
    margin-bottom: 3rem;
`;

export const ContentBody = styled.div`
    line-height: 1.8;
    color: ${colors.foreground};
    
    p {
        margin-bottom: 1rem;
        font-size: 1rem;
    }

    h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: ${colors.foreground};
        margin-top: 2.5rem;
        margin-bottom: 1rem;
    }

    ul {
        margin-left: 2rem;
        margin-bottom: 1rem;
        list-style-type: disc;
    }

    li {
        margin-bottom: 0.5rem;
        font-size: 1rem;
    }
`;
