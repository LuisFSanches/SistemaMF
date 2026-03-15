import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/images/logo.png";
import { StoreFrontFooter } from "../../components/StoreFrontFooter";

import {
    PageContainer,
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
    ContentSection,
    ContentContainer,
    ContentTitle,
    ContentBody,
    LastUpdate,
} from "./style";

export function TermsOfService() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const scrollToSection = (sectionId: string) => {
        navigate(`/#${sectionId}`);
        setIsMobileMenuOpen(false);
    };

    return (
        <PageContainer>
            <NavbarContainer>
                <NavbarContent>
                    <NavbarInner>
                        <LogoContainer onClick={() => navigate("/")}>
                            <img src={logo} alt="SistemaMF Logo" />
                            <LogoText>SistemaMF</LogoText>
                        </LogoContainer>

                        <DesktopNav>
                            <NavButton onClick={() => scrollToSection("funcionalidades")}>
                                Funcionalidades
                            </NavButton>
                            <NavButton onClick={() => scrollToSection("precos")}>
                                Preços
                            </NavButton>
                            <NavButton onClick={() => scrollToSection("beneficios")}>
                                Benefícios
                            </NavButton>
                            <NavButton onClick={() => scrollToSection("contato")}>
                                Contato
                            </NavButton>
                            <PrimaryButton onClick={() => navigate("/cadastro")}>
                                Começar Agora
                            </PrimaryButton>
                        </DesktopNav>

                        <MobileMenuButton onClick={toggleMobileMenu}>
                            <FontAwesomeIcon icon={faBars} />
                        </MobileMenuButton>
                    </NavbarInner>
                </NavbarContent>

                {isMobileMenuOpen && (
                    <MobileNav>
                        <MobileNavInner>
                            <MobileNavButton onClick={() => scrollToSection("funcionalidades")}>
                                Funcionalidades
                            </MobileNavButton>
                            <MobileNavButton onClick={() => scrollToSection("precos")}>
                                Preços
                            </MobileNavButton>
                            <MobileNavButton onClick={() => scrollToSection("beneficios")}>
                                Benefícios
                            </MobileNavButton>
                            <MobileNavButton onClick={() => scrollToSection("contato")}>
                                Contato
                            </MobileNavButton>
                            <PrimaryButton onClick={() => navigate("/cadastro")}>
                                Começar Agora
                            </PrimaryButton>
                        </MobileNavInner>
                    </MobileNav>
                )}
            </NavbarContainer>

            <ContentSection>
                <ContentContainer>
                    <ContentTitle>Termos de Uso</ContentTitle>
                    <LastUpdate>Última atualização: 15 de março de 2026</LastUpdate>

                    <ContentBody>
                        <p>
                            Bem-vindo ao sistema. Ao utilizar este sistema para realizar pedidos ou interagir com lojas cadastradas, você concorda com os presentes Termos de Uso.
                        </p>

                        <h2>1. Sobre o serviço</h2>
                        <p>
                            O sistema é uma plataforma utilizada por lojas para registrar e gerenciar pedidos de clientes, incluindo pedidos realizados via WhatsApp ou diretamente pela internet.
                        </p>
                        <p>
                            A plataforma permite que o cliente visualize, confirme e complemente informações de pedidos previamente iniciados pela loja.
                        </p>

                        <h2>2. Cadastro e identificação</h2>
                        <p>Para realizar pedidos, podem ser solicitados alguns dados pessoais, incluindo:</p>
                        <ul>
                            <li>Nome</li>
                            <li>Número de telefone</li>
                            <li>Endereço de entrega</li>
                            <li>E-mail</li>
                        </ul>
                        <p>Esses dados são utilizados exclusivamente para:</p>
                        <ul>
                            <li>Identificação do cliente</li>
                            <li>Processamento e entrega de pedidos</li>
                            <li>Comunicação relacionada ao pedido</li>
                        </ul>

                        <h2>3. Pedidos iniciados pela loja</h2>
                        <p>
                            Em alguns casos, o pedido pode ser iniciado por um funcionário da loja após contato com o cliente por WhatsApp.
                        </p>
                        <p>Nessa situação:</p>
                        <ul>
                            <li>O funcionário registra inicialmente os produtos e o número de telefone informado pelo cliente.</li>
                            <li>Um link do pedido é enviado ao cliente.</li>
                            <li>Ao acessar o link, o cliente pode completar os dados de entrega necessários para finalização do pedido.</li>
                        </ul>
                        <p>O acesso às informações do pedido é restrito ao link enviado ao cliente.</p>

                        <h2>4. Segurança e verificação de identidade</h2>
                        <p>
                            Para pedidos realizados online, quando já existe um cadastro com o mesmo número de telefone e e-mail, o sistema pode solicitar a confirmação de identidade através do envio de um código de verificação para o e-mail do cliente.
                        </p>
                        <p>Esse procedimento tem como objetivo proteger os dados e evitar acessos indevidos.</p>

                        <h2>5. Responsabilidades do usuário</h2>
                        <p>O usuário compromete-se a:</p>
                        <ul>
                            <li>Fornecer informações verdadeiras</li>
                            <li>Não compartilhar links de pedidos com terceiros</li>
                            <li>Utilizar o sistema apenas para finalidades legítimas</li>
                        </ul>

                        <h2>6. Alterações nos termos</h2>
                        <p>
                            Estes Termos de Uso podem ser atualizados periodicamente. A versão mais recente estará sempre disponível nesta página.
                        </p>

                        <h2>7. Contato</h2>
                        <p>
                            Em caso de dúvidas ou solicitações relacionadas ao uso do sistema, entre em contato com a loja responsável pelo pedido.
                        </p>
                    </ContentBody>
                </ContentContainer>
            </ContentSection>

            <StoreFrontFooter />
        </PageContainer>
    );
}
