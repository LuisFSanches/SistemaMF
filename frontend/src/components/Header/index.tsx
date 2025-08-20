import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Container, MenuButton } from "./style";
import { GlobalMenu } from '../GlobalMenu';
import { GenerateCard } from "../GenerateCard";
import logoFull from '../../assets/images/logo.png'

export function Header() {
        const [menuModal, setMenuModal] = useState(false);
    
    return (
        <Container>
            <img src={logoFull} alt="logo" title="logo"/>
            <div>
                <GenerateCard />
                <MenuButton type="button" onClick={() => setMenuModal(true)}>
                    <FontAwesomeIcon icon={faBars} />
                    <span>Menu</span>
                </MenuButton>
            </div>
            
            <GlobalMenu isOpen={menuModal} onRequestClose={() => setMenuModal(false)}/>
        </Container>
    )
}