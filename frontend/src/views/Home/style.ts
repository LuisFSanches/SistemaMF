import styled, { css } from "styled-components";

// Color variables based on the original Tailwind theme
const colors = {
    primary: "hsl(346, 77%, 60%)",
    primaryLight: "hsl(346, 77%, 70%)",
    primaryForeground: "#ffffff",
    secondary: "hsl(142, 71%, 45%)",
    secondaryLight: "hsl(142, 71%, 55%)",
    secondaryForeground: "#ffffff",
    background: "#ffffff",
    foreground: "hsl(240, 10%, 15%)",
    muted: "hsl(240, 4.8%, 95.9%)",
    mutedForeground: "hsl(240, 3.8%, 46.1%)",
    border: "hsl(240, 5.9%, 90%)",
    cardBackground: "#ffffff",
};

const gradients = {
    primary: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
    secondary: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryLight} 100%)`,
    hero: `linear-gradient(135deg, hsl(346, 77%, 95%) 0%, hsl(346, 77%, 98%) 50%, hsl(142, 71%, 95%) 100%)`,
    text: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
};

// ==================== Main Container ====================
export const HomeContainer = styled.main`
    min-height: 100vh;
    background-color: ${colors.background};

    h1,h2,h3 {
        font-family: 'ubuntu' !important;
    }
`;

// ==================== Navbar ====================
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
    padding: 0 16px;
`;

export const NavbarInner = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
`;

export const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;

    img {
        height: 40px;
        width: 40px;
    }
`;

export const LogoText = styled.span`
    font-size: 20px;
    font-weight: 700;
    background: ${gradients.text};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
`;

export const DesktopNav = styled.div`
    display: none;
    align-items: center;
    gap: 32px;

    @media (min-width: 768px) {
        display: flex;
    }
`;

export const NavButton = styled.button`
    background: none;
    border: none;
    color: ${colors.foreground};
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.2s ease;
    padding: 8px 0;

    &:hover {
        color: ${colors.primary};
    }
`;

export const MobileMenuButton = styled.button`
    display: block;
    padding: 8px;
    background: none;
    border: none;
    cursor: pointer;
    color: ${colors.foreground};

    @media (min-width: 768px) {
        display: none;
    }

    svg {
        width: 24px;
        height: 24px;
    }
`;

export const MobileNav = styled.div<{ $isOpen: boolean }>`
    display: ${(props) => (props.$isOpen ? "block" : "none")};
    padding: 16px 0;
    border-top: 1px solid ${colors.border};

    @media (min-width: 768px) {
        display: none;
    }
`;

export const MobileNavInner = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const MobileNavButton = styled.button`
    background: none;
    border: none;
    text-align: left;
    color: ${colors.foreground};
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.2s ease;
    padding: 8px;

    &:hover {
        color: ${colors.primary};
    }
`;

// ==================== Buttons ====================
export const PrimaryButton = styled.button<{ $size?: "sm" | "lg" }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: ${gradients.primary};
    color: ${colors.primaryForeground};
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 16px hsla(346, 77%, 60%, 0.2);

    ${(props) =>
        props.$size === "lg"
            ? css`
                  font-size: 18px;
                  height: 56px;
                  padding: 0 32px;
              `
            : css`
                  font-size: 14px;
                  height: 40px;
                  padding: 0 16px;
              `}

    &:hover {
        box-shadow: 0 8px 24px hsla(346, 77%, 60%, 0.3);
        transform: translateY(-1px);
    }

    svg {
        width: 20px;
        height: 20px;
    }
`;

export const OutlineButton = styled.button<{ $size?: "sm" | "lg"; $fullWidth?: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: transparent;
    color: ${colors.foreground};
    border: 2px solid ${colors.border};
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    ${(props) =>
        props.$size === "lg"
            ? css`
                  font-size: 18px;
                  height: 56px;
                  padding: 0 32px;
              `
            : css`
                  font-size: 14px;
                  height: 40px;
                  padding: 0 16px;
              `}

    ${(props) =>
        props.$fullWidth &&
        css`
            width: 100%;
        `}

    &:hover {
        border-color: ${colors.primary};
        color: ${colors.primary};
    }

    svg {
        width: 20px;
        height: 20px;
    }
`;

// ==================== Hero Section ====================
export const HeroSection = styled.section`
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: ${gradients.hero};
    padding-top: 64px;
`;

