import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Container,SideBarItemContainer, SideBarButton, LogoContainer, CompanyInfoContainer, MinimizeButton } from "./style";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faBars, faBasketShopping, faChartLine, faGear, faHouse, faLayerGroup, faRightFromBracket, faUsers, faUtensils } from "@fortawesome/free-solid-svg-icons";

import { NavLink} from 'react-router-dom'
import logo from '../../assets/images/logo.png'

export function SideBar(){
    const { handleSignOut } = useContext(AuthContext);

    const [isActive, setActive] = useState({
        home:true,
        activeOrders:false,
        products:false,
        categories:false,
        allOrders:false,
        users:false,
        statistics:false,
        configurations:false,
    })
    
    const [isMinimized, setMinimized] = useState(false)

    function handleActiveMenuButton(name:string){
        switch(name){
            case 'home':
                setActive({...isActive, 
                    'home':true,
                    'activeOrders':false,
                    'products':false,
                    'categories':false,
                    'allOrders':false,
                    'users':false,
                    'statistics':false
                })
            break;
            case 'orders':
                setActive({...isActive,
                    'home':false,
                    'activeOrders':true,
                    'products':false,
                    'categories':false,
                    'allOrders':false,
                    'users':false,
                    'statistics':false
                })
            break;
            case 'products':
                setActive({...isActive,
                    'home':false,
                    'activeOrders':false,
                    'products':true,
                    'categories':false,
                    'allOrders':false,
                    'users':false,
                    'statistics':false
                })
            break;
            case 'statistics':
                setActive({...isActive, 
                    'home':false,
                    'activeOrders':false,
                    'products':false,
                    'categories':false,
                    'allOrders':false,
                    'users':false,
                    'statistics':true
                })
            break;
            case 'categories':
                setActive({...isActive,
                    'home':false,
                    'activeOrders':false,
                    'products':false,
                    'categories':true,
                    'allOrders':false,
                    'users':false
                })
            break;

            case 'allOrders':
                setActive({...isActive,
                    'home':false,
                    'activeOrders':false,
                    'products':false,
                    'categories':false,
                    'allOrders':true,
                    'users':false,
                    'statistics':false
                })
            break;

            case 'users':
                setActive({...isActive,
                    'home':false,
                    'activeOrders':false,
                    'products':false,
                    'categories':false,
                    'allOrders':false,
                    'users':true,
                    'statistics':false
                })
            break;
        }
    }

    function handleMinimization(){
        setMinimized(!isMinimized)
    }

    return(
        <Container isMinimizedActive={isMinimized}>
            <LogoContainer
                isMinimizedActive={isMinimized}
            >
                <div className="logo-info">
                    <img src={ logo } alt="logo garçom" />
                </div>
            </LogoContainer>
            <MinimizeButton>
                {isMinimized
                    ? <button className="close-side-bar-menu" onClick = {handleMinimization}>
                        <FontAwesomeIcon  icon ={faArrowRight}/>
                    </button>
                    : <button className="close-side-bar-menu" onClick = {handleMinimization}>
                        <FontAwesomeIcon  icon ={faArrowLeft}/>
                    </button>
                }
            </MinimizeButton>
            <NavLink to="/dashboard">
                <SideBarItemContainer>
                    <SideBarButton
                        isActive={isActive['home']}
                        isMinimizedActive={isMinimized}
                        onClick={()=>handleActiveMenuButton('home')}
                    >
                        <FontAwesomeIcon icon={faHouse} className="Side-Bar-Icon"/>
                        <span>Home</span>
                    </SideBarButton>
                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/ordens-de-servico" >
                <SideBarItemContainer>
                    <SideBarButton
                        isActive={isActive['activeOrders']}
                        isMinimizedActive={isMinimized}
                        onClick={()=>handleActiveMenuButton('orders')}
                    >
                        <FontAwesomeIcon icon={faBars} className="Side-Bar-Icon"/>
                        <span>Ordens de Serviço</span>
                    </SideBarButton>
                    
                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/produtos" style={{ 'display': 'none'}}>
                <SideBarItemContainer>
                    <SideBarButton
                        isActive={isActive['products']}
                        isMinimizedActive={isMinimized}
                        onClick={()=>handleActiveMenuButton('products')}
                    >
                        <FontAwesomeIcon icon={faUtensils} className="Side-Bar-Icon"/>
                        <span>Produtos</span>
                    </SideBarButton>
                
                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/categorias">
                <SideBarItemContainer>
                    <SideBarButton
                        isActive={isActive['categories']}
                        isMinimizedActive={isMinimized}
                        onClick={()=>handleActiveMenuButton('categories')}
                    >
                        <FontAwesomeIcon icon={faLayerGroup} className="Side-Bar-Icon"/>
                        <span>Categorias</span>
                    </SideBarButton>

                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/pedidos">
                <SideBarItemContainer>
                    <SideBarButton
                        isActive={isActive['allOrders']}
                        isMinimizedActive={isMinimized}
                        onClick={()=>handleActiveMenuButton('allOrders')}
                    >
                        <FontAwesomeIcon icon={faBasketShopping} className="Side-Bar-Icon"/>
                        <span>Pedidos</span>
                    </SideBarButton>
                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/usuarios">
                <SideBarItemContainer>
                    <SideBarButton
                        isActive={isActive['users']}
                        isMinimizedActive={isMinimized}
                        onClick={()=>handleActiveMenuButton('users')}
                    >
                        <FontAwesomeIcon icon={faUsers} className="Side-Bar-Icon"/>
                        <span>Usuários</span>
                    </SideBarButton>
                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/estatisticas">
                <SideBarItemContainer>
                    <SideBarButton
                        isActive={isActive['statistics']}
                        isMinimizedActive={isMinimized}
                        onClick={()=>handleActiveMenuButton('statistics')}
                    >
                        <FontAwesomeIcon icon={faChartLine} className="Side-Bar-Icon"/>
                        <span>Estatísticas</span>
                    </SideBarButton>
                </SideBarItemContainer>
            </NavLink>

            <NavLink to="/configuracoes">
                <SideBarItemContainer>
                    <SideBarButton
                        isActive={isActive['configurations']}
                        isMinimizedActive={isMinimized}
                        onClick={()=>handleActiveMenuButton('configurations')}
                    >
                        <FontAwesomeIcon icon={faGear} className="Side-Bar-Icon"/>
                        <span>Configurações</span>
                    </SideBarButton>
                </SideBarItemContainer>
            </NavLink>

            <CompanyInfoContainer
                isMinimizedActive={isMinimized}
            >

                <button className="logout-button">
                    <FontAwesomeIcon icon={faRightFromBracket} className="logout-icon"/>
                    <button onClick={handleSignOut}>Sair</button>
                </button>
            </CompanyInfoContainer>

        </Container>
    )
}