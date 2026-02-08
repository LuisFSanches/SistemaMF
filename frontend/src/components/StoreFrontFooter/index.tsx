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
        <FooterContainer>
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
                            <FooterLink href="https://sistema-mf.netlify.app/" target="_blank" rel="noopener noreferrer">
                                Funcionalidades
                            </FooterLink>
                        </li>
                        <li>
                            <FooterLink href="https://sistema-mf.netlify.app/" target="_blank" rel="noopener noreferrer">
                                Preços
                            </FooterLink>
                        </li>
                        <li>
                            <FooterLink href="https://sistema-mf.netlify.app/" target="_blank" rel="noopener noreferrer">
                                Demonstração
                            </FooterLink>
                        </li>
                        <li>
                            <FooterLink href="https://sistema-mf.netlify.app/" target="_blank" rel="noopener noreferrer">
                                Casos de Sucesso
                            </FooterLink>
                        </li>
                    </FooterLinkList>
                </FooterColumn>

                <FooterColumn>
                    <FooterTitle>Empresa</FooterTitle>
                    <FooterLinkList>
                        <li>
                            <FooterLink href="https://sistema-mf.netlify.app/" target="_blank" rel="noopener noreferrer">
                                Sobre Nós
                            </FooterLink>
                        </li>
                        <li>
                            <FooterLink href="https://sistema-mf.netlify.app/" target="_blank" rel="noopener noreferrer">
                                Blog
                            </FooterLink>
                        </li>
                        <li>
                            <FooterLink href="https://sistema-mf.netlify.app/" target="_blank" rel="noopener noreferrer">
                                Suporte
                            </FooterLink>
                        </li>
                        <li>
                            <FooterLink href="https://sistema-mf.netlify.app/" target="_blank" rel="noopener noreferrer">
                                Documentação
                            </FooterLink>
                        </li>
                    </FooterLinkList>
                </FooterColumn>

                <FooterColumn>
                    <FooterTitle>Contato</FooterTitle>
                    <ContactItem>
                        <FontAwesomeIcon icon={faEnvelope} />
                        <span>contato@sistemamf.com.br</span>
                    </ContactItem>
                    <ContactItem>
                        <FontAwesomeIcon icon={faPhone} />
                        <span>(11) 99999-9999</span>
                    </ContactItem>
                </FooterColumn>
            </FooterContent>

            <FooterBottom>
                <Copyright>© 2025 SistemaMF. Todos os direitos reservados.</Copyright>
                <BottomLinks>
                    <FooterLink href="https://sistema-mf.netlify.app/" target="_blank" rel="noopener noreferrer">
                        Política de Privacidade
                    </FooterLink>
                    <FooterLink href="https://sistema-mf.netlify.app/" target="_blank" rel="noopener noreferrer">
                        Termos de Uso
                    </FooterLink>
                </BottomLinks>
            </FooterBottom>
        </FooterContainer>
    );
}
