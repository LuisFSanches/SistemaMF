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

export function PrivacyPolicy() {
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
                    <ContentTitle>Política de Privacidade</ContentTitle>
                    <LastUpdate>Última atualização: 15 de março de 2026</LastUpdate>

                    <ContentBody>
                        <p>
                            Esta Política de Privacidade descreve como os dados pessoais são coletados, utilizados e protegidos durante o uso do sistema.
                        </p>

                        <h2>1. Dados coletados</h2>
                        <p>Durante a utilização do sistema, podem ser coletados os seguintes dados pessoais:</p>
                        <ul>
                            <li>Nome</li>
                            <li>Número de telefone</li>
                            <li>Endereço de entrega</li>
                            <li>Endereço de e-mail</li>
                            <li>Informações relacionadas aos pedidos realizados</li>
                        </ul>

                        <h2>2. Finalidade do uso dos dados</h2>
                        <p>Os dados são utilizados para:</p>
                        <ul>
                            <li>Processar pedidos</li>
                            <li>Permitir entregas</li>
                            <li>Facilitar compras futuras</li>
                            <li>Permitir identificação do cliente</li>
                            <li>Evitar fraudes ou acessos indevidos</li>
                            <li>Melhorar a experiência de compra</li>
                        </ul>

                        <h2>3. Armazenamento de dados</h2>
                        <p>
                            O número de telefone pode ser armazenado para facilitar compras futuras.
                        </p>
                        <p>
                            Quando um cliente inicia um novo pedido utilizando o mesmo número de telefone, o sistema pode recuperar dados previamente informados, como endereços de entrega.
                        </p>
                        <p>Isso permite agilizar o processo de compra.</p>

                        <h2>4. Segurança das informações</h2>
                        <p>Medidas técnicas e organizacionais são adotadas para proteger os dados contra:</p>
                        <ul>
                            <li>acesso não autorizado</li>
                            <li>alteração indevida</li>
                            <li>divulgação</li>
                            <li>destruição de informações</li>
                        </ul>
                        <p>
                            Em pedidos online, pode ser realizada verificação de identidade por meio de envio de código para o e-mail cadastrado.
                        </p>

                        <h2>5. Compartilhamento de dados</h2>
                        <p>
                            Os dados pessoais não são vendidos ou compartilhados com terceiros, exceto quando necessário para:
                        </p>
                        <ul>
                            <li>processamento do pedido</li>
                            <li>cumprimento de obrigações legais</li>
                        </ul>
                        <p>
                            As informações podem ser acessadas pela loja responsável pelo pedido para fins de atendimento e entrega.
                        </p>

                        <h2>6. Direitos do titular dos dados</h2>
                        <p>De acordo com a legislação aplicável, o usuário pode solicitar:</p>
                        <ul>
                            <li>acesso aos seus dados</li>
                            <li>correção de informações</li>
                            <li>exclusão de dados pessoais</li>
                        </ul>
                        <p>Essas solicitações devem ser feitas diretamente à loja responsável pelo pedido.</p>

                        <h2>7. Atualizações desta política</h2>
                        <p>
                            Esta política pode ser atualizada periodicamente. A versão mais recente estará sempre disponível nesta página.
                        </p>
                    </ContentBody>
                </ContentContainer>
            </ContentSection>

            <StoreFrontFooter />
        </PageContainer>
    );
}
