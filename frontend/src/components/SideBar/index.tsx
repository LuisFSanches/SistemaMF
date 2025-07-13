import { useContext, useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { Container,SideBarItemContainer, SideBarButton, CompanyInfoContainer } from "./style";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faComputer,
    faRightFromBracket,
    faGlobe,
    faUserShield,
    faBagShopping,
    faAddressCard,
    faReceipt,
    faHome,
    faWarehouse
} from "@fortawesome/free-solid-svg-icons";
import { faPix, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useAdminData } from "../../contexts/AuthContext";
import { NavLink} from 'react-router-dom'

export function SideBar(){
    const { handleSignOut } = useContext(AuthContext);
    const { adminData } = useAdminData();
    const location = useLocation();

    const [isActive, setActive] = useState({
        dashboard:true,
        pedidoBalcao:false,
        ordensDeServico:false,
        produtos:false,
        categorias:false,
        pedidos:false,
        clientes:false,
        statistics:false,
        pix: false,
        configurations:false,
        administradores: false,
        pedidoOnline: false,
        aguardandoCliente: false,
        estoque: false
    })
    
    const handleActiveMenuButton = useCallback((name:string) => {
        switch(name){
            case 'dashboard':
                setActive({...isActive, 
                    'dashboard':true,
                    'pedidoBalcao':false,
                    'ordensDeServico':false,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':false,
                    'statistics':false,
                    "administradores": false,
                    "pedidoOnline": false,
                    "aguardandoCliente": false,
                    "estoque": false
                })
            break;
            case 'pedidoBalcao':
                setActive({...isActive, 
                    'dashboard':false,
                    'pedidoBalcao':true,
                    'ordensDeServico':false,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':false,
                    'statistics':false,
                    "administradores": false,
                    "pedidoOnline": false,
                    "aguardandoCliente": false,
                    "estoque": false
                })
            break;
            case 'ordensDeServico':
                setActive({...isActive,
                    'dashboard':false,
                    'pedidoBalcao':false,
                    'ordensDeServico':true,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':false,
                    'statistics':false,
                    "administradores": false,
                    "pedidoOnline": false,
                    "aguardandoCliente": false,
                    "estoque": false
                })
            break;
            case 'statistics':
                setActive({...isActive, 
                    'dashboard':false,
                    'pedidoBalcao':false,
                    'ordensDeServico':false,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':false,
                    'statistics':true,
                    "administradores": false,
                    "pedidoOnline": false,
                    "aguardandoCliente": false,
                    "estoque": false
                })
            break;
            case 'pedidos':
                setActive({...isActive,
                    'dashboard':false,
                    'pedidoBalcao':false,
                    'ordensDeServico':false,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':true,
                    'clientes':false,
                    'statistics':false,
                    "administradores": false,
                    "pedidoOnline": false,
                    "aguardandoCliente": false,
                    "estoque": false
                })
            break;

            case 'clientes':
                setActive({...isActive,
                    'dashboard':false,
                    'pedidoBalcao':false,
                    'ordensDeServico':false,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':true,
                    'statistics':false,
                    "administradores": false,
                    "pedidoOnline": false,
                    "aguardandoCliente": false,
                    "estoque": false
                })
            break;

            case 'administradores':
                setActive({...isActive,
                    'dashboard':false,
                    'pedidoBalcao':false,
                    'ordensDeServico':false,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':false,
                    'statistics':false,
                    "administradores": true,
                    "pedidoOnline": false,
                    "aguardandoCliente": false,
                    "estoque": false
                })
            break;

            case 'pix':
                setActive({...isActive, 
                    'dashboard':false,
                    'pedidoBalcao':false,
                    'ordensDeServico':false,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':false,
                    'statistics':false,
                    "administradores": false,
                    'pix': true,
                    "pedidoOnline": false,
                    "aguardandoCliente": false,
                    "estoque": false
                })
            break;

            case 'pedidoOnline':
                setActive({...isActive, 
                    'dashboard':false,
                    'pedidoBalcao':false,
                    'ordensDeServico':false,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':false,
                    'statistics':false,
                    "administradores": false,
                    'pix': false,
                    "pedidoOnline": true,
                    "aguardandoCliente": false,
                    "estoque": false
                })
            break;
            case 'aguardandoCliente':
                setActive({...isActive, 
                    'dashboard':false,
                    'pedidoBalcao':false,
                    'ordensDeServico':false,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':false,
                    'statistics':false,
                    "administradores": false,
                    'pix': false,
                    "pedidoOnline": false,
                    "aguardandoCliente": true,
                    "estoque": false
                })
            break;

            case 'produtos':
                setActive({...isActive, 
                    'dashboard':false,
                    'pedidoBalcao':false,
                    'ordensDeServico':false,
                    'produtos':true,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':false,
                    'statistics':false,
                    "administradores": false,
                    'pix': false,
                    "pedidoOnline": false,
                    "aguardandoCliente": false,
                    "estoque": false
                })
            break;

            case 'estoque':
                setActive({...isActive,
                    'estoque':true,
                    'dashboard':false,
                    'pedidoBalcao':false,
                    'ordensDeServico':false,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':false,
                    'statistics':false,
                    "administradores": false,
                    'pix': false,
                    "pedidoOnline": false,
                    "aguardandoCliente": false
                })
            break;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const url = window.location.pathname;
        handleActiveMenuButton(url.replace("/", ""));
    }, [location.pathname, handleActiveMenuButton])
    // const chosenLogo = isMinimized ? logoMini : logoFull;

    return(
        <Container isMinimizedActive={true}>
            <NavLink to="/dashboard" style={{display: 'none'}}>
                <SideBarItemContainer onClick={()=>handleActiveMenuButton('dashboard')}>
                    <SideBarButton
                        isActive={isActive['dashboard']}
                        isMinimizedActive
                    >
                        <FontAwesomeIcon icon={faHome} className="Side-Bar-Icon"/>
                        <span>Dashboard</span>
                    </SideBarButton>
                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/pedidoBalcao">
                <SideBarItemContainer onClick={()=>handleActiveMenuButton('pedidoBalcao')}>
                    <SideBarButton
                        isActive={isActive['pedidoBalcao']}
                        isMinimizedActive
                        title="Novo Pedido"
                    >
                        <FontAwesomeIcon icon={faComputer} className="Side-Bar-Icon"/>
                        <span>Novo Pedido</span>
                    </SideBarButton>
                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/pedidoOnline">
                <SideBarItemContainer onClick={()=>handleActiveMenuButton('pedidoOnline')}>
                    <SideBarButton
                        isActive={isActive['pedidoOnline']}
                        isMinimizedActive
                        title="Pedido Online"
                    >
                        <FontAwesomeIcon icon={faWhatsapp as any} className="Side-Bar-Icon"/>
                        <span>Pedido Online</span>
                    </SideBarButton>
                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/ordensDeServico" >
                <SideBarItemContainer onClick={()=>handleActiveMenuButton('ordensDeServico')}>
                    <SideBarButton
                        isActive={isActive['ordensDeServico']}
                        isMinimizedActive
                        title="Pedidos em Aberto"
                    >
                        <FontAwesomeIcon icon={faReceipt} className="Side-Bar-Icon"/>
                        <span>Pedidos atuais</span>
                    </SideBarButton>
                    
                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/aguardandoCliente">
                <SideBarItemContainer onClick={()=>handleActiveMenuButton('aguardandoCliente')}>
                    <SideBarButton
                        isActive={isActive['aguardandoCliente']}
                        isMinimizedActive
                        title="Aguardando Cliente"
                    >
                        <FontAwesomeIcon icon={faGlobe} className="Side-Bar-Icon"/>
                        <span>Aguardando Cliente</span>
                    </SideBarButton>
                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/pedidos">
                <SideBarItemContainer onClick={()=>handleActiveMenuButton('pedidos')}>
                    <SideBarButton
                        isActive={isActive['pedidos']}
                        isMinimizedActive
                        title="Pedidos"
                    >
                        <FontAwesomeIcon icon={faBagShopping} className="Side-Bar-Icon"/>
                        <span>Pedidos finalizados</span>
                    </SideBarButton>
                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/produtos">
                <SideBarItemContainer onClick={()=>handleActiveMenuButton('produtos')}>
                    <SideBarButton
                        isActive={isActive['produtos']}
                        isMinimizedActive
                        title="Produtos"
                    >
                        <i className="material-icons">local_florist</i>
                        <span>Produtos</span>
                    </SideBarButton>
                </SideBarItemContainer>
            </NavLink>

            
            <NavLink to="/estoque">
                <SideBarItemContainer onClick={()=>handleActiveMenuButton('estoque')}>
                    <SideBarButton
                        isActive={isActive['estoque']}
                        isMinimizedActive
                        title="Estoque"
                    >
                        <FontAwesomeIcon icon={faWarehouse} className="Side-Bar-Icon"/>
                        <span>Compras Efetuadas</span>
                    </SideBarButton>
                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/clientes">
                <SideBarItemContainer onClick={()=>handleActiveMenuButton('clientes')}>
                    <SideBarButton
                        isActive={isActive['clientes']}
                        isMinimizedActive
                        title="Clientes"
                    >   
                        <FontAwesomeIcon icon={faAddressCard} className="Side-Bar-Icon"/>
                        <span>Lista de Clientes</span>
                    </SideBarButton>
                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/pix">
                <SideBarItemContainer onClick={()=>handleActiveMenuButton('pix')}>
                    <SideBarButton
                        isActive={isActive['pix']}
                        isMinimizedActive
                        title="Pix Recebidos"
                    >
                        <FontAwesomeIcon icon={faPix as any} className="Side-Bar-Icon"/>
                        <span>Pix Recebidos</span>
                    </SideBarButton>
                </SideBarItemContainer>
            </NavLink>
            
            {adminData && adminData.role === "SUPER_ADMIN" &&
                <NavLink to="/administradores" onClick={()=>handleActiveMenuButton('administradores')}>
                    <SideBarItemContainer>
                        <SideBarButton
                            isActive={isActive['administradores']}
                            isMinimizedActive
                            title="Vendedores"
                        >
                            <FontAwesomeIcon icon={faUserShield} className="Side-Bar-Icon"/>
                            <span>Vendedores</span>
                        </SideBarButton>
                    </SideBarItemContainer>
                </NavLink>
            }

            <CompanyInfoContainer
                isMinimizedActive
            >

            <button className="custom-logout-button" onClick={handleSignOut}>
                <FontAwesomeIcon icon={faRightFromBracket} className="custom-logout-icon" />
                <span className="custom-logout-text">Sair</span>
            </button>
            </CompanyInfoContainer>

        </Container>
    )
}