export const HeroPattern = styled.div`
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJoc2woMzQ2IDc3JSA2MCUgLyAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+");
    opacity: 0.4;
`;

export const HeroContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 16px;
    position: relative;
    z-index: 10;
`;

export const HeroGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 48px;
    align-items: center;

    @media (min-width: 1024px) {
        grid-template-columns: 1fr 1fr;
    }
`;

export const HeroContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
    text-align: center;

    @media (min-width: 1024px) {
        text-align: left;
    }
`;

export const HeroBadge = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 9999px;
    background-color: hsla(346, 77%, 60%, 0.1);
    color: ${colors.primary};
    font-weight: 500;
    font-size: 14px;
    width: fit-content;
    margin: 0 auto;

    @media (min-width: 1024px) {
        margin: 0;
    }

    svg {
        width: 16px;
        height: 16px;
    }
`;

export const HeroTitle = styled.h1`
    font-size: 48px;
    line-height: 1.1;
    font-weight: 700;
    color: ${colors.foreground};

    @media (min-width: 1024px) {
        font-size: 72px;
    }
`;

export const GradientText = styled.span`
    background: ${gradients.text};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
`;

export const HeroDescription = styled.p`
    font-size: 20px;
    color: ${colors.mutedForeground};
    max-width: 640px;
    line-height: 1.6;

    @media (min-width: 1024px) {
        max-width: none;
    }
`;

export const HeroButtons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: center;

    @media (min-width: 640px) {
        flex-direction: row;
    }

    @media (min-width: 1024px) {
        justify-content: flex-start;
    }
`;

export const HeroFeatures = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: center;
    padding-top: 16px;
    font-size: 14px;
    color: ${colors.mutedForeground};

    @media (min-width: 1024px) {
        justify-content: flex-start;
    }
`;

export const HeroFeatureItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const HeroFeatureDot = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${colors.secondary};
`;

export const HeroImageContainer = styled.div`
    position: relative;
`;

export const HeroImageGlow = styled.div`
    position: absolute;
    inset: 0;
    background: ${gradients.primary};
    opacity: 0.2;
    filter: blur(48px);
    border-radius: 50%;
`;

export const HeroImage = styled.img`
    position: relative;
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    width: 100%;
    height: auto;
`;

// ==================== Features Section ====================
export const FeaturesSection = styled.section`
    padding: 96px 0;
    background-color: ${colors.muted};
`;

export const SectionContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
`;

export const SectionHeader = styled.div`
    text-align: center;
    max-width: 768px;
    margin: 0 auto 64px;
`;

export const SectionTitle = styled.h2`
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 16px;
    color: ${colors.foreground};

    @media (min-width: 1024px) {
        font-size: 48px;
    }
`;

export const SectionDescription = styled.p`
    font-size: 20px;
    color: ${colors.mutedForeground};
    line-height: 1.6;
`;

export const FeaturesGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

export const FeatureCard = styled.div`
    background-color: ${colors.cardBackground};
    border: 2px solid ${colors.border};
    border-radius: 12px;
    padding: 24px;
    transition: all 0.3s ease;

    &:hover {
        border-color: hsla(346, 77%, 60%, 0.5);
        box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }
`;

export const FeatureIconContainer = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: ${gradients.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    transition: transform 0.3s ease;

    ${FeatureCard}:hover & {
        transform: scale(1.1);
    }

    svg {
        width: 24px;
        height: 24px;
        color: ${colors.primaryForeground};
    }
`;

export const FeatureTitle = styled.h3`
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
    color: ${colors.foreground};
`;

export const FeatureDescription = styled.p`
    font-size: 16px;
    color: ${colors.mutedForeground};
    line-height: 1.6;
`;

// ==================== Metrics Section ====================
export const MetricsSection = styled.section`
    padding: 96px 0;
    background-color: ${colors.background};
`;

export const MetricsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    max-width: 1100px;
    margin: 0 auto;

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

export const MetricCard = styled.div`
    background-color: ${colors.cardBackground};
    border: 2px solid ${colors.border};
    border-radius: 12px;
    padding: 32px 24px;
    text-align: center;
    transition: all 0.3s ease;

    &:hover {
        border-color: hsla(346, 77%, 60%, 0.5);
        box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1);
    }
