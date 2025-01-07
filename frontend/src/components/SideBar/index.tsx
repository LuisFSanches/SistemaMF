import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Container,SideBarItemContainer, SideBarButton, LogoContainer, CompanyInfoContainer, MinimizeButton } from "./style";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowLeft,
    faArrowRight,
    faBars,
    faBasketShopping,
    faChartLine,
    faComputer,
    faLayerGroup,
    faRightFromBracket,
    faUsers,
    faUtensils,
    faUserShield,
    faBagShopping,
    faPersonDress,
    faAddressCard,
    faReorder,
    faBorderStyle,
    faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { faPix, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useAdminData } from "../../contexts/AuthContext";
import { NavLink} from 'react-router-dom'
import logoFull from '../../assets/images/logo.png'
import logoMini from '../../assets/images/logo-mini.png'

export function SideBar(){
    const { handleSignOut } = useContext(AuthContext);
    const { adminData } = useAdminData();

    const [isActive, setActive] = useState({
        dashboard:true,
        ordensDeServico:false,
        produtos:false,
        categorias:false,
        pedidos:false,
        clientes:false,
        statistics:false,
        pix: false,
        configurations:false,
        administradores: false,
        pedidoOnline: false
    })
    
    const [isMinimized, setMinimized] = useState(false)

    const handleActiveMenuButton = useCallback((name:string) => {
        switch(name){
            case 'dashboard':
                setActive({...isActive, 
                    'dashboard':true,
                    'ordensDeServico':false,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':false,
                    'statistics':false,
                    "administradores": false,
                    "pedidoOnline": false
                })
            break;
            case 'ordensDeServico':
                setActive({...isActive,
                    'dashboard':false,
                    'ordensDeServico':true,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':false,
                    'statistics':false,
                    "administradores": false,
                    "pedidoOnline": false
                })
            break;
            case 'produtos':
                setActive({...isActive,
                    'dashboard':false,
                    'ordensDeServico':false,
                    'produtos':true,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':false,
                    'statistics':false,
                    "administradores": false,
                    "pedidoOnline": false
                })
            break;
            case 'statistics':
                setActive({...isActive, 
                    'dashboard':false,
                    'ordensDeServico':false,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':false,
                    'statistics':true,
                    "administradores": false,
                    "pedidoOnline": false
                })
            break;
            case 'categorias':
                setActive({...isActive,
                    'dashboard':false,
                    'ordensDeServico':false,
                    'produtos':false,
                    'categorias':true,
                    'pedidos':false,
                    'clientes':false,
                    'statistics':false,
                    "administradores": false,
                    "pedidoOnline": false
                })
            break;

            case 'pedidos':
                setActive({...isActive,
                    'dashboard':false,
                    'ordensDeServico':false,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':true,
                    'clientes':false,
                    'statistics':false,
                    "administradores": false,
                    "pedidoOnline": false
                })
            break;

            case 'clientes':
                setActive({...isActive,
                    'dashboard':false,
                    'ordensDeServico':false,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':true,
                    'statistics':false,
                    "administradores": false,
                    "pedidoOnline": false
                })
            break;

            case 'administradores':
                setActive({...isActive,
                    'dashboard':false,
                    'ordensDeServico':false,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':false,
                    'statistics':false,
                    "administradores": true,
                    "pedidoOnline": false
                })
            break;

            case 'pix':
                setActive({...isActive, 
                    'dashboard':false,
                    'ordensDeServico':false,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':false,
                    'statistics':false,
                    "administradores": false,
                    'pix': true,
                    "pedidoOnline": false
                })
            break;

            case 'pedidoOnline':
                setActive({...isActive, 
                    'dashboard':false,
                    'ordensDeServico':false,
                    'produtos':false,
                    'categorias':false,
                    'pedidos':false,
                    'clientes':false,
                    'statistics':false,
                    "administradores": false,
                    'pix': false,
                    "pedidoOnline": true
                })
            break;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const url = window.location.pathname;
        handleActiveMenuButton(url.replace("/", ""));
    }, [handleActiveMenuButton])

    function handleMinimization(){
        setMinimized(!isMinimized)
    }


    
    const chosenLogo = isMinimized ? logoMini : logoFull;

    return(
        <Container isMinimizedActive={isMinimized}>
            <LogoContainer isMinimizedActive={isMinimized}>
                <div className="logo-info">
                    <img src={chosenLogo} alt="logo garçom" />
                </div>
            </LogoContainer>

            <MinimizeButton>
                {isMinimized ? (
                    <button className="close-side-bar-menu" onClick={handleMinimization}>
                        <FontAwesomeIcon icon={faArrowRight}/>
                    </button>
                ) : (
                    <button className="close-side-bar-menu" onClick={handleMinimization}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                    </button>
                )}
            </MinimizeButton>



            <NavLink to="/dashboard">
                <SideBarItemContainer onClick={()=>handleActiveMenuButton('dashboard')}>
                    <SideBarButton
                        isActive={isActive['dashboard']}
                        isMinimizedActive={isMinimized}
                    >
                        <FontAwesomeIcon icon={faComputer} className="Side-Bar-Icon"/>
                        <span>Novo Pedido</span>
                    </SideBarButton>
                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/pedidoOnline" style={{ 'display': 'none'}}>
                <SideBarItemContainer onClick={()=>handleActiveMenuButton('pedidoOnline')}>
                    <SideBarButton
                        isActive={isActive['pedidoOnline']}
                        isMinimizedActive={isMinimized}
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
                        isMinimizedActive={isMinimized}
                    >
                        <FontAwesomeIcon icon={faReceipt} className="Side-Bar-Icon"/>
                        <span>Pedidos em Aberto</span>
                    </SideBarButton>
                    
                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/produtos" style={{ 'display': 'none'}}>
                <SideBarItemContainer onClick={()=>handleActiveMenuButton('produtos')}>
                    <SideBarButton
                        isActive={isActive['produtos']}
                        isMinimizedActive={isMinimized}
                    >
                        <FontAwesomeIcon icon={faUtensils} className="Side-Bar-Icon"/>
                        <span>Produtos</span>
                    </SideBarButton>
                
                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/categorias" style={{ 'display': 'none'}}>
                <SideBarItemContainer onClick={()=>handleActiveMenuButton('categorias')}>
                    <SideBarButton
                        isActive={isActive['categorias']}
                        isMinimizedActive={isMinimized}
                    >
                        <FontAwesomeIcon icon={faLayerGroup} className="Side-Bar-Icon"/>
                        <span>Categorias</span>
                    </SideBarButton>

                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/pedidos">
                <SideBarItemContainer onClick={()=>handleActiveMenuButton('pedidos')}>
                    <SideBarButton
                        isActive={isActive['pedidos']}
                        isMinimizedActive={isMinimized}
                    >
                        <FontAwesomeIcon icon={faBagShopping} className="Side-Bar-Icon"/>
                        <span>Pedidos</span>
                    </SideBarButton>
                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/clientes">
                <SideBarItemContainer onClick={()=>handleActiveMenuButton('clientes')}>
                    <SideBarButton
                        isActive={isActive['clientes']}
                        isMinimizedActive={isMinimized}
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
                        isMinimizedActive={isMinimized}
                    >
                        <FontAwesomeIcon icon={faPix as any} className="Side-Bar-Icon"/>
                        <span>Pix Recebidos</span>
                    </SideBarButton>
                </SideBarItemContainer>
            </NavLink>

            {adminData && adminData.role === "SUPER_ADMIN" &&
                <NavLink to="/estatisticas">
                    <SideBarItemContainer onClick={()=>handleActiveMenuButton('statistics')}>
                        <SideBarButton
                            isActive={isActive['statistics']}
                            isMinimizedActive={isMinimized}
                        >
                            <FontAwesomeIcon icon={faChartLine} className="Side-Bar-Icon"/>
                            <span>Estatísticas</span>
                        </SideBarButton>
                    </SideBarItemContainer>
                </NavLink>
            }
            
            {adminData && adminData.role === "SUPER_ADMIN" &&
                <NavLink to="/administradores" onClick={()=>handleActiveMenuButton('administradores')}>
                    <SideBarItemContainer>
                        <SideBarButton
                            isActive={isActive['administradores']}
                            isMinimizedActive={isMinimized}
                        >
                            <FontAwesomeIcon icon={faUserShield} className="Side-Bar-Icon"/>
                            <span>Administradores</span>
                        </SideBarButton>
                    </SideBarItemContainer>
                </NavLink>
            }

            <CompanyInfoContainer
                isMinimizedActive={isMinimized}
            >

            <button className="custom-logout-button" onClick={handleSignOut}>
                <FontAwesomeIcon icon={faRightFromBracket} className="custom-logout-icon" />
                <span className="custom-logout-text">Sair</span>
            </button>
            </CompanyInfoContainer>

        </Container>
    )
}
