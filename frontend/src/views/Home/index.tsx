import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faStar,
    faBars,
    faCartShopping,
    faUsers,
    faBox,
    faCreditCard,
    faChartBar,
    faTruck,
    faStore,
    faWandMagicSparkles,
    faCommentDots,
    faFileLines,
    faBolt,
    faShield,
    faArrowTrendUp,
    faClock,
    faHeart,
    faGlobe,
    faCheck,
} from "@fortawesome/free-solid-svg-icons";

import logo from "../../assets/images/logo.png";
import heroImage from "../../assets/images/hero-image.png";
import { StoreFrontFooter } from "../../components/StoreFrontFooter";

import {
    HomeContainer,
    NavbarContainer,
    NavbarContent,
    NavbarInner,
    LogoContainer,
    LogoText,
    DesktopNav,
    NavButton,
    MobileMenuButton,
    MobileNav,
    MobileNavInner,
    MobileNavButton,
    PrimaryButton,
    OutlineButton,
    HeroSection,
    HeroPattern,
    HeroContainer,
    HeroGrid,
    HeroContent,
    HeroBadge,
    HeroTitle,
    GradientText,
    HeroDescription,
    HeroButtons,
    HeroFeatures,
    HeroFeatureItem,
    HeroFeatureDot,
    HeroImageContainer,
    HeroImageGlow,
    HeroImage,
    FeaturesSection,
    SectionContainer,
    SectionHeader,
    SectionTitle,
    SectionDescription,
    FeaturesGrid,
    FeatureCard,
    FeatureIconContainer,
    FeatureTitle,
    FeatureDescription,
    MetricsSection,
    MetricsGrid,
    MetricCard,
    MetricValue,
    MetricLabel,
    MetricDescription,
    PricingSection,
    PricingGrid,
    PricingCard,
    PricingBadge,
    PricingHeader,
    PricingTitle,
    PricingDescription,
    PricingPriceContainer,
    PricingPrice,
    PricingAmount,
    PricingPeriod,
    PricingDiscount,
    PricingOldPrice,
    PricingNewPrice,
    PricingSavings,
    PricingContent,
    PricingFeaturesList,
    PricingFeatureItem,
    PricingFooter,
    BenefitsSection,
    BenefitsGrid,
    BenefitCard,
    BenefitIconContainer,
    BenefitTitle,
    BenefitDescription,
} from "./style";

const features = [
    {
        icon: faCartShopping,
        title: "Gestão de Pedidos",
        description:
            "Múltiplos canais: balcão, online, WhatsApp e ordens de serviço. Fluxo inteligente com 6 status personalizáveis.",
    },
    {
        icon: faUsers,
        title: "CRM Completo",
        description:
            "Perfil detalhado de clientes, histórico de compras, análise de gastos e identificação de melhores clientes.",
    },
    {
        icon: faBox,
        title: "Controle de Estoque",
        description:
            "Gestão completa com entrada/saída, QR Codes automáticos, alertas de estoque baixo e histórico de movimentações.",
    },
    {
        icon: faCreditCard,
        title: "Sistema de Pagamentos",
        description:
            "Dinheiro, Pix e cartão. Controle financeiro com valores a receber, boletos e confirmação automática via webhook.",
    },
    {
        icon: faChartBar,
        title: "Dashboard e Análises",
        description:
            "Métricas em tempo real, gráficos de vendas, top vendedores e clientes, filtros temporais personalizados.",
    },
    {
        icon: faTruck,
        title: "Gestão de Entregas",
        description:
            "Cadastro de entregadores, atribuição de pedidos, controle de pagamentos e rastreamento completo.",
    },
    {
        icon: faStore,
        title: "Loja Online Integrada",
        description:
            "E-commerce completo com catálogo, carrinho, checkout simplificado e design responsivo. Tudo incluído!",
    },
    {
        icon: faWandMagicSparkles,
        title: "Inteligência Artificial",
        description:
            "Criação de pedidos por linguagem natural. Cliente descreve o pedido e a IA extrai automaticamente os dados.",
    },
    {
        icon: faCommentDots,
        title: "Integração WhatsApp",
        description:
            "Receba pedidos automaticamente via WhatsApp com notificações em tempo real usando Socket.IO.",
    },
    {
        icon: faFileLines,
        title: "Gestão de Cartões",
        description:
            "Sistema completo para mensagens personalizadas com impressão automática em PDF. Exclusivo para floriculturas!",
    },
];