`;

export const MetricValue = styled.div`
    font-size: 48px;
    font-weight: 700;
    background: ${gradients.text};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 12px;
    transition: transform 0.3s ease;

    ${MetricCard}:hover & {
        transform: scale(1.1);
    }

    @media (min-width: 1024px) {
        font-size: 60px;
    }
`;

export const MetricLabel = styled.h3`
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
    color: ${colors.foreground};
`;

export const MetricDescription = styled.p`
    font-size: 14px;
    color: ${colors.mutedForeground};
    line-height: 1.5;
`;

// ==================== Pricing Section ====================
export const PricingSection = styled.section`
    padding: 96px 0;
    background-color: ${colors.background};
`;

export const PricingGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    max-width: 900px;
    margin: 0 auto;

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

export const PricingCard = styled.div<{ $featured?: boolean }>`
    background-color: ${colors.cardBackground};
    border: 2px solid ${(props) => (props.$featured ? colors.primary : colors.border)};
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    transition: all 0.3s ease;

    ${(props) =>
        props.$featured &&
        css`
            box-shadow: 0 20px 60px -15px hsla(346, 77%, 60%, 0.3);
        `}

    &:hover {
        box-shadow: ${(props) =>
            props.$featured
                ? "0 25px 70px -15px hsla(346, 77%, 60%, 0.4)"
                : "0 10px 40px -10px rgba(0, 0, 0, 0.15)"};
        transform: translateY(-4px);
    }
`;

export const PricingBadge = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    background: ${gradients.secondary};
    color: ${colors.secondaryForeground};
    padding: 4px 16px;
    font-size: 14px;
    font-weight: 600;
`;

export const PricingHeader = styled.div`
    text-align: center;
    padding: 32px 24px;
`;

export const PricingTitle = styled.h3`
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
    color: ${colors.foreground};
`;

export const PricingDescription = styled.p`
    font-size: 16px;
    color: ${colors.mutedForeground};
`;

export const PricingPriceContainer = styled.div`
    margin-top: 24px;
`;

export const PricingPrice = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
`;

export const PricingAmount = styled.span`
    font-size: 48px;
    font-weight: 700;
    color: ${colors.foreground};
`;

export const PricingPeriod = styled.span`
    color: ${colors.mutedForeground};
`;

export const PricingDiscount = styled.div`
    margin-top: 8px;
`;

export const PricingOldPrice = styled.span`
    font-size: 14px;
    color: ${colors.mutedForeground};
    text-decoration: line-through;
`;

export const PricingNewPrice = styled.span`
    font-size: 18px;
    font-weight: 600;
    color: ${colors.secondary};
    margin-left: 8px;
`;

export const PricingSavings = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    padding: 4px 12px;
    border-radius: 9999px;
    background-color: hsla(142, 71%, 45%, 0.1);
    color: ${colors.secondary};
    font-size: 14px;
    font-weight: 500;
`;

export const PricingContent = styled.div`
    padding: 24px;
`;

export const PricingFeaturesList = styled.div`
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const PricingFeatureItem = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;

    svg {
        width: 20px;
        height: 20px;
        color: ${colors.secondary};
        flex-shrink: 0;
        margin-top: 2px;
    }

    span {
        font-size: 14px;
        color: ${colors.foreground};
    }
`;

export const PricingFooter = styled.div`
    text-align: center;
    margin-top: 48px;

    p {
        color: ${colors.mutedForeground};
    }
`;

// ==================== Benefits Section ====================
export const BenefitsSection = styled.section`
    padding: 96px 0;
    background-color: ${colors.muted};
`;

export const BenefitsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

export const BenefitCard = styled.div`
    background-color: ${colors.cardBackground};
    border: 2px solid ${colors.border};
    border-radius: 12px;
    padding: 24px;
    transition: all 0.3s ease;

    &:hover {
        border-color: hsla(346, 77%, 60%, 0.5);
        box-shadow: 0 8px 30px -10px rgba(0, 0, 0, 0.08);
    }
`;

export const BenefitIconContainer = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: ${gradients.secondary};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;

    svg {
        width: 24px;
        height: 24px;
        color: ${colors.secondaryForeground};
    }
`;

export const BenefitTitle = styled.h3`
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
    color: ${colors.foreground};
`;

export const BenefitDescription = styled.p`
    font-size: 16px;
    color: ${colors.mutedForeground};
    line-height: 1.6;
`;
