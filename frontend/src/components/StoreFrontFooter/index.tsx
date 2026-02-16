import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/images/logo.png";
import {
    FooterContainer,
    FooterContent,
    FooterColumn,
    FooterTitle,
    FooterDescription,
    FooterLink,
    FooterLinkList,
    ContactItem,
    FooterBottom,
    Copyright,
    BottomLinks
} from "./style";

export function StoreFrontFooter() {
    return (
        <FooterContainer id="contato">
            <FooterContent>
                <FooterColumn>
                    <img src={logo} alt="Minhas Flores Logo" />
                    <FooterDescription>
                        Sistema completo de gestão para floriculturas.
                        Desenvolvido por especialistas
                        para o seu negócio.
                    </FooterDescription>
                </FooterColumn>

                <FooterColumn>
                    <FooterTitle>Produto</FooterTitle>
                    <FooterLinkList>
                        <li>
                            <FooterLink href="/#funcionalidades">
                                Funcionalidades
                            </FooterLink>
                        </li>
                        <li>
                            <FooterLink href="/#precos">
                                Preços
                            </FooterLink>
                        </li>
                        <li>
                            <FooterLink href="/#metricas">
                                Resultados
                            </FooterLink>
                        </li>
                        <li>
                            <FooterLink href="/#beneficios">
                                Benefícios
                            </FooterLink>
                        </li>
                    </FooterLinkList>
                </FooterColumn>

                <FooterColumn>
                    <FooterTitle>Empresa</FooterTitle>
                    <FooterLinkList>
                        <li>
                            <FooterLink href="/#hero">
                                Início
                            </FooterLink>
                        </li>
                        <li>
                            <FooterLink href="/cadastro">
                                Cadastro
                            </FooterLink>
                        </li>
                        <li>
                            <FooterLink href="/login">
                                Login
                            </FooterLink>
                        </li>
                        <li>
                            <FooterLink href="/#contato">
                                Contato
                            </FooterLink>
                        </li>
                    </FooterLinkList>
                </FooterColumn>

                <FooterColumn>
                    <FooterTitle>Contato</FooterTitle>
                    <ContactItem>
                        <FontAwesomeIcon icon={faEnvelope} />
                        <span>sistema.mf.flores@gmail.com</span>
                    </ContactItem>
                    <ContactItem>
                        <FontAwesomeIcon icon={faPhone} />
                        <span>(22) 99751-7940</span>
                    </ContactItem>
                </FooterColumn>
            </FooterContent>

            <FooterBottom>
                <Copyright>© 2025 SistemaMF. Todos os direitos reservados.</Copyright>
                <BottomLinks>
                    <FooterLink href="#">
                        Política de Privacidade
                    </FooterLink>
                    <FooterLink href="#">
                        Termos de Uso
                    </FooterLink>
                </BottomLinks>
            </FooterBottom>
        </FooterContainer>
    );
}