const metrics = [
    {
        value: "4h",
        label: "Tempo Economizado",
        description: "Por dia em tarefas administrativas",
    },
    {
        value: "85%",
        label: "Maior Retorno",
        description: "Dos clientes pela facilidade da compra online",
    },
    {
        value: "2min",
        label: "Criação de Pedidos",
        description: "Tempo médio com nosso sistema otimizado",
    },
    {
        value: "24h",
        label: "Implementação Rápida",
        description: "Sistema pronto e funcionando em um dia",
    },
    {
        value: "100%",
        label: "Integração Completa",
        description: "Pedidos, estoque, clientes e financeiro unidos",
    },
    {
        value: "30 dias",
        label: "Retorno do Investimento",
        description: "ROI comprovado com aumento de vendas",
    },
];

const pricingFeatures = [
    "Gestão completa de pedidos",
    "CRM com análise de clientes",
    "Controle de estoque com QR Code",
    "Loja online integrada",
    "Integração WhatsApp",
    "IA para criação de pedidos",
    "Dashboard em tempo real",
    "Gestão de entregas",
    "Sistema de pagamentos (Pix, cartão, dinheiro)",
    "Relatórios e estatísticas avançadas",
    "Múltiplos usuários e níveis de acesso",
    "Suporte técnico especializado",
];

const benefits = [
    {
        icon: faBolt,
        title: "Implementação Rápida",
        description: "Sistema pronto em 24 horas. Comece a vender no mesmo dia.",
    },
    {
        icon: faClock,
        title: "Economize Tempo",
        description: "Automatize processos manuais e crie pedidos em menos de 2 minutos.",
    },
    {
        icon: faArrowTrendUp,
        title: "Aumente suas Vendas",
        description: "Loja online 24/7 + integração WhatsApp = mais vendas sempre.",
    },
    {
        icon: faShield,
        title: "Seguro e Confiável",
        description: "Seus dados protegidos com criptografia e backups automáticos.",
    },
    {
        icon: faHeart,
        title: "Feito para Floriculturas",
        description: "Não é um ERP genérico. É especializado no seu negócio.",
    },
    {
        icon: faGlobe,
        title: "Acesse de Qualquer Lugar",
        description: "Sistema na nuvem. Gerencie seu negócio de onde estiver.",
    },
];

