import { useEffect, useCallback, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faComputer,
    faGlobe,
    faBagShopping,
    faAddressCard,
    faReceipt,
    faPlantWilt,
    faHome,
    faWarehouse,
    faUserShield
} from "@fortawesome/free-solid-svg-icons";
import { faPix, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faXmark, faMotorcycle } from "@fortawesome/free-solid-svg-icons";
import { NavLink} from 'react-router-dom'
import Modal from 'react-modal';
import { ModalContainer } from "../../styles/global";
import { MenuList, NavButton } from "./style";

export function GlobalMenu({
    isOpen,
    onRequestClose
}:any){
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
        estoque: false,
        valoresAReceber: false,
        entregas: false,
        motoboys: false
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
                    "estoque": false,
                    "valoresAReceber": false,
                    "entregas": false,
                    "motoboys": false
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
                    "estoque": false,
                    "valoresAReceber": false,
                    "entregas": false,
                    "motoboys": false
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
                    "estoque": false,
                    "valoresAReceber": false,
                    "entregas": false,
                    "motoboys": false
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
                    "estoque": false,
                    "valoresAReceber": false,
                    "entregas": false,
                    "motoboys": false
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
                    "estoque": false,
                    "valoresAReceber": false,
                    "entregas": false,
                    "motoboys": false
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
                    "estoque": false,
                    "valoresAReceber": false,
                    "entregas": false,
                    "motoboys": false
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
                    "estoque": false,
                    "valoresAReceber": false,
                    "entregas": false,
                    "motoboys": false
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
                    "estoque": false,
                    "valoresAReceber": false,
                    "entregas": false,
                    "motoboys": false
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
                    "estoque": false,
                    "valoresAReceber": false,
                    "entregas": false,
                    "motoboys": false
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
                    "estoque": false,
                    "valoresAReceber": false,
                    "entregas": false,
                    "motoboys": false
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
                    "estoque": false,
                    "valoresAReceber": false,
                    "entregas": false,
                    "motoboys": false
                })
            break;

            case 'valoresAReceber':
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
                    "aguardandoCliente": false,
                    "estoque": false,
                    "valoresAReceber": true,
                    "entregas": false,
                    "motoboys": false
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
                    "aguardandoCliente": false,
                    "valoresAReceber": false,
                    "entregas": false,
                    "motoboys": false
                })
            break;

            case 'entregas':
                setActive({...isActive,
                    'estoque':false,
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
                    "aguardandoCliente": false,
                    "valoresAReceber": false,
                    "entregas": true,
                    "motoboys": false
                })
            break;

            case 'motoboys':
                setActive({...isActive,
                    'estoque':false,
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
                    "aguardandoCliente": false,
                    "valoresAReceber": false,
                    "entregas": false,
                    "motoboys": true
                })
            break;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const url = window.location.pathname;
        handleActiveMenuButton(url.replace("/", ""));
    }, [handleActiveMenuButton])

    return (
        <Modal 
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
            >
            <button type="button" onClick={onRequestClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark}/>
            </button>

            <ModalContainer>
                <h1>Menu</h1>
                <MenuList>
                    <NavLink to="/backoffice/dashboard">
                        <NavButton
                            type="button"
                            onClick={() => handleActiveMenuButton('dashboard')}
                            isActive={isActive['dashboard']}
                        >
                            <span>
                                <FontAwesomeIcon icon={faHome} className="Side-Bar-Icon"/>
                                Dashboard
                            </span>
                        </NavButton>
                    </NavLink>
                    <NavLink to="/backoffice/pedidoBalcao">
                        <NavButton
                            type="button"
                            onClick={() => handleActiveMenuButton('pedidoBalcao')}
                            isActive={isActive['pedidoBalcao']}
                        >
                            <span>
                                <FontAwesomeIcon icon={faComputer} className="Side-Bar-Icon"/>
                                Home
                            </span>
                        </NavButton>
                    </NavLink>
                    <NavLink to="/backoffice/pedidoOnline">
                        <NavButton
                            type="button"
                            onClick={() => handleActiveMenuButton('pedidoOnline')}
                            isActive={isActive['pedidoOnline']}
                        >
                            <span>
                                <FontAwesomeIcon icon={faWhatsapp as any} className="Side-Bar-Icon"/>
                                Pedido Online
                            </span>
                        </NavButton>
                    </NavLink>
                    <NavLink to="/backoffice/ordensDeServico">
                        <NavButton
                            type="button"
                            onClick={() => handleActiveMenuButton('ordensDeServico')}
                            isActive={isActive['ordensDeServico']}
                        >
                            <span>
                                <FontAwesomeIcon icon={faReceipt} className="Side-Bar-Icon"/>
                                Pedidos em Aberto
                            </span>
                        </NavButton>
                    </NavLink>
                    <NavLink to="/backoffice/aguardandoCliente">
                        <NavButton
                            type="button"
                            onClick={() => handleActiveMenuButton('aguardandoCliente')}
                            isActive={isActive['aguardandoCliente']}
                        >
                            <span>
                                <FontAwesomeIcon icon={faGlobe} className="Side-Bar-Icon"/>
                                Aguardando Cliente
                            </span>
                        </NavButton>
                    </NavLink>
                    <NavLink to="/backoffice/pedidos">
                        <NavButton
                            type="button"
                            onClick={() => handleActiveMenuButton('pedidos')}
                            isActive={isActive['pedidos']}
                        >
                            <span>
                                <FontAwesomeIcon icon={faBagShopping} className="Side-Bar-Icon"/>
                                Pedidos
                            </span>
                        </NavButton>
                    </NavLink>
                    <NavLink to="/backoffice/produtos">
                        <NavButton
                            type="button"
                            onClick={() => handleActiveMenuButton('produtos')}
                            isActive={isActive['produtos']}
                        >
                            <span>
                                <FontAwesomeIcon icon={faPlantWilt} className="Side-Bar-Icon"/>
                                Produtos
                            </span>
                        </NavButton>
                    </NavLink>
                    <NavLink to="/backoffice/estoque">
                        <NavButton
                            type="button"
                            onClick={() => handleActiveMenuButton('estoque')}
                            isActive={isActive['estoque']}
                        >
                            <span>
                                <FontAwesomeIcon icon={faWarehouse} className="Side-Bar-Icon"/>
                                Estoque
                            </span>
                        </NavButton>
                    </NavLink>
                    <NavLink to="/backoffice/clientes">
                        <NavButton
                            type="button"
                            onClick={() => handleActiveMenuButton('clientes')}
                            isActive={isActive['clientes']}
                        >
                            <span>
                                <FontAwesomeIcon icon={faAddressCard} className="Side-Bar-Icon"/>
                                Clientes
                            </span>
                        </NavButton>
                    </NavLink>
                    <NavLink to="/backoffice/administradores">
                        <NavButton
                            type="button"
                            onClick={() => handleActiveMenuButton('administradores')}
                            isActive={isActive['administradores']}
                        >
                            <span>
                                <FontAwesomeIcon icon={faUserShield} className="Side-Bar-Icon"/>
                                Vendedores
                            </span>
                        </NavButton>
                    </NavLink>
                    <NavLink to="/backoffice/valores-a-receber">
                        <NavButton
                            type="button"
                            onClick={() => handleActiveMenuButton('valoresAReceber')}
                            isActive={isActive['valoresAReceber']}
                        >
                            <i className="material-icons">account_balance_wallet</i>
                            <span>Ordens para receber</span>
                        </NavButton>
                    </NavLink>
                    <NavLink to="/backoffice/valores-a-receber">
                        <NavButton
                            type="button"
                            onClick={() => handleActiveMenuButton('entregas')}
                            isActive={isActive['entregas']}
                        >
                            <i className="material-icons">delivery_dining</i>
                            <span>Entregas</span>
                        </NavButton>
                    </NavLink>
                    <NavLink to="/backoffice/motoboys">
                        <NavButton
                            type="button"
                            onClick={() => handleActiveMenuButton('motoboys')}
                            isActive={isActive['motoboys']}
                        >
                            <FontAwesomeIcon icon={faMotorcycle} className="Side-Bar-Icon"/>
                            <span> Motoboys</span>
                        </NavButton>
                    </NavLink>
                    <NavLink to="/backoffice/pix">
                        <NavButton
                            type="button"
                            onClick={() => handleActiveMenuButton('pix')}
                            isActive={isActive['pix']}
                        >
                            <span>
                                <FontAwesomeIcon icon={faPix as any} className="Side-Bar-Icon"/>
                                Pix
                            </span>
                        </NavButton>
                    </NavLink>
                </MenuList>
            </ModalContainer>
        </Modal>
    )
};