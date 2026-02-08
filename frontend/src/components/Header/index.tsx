import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faGear } from "@fortawesome/free-solid-svg-icons";
import { Container, MenuButton, LogoContainer } from "./style";
import { GlobalMenu } from '../GlobalMenu';
import { GenerateCard } from "../GenerateCard";
import { StoreSelector } from "../StoreSelector";
import { AuthContext } from '../../contexts/AuthContext';
 // import logoFull from '../../assets/images/logo.png'

export function Header() {
    const [menuModal, setMenuModal] = useState(false);
    const { storeData, adminData } = useContext(AuthContext);
    const navigate = useNavigate();

    // Usar logo da loja se disponível, caso contrário usar logo mocada
    const logoSrc = storeData?.logo || '';
    const isSysAdmin = adminData.role === 'SYS_ADMIN';
    
    return (
        <Container>
            {isSysAdmin ? (
                <StoreSelector />
            ) : (
                <LogoContainer>
                    <img src={logoSrc} alt="logo" title="logo"/>
                </LogoContainer>
            )}
            <div>
                <GenerateCard />
                <MenuButton type="button" onClick={() => setMenuModal(true)}>
                    <FontAwesomeIcon icon={faBars} />
                    <span>Menu</span>
                </MenuButton>
                <MenuButton
                    className="config-button"
                    type="button"
                    onClick={() => navigate("/backoffice/configuracoes")} title="Configurações">
                    <FontAwesomeIcon icon={faGear} />
                </MenuButton>
            </div>
            
            <GlobalMenu isOpen={menuModal} onRequestClose={() => setMenuModal(false)}/>
        </Container>
    )
}