export function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setIsMenuOpen(false);
        }
    };

    return (
        <HomeContainer>
            {/* Navbar */}
            <NavbarContainer>
                <NavbarContent>
                    <NavbarInner>
                        <LogoContainer onClick={() => scrollToSection("hero")}>
                            <img src={logo} alt="SistemaMF" />
                            <LogoText>SistemaMF</LogoText>
                        </LogoContainer>

                        <DesktopNav>
                            <NavButton onClick={() => scrollToSection("funcionalidades")}>
                                Funcionalidades
                            </NavButton>
                            <NavButton onClick={() => scrollToSection("metricas")}>
                                Resultados
                            </NavButton>
                            <NavButton onClick={() => scrollToSection("precos")}>
                                Preços
                            </NavButton>
                            <NavButton onClick={() => scrollToSection("contato")}>
                                Contato
                            </NavButton>
                            <PrimaryButton $size="sm">Começar Agora</PrimaryButton>
                        </DesktopNav>

                        <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <FontAwesomeIcon icon={faBars} />
                        </MobileMenuButton>
                    </NavbarInner>

                    <MobileNav $isOpen={isMenuOpen}>
                        <MobileNavInner>
                            <MobileNavButton onClick={() => scrollToSection("funcionalidades")}>
                                Funcionalidades
                            </MobileNavButton>
                            <MobileNavButton onClick={() => scrollToSection("metricas")}>
                                Resultados
                            </MobileNavButton>
                            <MobileNavButton onClick={() => scrollToSection("precos")}>
                                Preços
                            </MobileNavButton>
                            <MobileNavButton onClick={() => scrollToSection("contato")}>
                                Contato
                            </MobileNavButton>
                            <PrimaryButton $size="sm">Começar Agora</PrimaryButton>
                        </MobileNavInner>
                    </MobileNav>
                </NavbarContent>
            </NavbarContainer>

            {/* Hero Section */}
            <HeroSection id="hero">
                <HeroPattern />
                <HeroContainer>
                    <HeroGrid>
                        <HeroContent>
                            <HeroBadge>
                                <FontAwesomeIcon icon={faStar} />
                                Sistema Especializado em Floriculturas
                            </HeroBadge>

                            <HeroTitle>
                                Gestão Completa para sua{" "}
                                <GradientText>Floricultura</GradientText>
                            </HeroTitle>

                            <HeroDescription>
                                Gerencie pedidos, clientes, estoque e vendas online em um único
                                sistema. Com IA integrada, notificações em tempo real e loja
                                online incluída.
                            </HeroDescription>

                            <HeroButtons>
                                <PrimaryButton $size="lg">
                                    Começar Agora
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </PrimaryButton>
                                <OutlineButton $size="lg">Ver Demonstração</OutlineButton>
                            </HeroButtons>

                            <HeroFeatures>
                                <HeroFeatureItem>
                                    <HeroFeatureDot />
                                    <span>Implementação em 24h</span>
                                </HeroFeatureItem>
                                <HeroFeatureItem>
                                    <HeroFeatureDot />
                                    <span>Suporte especializado</span>
                                </HeroFeatureItem>
                                <HeroFeatureItem>
                                    <HeroFeatureDot />
                                    <span>ROI em 30 dias</span>
                                </HeroFeatureItem>
                            </HeroFeatures>
                        </HeroContent>

                        <HeroImageContainer>
                            <HeroImageGlow />
                            <HeroImage
                                src={heroImage}
                                alt="Dashboard do SistemaMF mostrando gestão de pedidos e estoque"
                            />
                        </HeroImageContainer>
                    </HeroGrid>
                </HeroContainer>
            </HeroSection>

            {/* Features Section */}
            <FeaturesSection id="funcionalidades">
                <SectionContainer>
                    <SectionHeader>
                        <SectionTitle>
                            Tudo que sua floricultura precisa em{" "}
                            <GradientText>um só lugar</GradientText>
                        </SectionTitle>
                        <SectionDescription>
                            Funcionalidades especializadas desenvolvidas especificamente para o
                            seu negócio
                        </SectionDescription>
                    </SectionHeader>

                    <FeaturesGrid>
                        {features.map((feature, index) => (
                            <FeatureCard key={index}>
                                <FeatureIconContainer>
                                    <FontAwesomeIcon icon={feature.icon} />
                                </FeatureIconContainer>
                                <FeatureTitle>{feature.title}</FeatureTitle>
                                <FeatureDescription>{feature.description}</FeatureDescription>
                            </FeatureCard>
                        ))}
                    </FeaturesGrid>
                </SectionContainer>
            </FeaturesSection>

            {/* Metrics Section */}
            <MetricsSection id="metricas">
                <SectionContainer>
                    <SectionHeader>
                        <SectionTitle>
                            Resultados <GradientText>Comprovados</GradientText>
                        </SectionTitle>
                        <SectionDescription>
                            Números reais de floriculturas que já usam o SistemaMF
                        </SectionDescription>
                    </SectionHeader>

                    <MetricsGrid>
                        {metrics.map((metric, index) => (
                            <MetricCard key={index}>
                                <MetricValue>{metric.value}</MetricValue>
                                <MetricLabel>{metric.label}</MetricLabel>
                                <MetricDescription>{metric.description}</MetricDescription>
                            </MetricCard>
                        ))}
                    </MetricsGrid>
                </SectionContainer>
            </MetricsSection>

            {/* Pricing Section */}
            <PricingSection id="precos">
                <SectionContainer>
                    <SectionHeader>
                        <SectionTitle>
                            Preços <GradientText>transparentes</GradientText>
                        </SectionTitle>
                        <SectionDescription>
                            Investimento acessível para transformar sua gestão
                        </SectionDescription>
                    </SectionHeader>

                    <PricingGrid>
                        {/* Monthly Plan */}
                        <PricingCard>
                            <PricingHeader>
                                <PricingTitle>Plano Mensal</PricingTitle>
                                <PricingDescription>
                                    Flexibilidade para seu negócio
                                </PricingDescription>
                                <PricingPriceContainer>
                                    <PricingPrice>
                                        <PricingAmount>R$ 75</PricingAmount>
                                        <PricingPeriod>/mês</PricingPeriod>
                                    </PricingPrice>
                                </PricingPriceContainer>
                            </PricingHeader>
                            <PricingContent>
                                <OutlineButton $size="lg" $fullWidth>
                                    Começar Agora
                                </OutlineButton>
                                <PricingFeaturesList>
                                    {pricingFeatures.map((feature, index) => (
                                        <PricingFeatureItem key={index}>
                                            <FontAwesomeIcon icon={faCheck} />
                                            <span>{feature}</span>
                                        </PricingFeatureItem>
                                    ))}
                                </PricingFeaturesList>
                            </PricingContent>
                        </PricingCard>

                        {/* Annual Plan */}
                        <PricingCard $featured>
                            <PricingBadge>Mais Popular</PricingBadge>
                            <PricingHeader>
                                <PricingTitle>Plano Anual</PricingTitle>
                                <PricingDescription>
                                    Economize com pagamento anual
                                </PricingDescription>
                                <PricingPriceContainer>
                                    <PricingPrice>
                                        <PricingAmount>R$ 70</PricingAmount>
                                        <PricingPeriod>/mês</PricingPeriod>
                                    </PricingPrice>
                                    <PricingDiscount>
                                        <PricingOldPrice>R$ 900/ano</PricingOldPrice>
                                        <PricingNewPrice>R$ 840/ano</PricingNewPrice>
                                    </PricingDiscount>
                                    <PricingSavings>Economize R$ 60 por ano</PricingSavings>
                                </PricingPriceContainer>
                            </PricingHeader>
                            <PricingContent>
                                <PrimaryButton $size="lg" style={{ width: "100%" }}>
                                    Assinar Anual
                                </PrimaryButton>
                                <PricingFeaturesList>
                                    {pricingFeatures.map((feature, index) => (
                                        <PricingFeatureItem key={index}>
                                            <FontAwesomeIcon icon={faCheck} />
                                            <span>{feature}</span>
                                        </PricingFeatureItem>
                                    ))}
                                </PricingFeaturesList>
                            </PricingContent>
                        </PricingCard>
                    </PricingGrid>

                    <PricingFooter>
                        <p>
                            Todos os planos incluem todas as funcionalidades. Sem taxas
                            escondidas.
                        </p>
                    </PricingFooter>
                </SectionContainer>
            </PricingSection>

            {/* Benefits Section */}
            <BenefitsSection id="beneficios">
                <SectionContainer>
                    <SectionHeader>
                        <SectionTitle>
                            Por que escolher o <GradientText>SistemaMF?</GradientText>
                        </SectionTitle>
                        <SectionDescription>
                            Benefícios reais para o crescimento do seu negócio
                        </SectionDescription>
                    </SectionHeader>

                    <BenefitsGrid>
                        {benefits.map((benefit, index) => (
                            <BenefitCard key={index}>
                                <BenefitIconContainer>
                                    <FontAwesomeIcon icon={benefit.icon} />
                                </BenefitIconContainer>
                                <BenefitTitle>{benefit.title}</BenefitTitle>
                                <BenefitDescription>{benefit.description}</BenefitDescription>
                            </BenefitCard>
                        ))}
                    </BenefitsGrid>
                </SectionContainer>
            </BenefitsSection>

            {/* Footer - Using existing StoreFrontFooter component */}
            <StoreFrontFooter />
        </HomeContainer>
    );
}
